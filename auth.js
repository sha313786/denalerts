const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ACCOUNTS_FILE = path.join(__dirname, 'data', 'accounts.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(ACCOUNTS_FILE))) {
  fs.mkdirSync(path.dirname(ACCOUNTS_FILE), { recursive: true });
}

// In-memory accounts cache
let accounts = [];

function loadAccounts() {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf-8'));
    } else {
      accounts = [];
      saveAccounts();
    }
  } catch (err) {
    console.error('[Auth] Error reading accounts file:', err.message);
    accounts = [];
  }
}

function saveAccounts() {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Auth] Error writing accounts file:', err.message);
  }
}

loadAccounts();

// Cryptographic helpers using Node built-in crypto (scrypt + timingSafeEqual)
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password, salt, storedHash) {
  try {
    const computed = crypto.scryptSync(password, salt, 64).toString('hex');
    const a = Buffer.from(computed, 'hex');
    const b = Buffer.from(storedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (_) {
    return false;
  }
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generatePairingPin() {
  // Generate unique 6-digit PIN
  for (let attempt = 0; attempt < 100; attempt++) {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    const exists = accounts.some(a => a.pairingPin === pin);
    if (!exists) return pin;
  }
  return String(Date.now()).slice(-6);
}

function sanitizeId(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
}

/**
 * Register a new streamer account
 */
function register({ email, password, channelName }) {
  if (!email || typeof email !== 'string') {
    throw new Error('Valid email address is required.');
  }
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const cleanName = String(channelName || '').trim() || cleanEmail.split('@')[0];
  let baseId = sanitizeId(cleanName) || 'creator';

  // Check if baseId is available or if it matches an existing unlinked session
  let streamerKey = baseId;
  let counter = 1;
  while (accounts.some(a => a.streamerKey === streamerKey)) {
    streamerKey = `${baseId}_${counter++}`;
  }

  // Check if session file has a pre-existing pairingCode
  let pairingPin = generatePairingPin();
  const sessionPath = path.join(__dirname, 'data', 'sessions', `${streamerKey}.json`);
  if (fs.existsSync(sessionPath)) {
    try {
      const sData = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
      if (sData.pairingCode && /^\d{6}$/.test(sData.pairingCode)) {
        pairingPin = String(sData.pairingCode);
      }
    } catch (_) {}
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const token = generateToken();
  const now = Date.now();
  const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 days

  const user = {
    id: 'usr_' + crypto.randomBytes(8).toString('hex'),
    email: cleanEmail,
    channelName: cleanName,
    streamerKey,
    pairingPin,
    salt,
    passwordHash,
    createdAt: now,
    tokens: [
      {
        token,
        createdAt: now,
        expiresAt
      }
    ]
  };

  accounts.push(user);
  saveAccounts();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      channelName: user.channelName,
      streamerKey: user.streamerKey,
      pairingPin: user.pairingPin
    }
  };
}

/**
 * Authenticate existing user by email & password
 */
function login({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  const cleanEmail = String(email).trim().toLowerCase();
  const user = accounts.find(a => a.email.toLowerCase() === cleanEmail);

  if (!user) {
    // Artificial scrypt hash to prevent timing attacks / user enumeration
    hashPassword('dummy_password_timing_pad', '00112233445566778899aabbccddeeff');
    throw new Error('Invalid email or password.');
  }

  const valid = verifyPassword(password, user.salt, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid email or password.');
  }

  const token = generateToken();
  const now = Date.now();
  const expiresAt = now + (30 * 24 * 60 * 60 * 1000);

  // Prune expired tokens & add new
  user.tokens = (user.tokens || []).filter(t => t.expiresAt && t.expiresAt > now);
  user.tokens.push({ token, createdAt: now, expiresAt });
  saveAccounts();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      channelName: user.channelName,
      streamerKey: user.streamerKey,
      pairingPin: user.pairingPin
    }
  };
}

/**
 * Authenticate via Session Token
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const cleanToken = token.trim();
  const now = Date.now();

  const user = accounts.find(a => 
    a.tokens && a.tokens.some(t => t.token === cleanToken && t.expiresAt > now)
  );

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    channelName: user.channelName,
    streamerKey: user.streamerKey,
    pairingPin: user.pairingPin
  };
}

/**
 * Revoke Token (Logout)
 */
function logout(token) {
  if (!token) return false;
  let modified = false;
  accounts.forEach(u => {
    if (u.tokens) {
      const before = u.tokens.length;
      u.tokens = u.tokens.filter(t => t.token !== token);
      if (u.tokens.length !== before) modified = true;
    }
  });
  if (modified) saveAccounts();
  return true;
}

/**
 * Get account by pairing PIN (for Android mobile app matching)
 */
function getAccountByPairingPin(pin) {
  if (!pin) return null;
  return accounts.find(a => a.pairingPin === String(pin).trim()) || null;
}

/**
 * Get account by Streamer Key
 */
function getAccountByStreamerKey(key) {
  if (!key) return null;
  const clean = sanitizeId(key);
  return accounts.find(a => a.streamerKey === clean) || null;
}

/**
 * Delete account by Streamer Key or Email
 */
function deleteAccount(keyOrEmail) {
  if (!keyOrEmail) return false;
  const target = String(keyOrEmail).trim().toLowerCase();
  const cleanKey = sanitizeId(keyOrEmail);
  const before = accounts.length;
  accounts = accounts.filter(a => a.streamerKey !== cleanKey && a.email.toLowerCase() !== target);
  if (accounts.length !== before) {
    saveAccounts();
    return true;
  }
  return false;
}

module.exports = {
  register,
  login,
  verifyToken,
  logout,
  getAccountByPairingPin,
  getAccountByStreamerKey,
  deleteAccount,
  getAllAccounts: () => accounts
};
