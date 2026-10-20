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

function sendChannelMessage(channelId, content, embeds = []) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ content, embeds });
    const req = https.request({
      hostname: 'discord.com',
      path: `/api/v10/channels/${channelId}/messages`,
      method: 'POST',
      headers: {
        'Authorization': 'Bot ' + BOT_TOKEN,
        'User-Agent': 'DiscordBot (DenAlerts, 1.0)',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function createDMChannel(userId) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ recipient_id: userId });
    const req = https.request({
      hostname: 'discord.com',
      path: '/api/v10/users/@me/channels',
      method: 'POST',
      headers: {
        'Authorization': 'Bot ' + BOT_TOKEN,
        'User-Agent': 'DiscordBot (DenAlerts, 1.0)',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(b);
          if (res.statusCode >= 200 && res.statusCode < 300 && parsed.id) {
            resolve(parsed.id);
          } else {
            resolve(null);
          }
        } catch (_) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

async function sendDirectMessage(userId, content, embeds = []) {
  try {
    const dmChannelId = await createDMChannel(userId);
    if (!dmChannelId) {
      console.warn(`[Discord Bot] Could not open DM channel with user ${userId} (DMs might be closed).`);
      return { status: 403, error: 'Could not open DM channel' };
    }
    return await sendChannelMessage(dmChannelId, content, embeds);
  } catch (err) {
    console.warn(`[Discord Bot] Failed to send DM to user ${userId}:`, err.message);
    return { status: 500, error: err.message };
  }
}

let ws = null;
let heartbeatInterval = null;
let sequenceNumber = null;
let isReconnecting = false;

function connectGateway() {
  if (!BOT_TOKEN || isReconnecting) return;
  try {
    ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');

    ws.on('open', () => {
      console.log('[Discord Bot] Connected to Discord Gateway.');
      isReconnecting = false;
    });

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.s) sequenceNumber = msg.s;

        // Opcode 10: Hello (Begin Heartbeat & Identify)
        if (msg.op === 10) {
          const interval = msg.d.heartbeat_interval;
          if (heartbeatInterval) clearInterval(heartbeatInterval);
          heartbeatInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 1, d: sequenceNumber }));
            }
          }, interval);

          // Identify with GUILDS (1) and GUILD_MEMBERS (2) intents
          ws.send(JSON.stringify({
            op: 2,
            d: {
              token: BOT_TOKEN,
              intents: 3, // GUILDS | GUILD_MEMBERS
              properties: {
                os: 'windows',
                browser: 'denalerts',
                device: 'denalerts'
              }
            }
          }));
        }

        // Opcode 0: Dispatch Events
        if (msg.op === 0) {
          if (msg.t === 'READY') {
            console.log(`[Discord Bot] Logged in as ${msg.d.user.username}#${msg.d.user.discriminator} (ID: ${msg.d.user.id}). Auto-role active for 'Upi Alerts'!`);
          }

          // Member Joined Guild Event
          if (msg.t === 'GUILD_MEMBER_ADD') {
            const member = msg.d;
            const guildId = member.guild_id;
            const user = member.user;

            if (guildId === GUILD_ID && user) {
              console.log(`[Discord Bot] New member joined: ${user.username} (${user.id}). Auto-granting 'Upi Alerts' role...`);
              const res = await addRole(guildId, user.id, ROLE_UPI_ALERTS);

              if (res.status === 204) {
                console.log(`[Discord Bot] Successfully granted 'Upi Alerts' role to ${user.username} (${user.id}).`);
                
                // Send welcome message directly to the new joiner's DM (prevents channel spam)
                const dmText = `👋 **Welcome to SRB Studio, ${user.username}!**\n\n` +
                  `You have been automatically assigned the **Upi Alerts** role.\n\n` +
                  `🚀 **Get Started with DenAlerts (Live UPI Stream Alerts):**\n` +
                  `• **Setup Guide:** Check <#${CHANNEL_GETTING_STARTED}> in our server\n` +
                  `• **Community & Support:** Ask questions in <#${CHANNEL_SUPPORT}>\n` +
                  `• **Creator Dashboard:** https://alerts.denbooks.in/dashboard\n\n` +
                  `Need help? Join the voice channels in the server anytime! 🎙️`;

                const dmRes = await sendDirectMessage(user.id, dmText);
                if (dmRes && (dmRes.status === 200 || dmRes.status === 201)) {
                  console.log(`[Discord Bot] Welcome DM successfully delivered to ${user.username} (${user.id}).`);
                } else {
                  console.log(`[Discord Bot] Note: ${user.username} has direct messages disabled from server members.`);
                }
              } else {
                console.error(`[Discord Bot] Failed to assign role to ${user.username}:`, res.status, res.body);
              }
            }
          }
        }

        // Opcode 1: Heartbeat requested by Discord
        if (msg.op === 1) {
          ws.send(JSON.stringify({ op: 1, d: sequenceNumber }));
        }

        // Opcode 7: Reconnect request
        if (msg.op === 7) {
          console.log('[Discord Bot] Received Reconnect request from Gateway.');
          reconnect();
        }

        // Opcode 9: Invalid Session
        if (msg.op === 9) {
          console.log('[Discord Bot] Gateway Session Invalid. Re-identifying...');
          setTimeout(connectGateway, 2000);
        }

      } catch (err) {
        console.warn('[Discord Bot] Message parse error:', err.message);
      }
    });

    ws.on('close', (code, reason) => {
      console.warn(`[Discord Bot] Gateway connection closed (${code}): ${reason}. Reconnecting in 5s...`);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      reconnect();
    });

    ws.on('error', (err) => {
      console.warn('[Discord Bot] Gateway error:', err.message);
    });

  } catch (e) {
    console.error('[Discord Bot] Setup error:', e.message);
    reconnect();
  }
}

function reconnect() {
  if (isReconnecting) return;
  isReconnecting = true;
  if (ws) {
    try { ws.terminate(); } catch (_) {}
  }
  setTimeout(() => {
    isReconnecting = false;
    connectGateway();
  }, 5000);
}

// Start bot
connectGateway();

module.exports = {
  addRole,
  sendChannelMessage,
  sendDirectMessage
};
