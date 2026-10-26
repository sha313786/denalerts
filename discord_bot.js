require('dotenv').config();
const WebSocket = require('ws');
const https = require('https');

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID || '1525065834572021851';
const ROLE_UPI_ALERTS = process.env.DISCORD_ROLE_UPI_ALERTS || '1560178462642409533';
const CHANNEL_SUPPORT = process.env.DISCORD_CHANNEL_SUPPORT || '1560334098700967988';
const CHANNEL_GETTING_STARTED = process.env.DISCORD_CHANNEL_GETTING_STARTED || '1560334093927977001';

if (!BOT_TOKEN) {
  console.warn('[Discord Bot] DISCORD_BOT_TOKEN not found in .env; Discord bot disabled.');
}

function addRole(guildId, userId, roleId) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'discord.com',
      path: `/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      method: 'PUT',
      headers: {
        'Authorization': 'Bot ' + BOT_TOKEN,
        'User-Agent': 'DiscordBot (DenAlerts, 1.0)',
        'Content-Length': 0
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', reject);
    req.end();
  });
}

function sendChannelMessage(channelId, content) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ content });
    const req = https.request({
      hostname: 'discord.com',
      path: `/api/v10/channels/${channelId}/messages`,
      method: 'POST',
      headers: {
        'Authorization': 'Bot ' + BOT_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'DiscordBot (DenAlerts, 1.0)',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function sendDirectMessage(userId, content) {
  return new Promise((resolve, reject) => {
    // 1. Create DM channel
    const dmData = JSON.stringify({ recipient_id: userId });
    const dmReq = https.request({
      hostname: 'discord.com',
      path: `/api/v10/users/@me/channels`,
      method: 'POST',
      headers: {
        'Authorization': 'Bot ' + BOT_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'DiscordBot (DenAlerts, 1.0)',
        'Content-Length': Buffer.byteLength(dmData)
      }
    }, dmRes => {
      let dmBody = '';
      dmRes.on('data', c => dmBody += c);
      dmRes.on('end', () => {
        try {
          const dmChannel = JSON.parse(dmBody);
          if (dmChannel.id) {
            // 2. Send message to DM channel
            sendChannelMessage(dmChannel.id, content).then(resolve).catch(reject);
          } else {
            resolve({ status: dmRes.statusCode, body: dmBody });
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    dmReq.on('error', reject);
    dmReq.write(dmData);
    dmReq.end();
  });
}

// Gateway connection
let ws = null;
let heartbeatInterval = null;
let lastSequence = null;
let isReconnecting = false;

function connectGateway() {
  if (!BOT_TOKEN) return;
  if (isReconnecting) return;

  try {
    ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');

    ws.on('open', () => {
      console.log('[Discord Bot] Connected to Discord Gateway.');
    });

    ws.on('message', (data) => {
      try {
        const payload = JSON.parse(data);
        const { op, d, s, t } = payload;

        if (s !== null) lastSequence = s;

        // Opcode 10: Hello
        if (op === 10) {
          const { heartbeat_interval } = d;
          startHeartbeat(heartbeat_interval);
          identify();
        }

        // Opcode 11: Heartbeat ACK
        if (op === 11) {
          // ACK received
        }

        // Opcode 0: Dispatch
        if (op === 0) {
          handleDispatch(t, d);
        }

        // Opcode 7 or 9: Reconnect or Invalid Session
        if (op === 7 || op === 9) {
          reconnect();
        }
      } catch (e) {
        console.error('[Discord Bot] Gateway parsing error:', e);
      }
    });

    ws.on('close', (code, reason) => {
      console.warn(`[Discord Bot] Gateway closed (${code}: ${reason}). Reconnecting...`);
      stopHeartbeat();
      reconnect();
    });

    ws.on('error', (err) => {
      console.error('[Discord Bot] Gateway error:', err.message);
    });

  } catch (err) {
    console.error('[Discord Bot] Connection exception:', err);
    reconnect();
  }
}

function startHeartbeat(intervalMs) {
  stopHeartbeat();
  heartbeatInterval = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ op: 1, d: lastSequence }));
    }
  }, intervalMs);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function identify() {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  // Intents: GUILDS (1 << 0) | GUILD_MEMBERS (1 << 1) = 1 | 2 = 3
  const identifyPayload = {
    op: 2,
    d: {
      token: BOT_TOKEN,
      intents: 3,
      properties: {
        os: 'linux',
        browser: 'DenAlerts',
        device: 'DenAlerts'
      }
    }
  };
  ws.send(JSON.stringify(identifyPayload));
}

function handleDispatch(eventName, data) {
  // READY event
  if (eventName === 'READY') {
    console.log(`[Discord Bot] Logged in as ${data.user.username}#${data.user.discriminator} (ID: ${data.user.id}). Auto-role active for 'Upi Alerts'!`);
  }

  // GUILD_MEMBER_ADD event: User joins the Discord Server
  if (eventName === 'GUILD_MEMBER_ADD') {
    const member = data;
    const guildId = member.guild_id || GUILD_ID;
    const userId = member.user.id;
    const username = member.user.username;

    console.log(`[Discord Bot] New Member Joined: ${username} (${userId})`);

    // 1. Assign "Upi Alerts" Role Automatically
    addRole(guildId, userId, ROLE_UPI_ALERTS)
      .then(res => {
        if (res.status === 204) {
          console.log(`[Discord Bot] Successfully granted role 'Upi Alerts' (${ROLE_UPI_ALERTS}) to ${username}`);
        } else {
          console.warn(`[Discord Bot] Failed to grant role (HTTP ${res.status}):`, res.body);
        }
      })
      .catch(err => {
        console.error(`[Discord Bot] Error assigning role to ${username}:`, err);
      });

    // 2. Send Welcome DM with Getting Started Guide
    const welcomeMsg = `👋 **Welcome to SRB STUDIOS, ${username}!**\n\n` +
      `You have been automatically granted the **Upi Alerts** role! 🎉\n\n` +
      `🚀 **Get Started with DenAlerts (Live UPI Stream Alerts):**\n` +
      `  • **Setup Guide:** Check <#${CHANNEL_GETTING_STARTED}> in our server\n` +
      `  • **Support:** If you need any assistance, reach out in <#${CHANNEL_SUPPORT}>\n` +
      `  • **Cockpit & Dashboard:** https://alerts.denbooks.in\n\n` +
      `Happy Streaming! 🎮⚡`;

    sendDirectMessage(userId, welcomeMsg)
      .then(res => {
        console.log(`[Discord Bot] Welcome DM sent to ${username}`);
      })
      .catch(err => {
        console.warn(`[Discord Bot] Could not send welcome DM to ${username} (DMs might be closed):`, err.message);
      });
  }
}

function reconnect() {
  if (isReconnecting) return;
  isReconnecting = true;
  stopHeartbeat();
  if (ws) {
    try { ws.terminate(); } catch (_) {}
  }
  setTimeout(() => {
    isReconnecting = false;
    connectGateway();
  }, 5000);
}

// Start bot (disabled in serverless lambda environments like Vercel)
if (!process.env.VERCEL) {
  connectGateway();
}

module.exports = {
  addRole,
  sendChannelMessage,
  sendDirectMessage
};
