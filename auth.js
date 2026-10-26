const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? path.join(os.tmpdir(), 'denalerts_data') : path.join(__dirname, 'data');
const BUNDLED_ACCOUNTS_FILE = path.join(__dirname, 'data', 'accounts.json');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

// Ensure data directory exists safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[Auth] Warning creating data dir:', e.message);
}

// In-memory accounts cache
let accounts = [];

function loadAccounts() {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf-8'));
    } else if (fs.existsSync(BUNDLED_ACCOUNTS_FILE)) {
      accounts = JSON.parse(fs.readFileSync(BUNDLED_ACCOUNTS_FILE, 'utf-8'));
      saveAccounts();
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

/**
 * Generate 6-digit numeric pairing PIN (e.g. 482910)
 */
function generatePairingPin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Generate cryptographically secure auth token
 */
function generateToken() {
  return 'dat_' + crypto.randomBytes(32).toString('hex');
}

/**
 * Hash password with per-user salt using scrypt
 */
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

/**
 * Verify password against salt + hash
 */
function verifyPassword(password, salt, storedHash) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Clean & normalize channel/streamer name into a safe alphanumeric key
 */
function sanitizeId(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'streamer';
}

/**
 * Register a new user account
 */
function register({ email, password, channelName, defaultUpiId, preferredLang }) {
  if (!email || !password || !channelName) {
    throw new Error('Email, password, and channel name are required.');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanName = String(channelName).trim();

  // Basic email validation
  if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Check uniqueness
  if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email already exists.');
  }

  // Generate unique streamerKey (channelName sanitized)
  const baseId = sanitizeId(cleanName);
  let streamerKey = baseId;
  let counter = 1;
  while (accounts.some(a => a.streamerKey === streamerKey)) {
    streamerKey = `${baseId}_${counter++}`;
  }

  // Check if session file has a pre-existing pairingCode
  let pairingPin = generatePairingPin();
  const sessionPath = path.join(DATA_DIR, 'sessions', `${streamerKey}.json`);
  const bundledSessionPath = path.join(__dirname, 'data', 'sessions', `${streamerKey}.json`);
  const targetSessionPath = fs.existsSync(sessionPath) ? sessionPath : (fs.existsSync(bundledSessionPath) ? bundledSessionPath : null);
  if (targetSessionPath) {
    try {
      const sData = JSON.parse(fs.readFileSync(targetSessionPath, 'utf-8'));
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
