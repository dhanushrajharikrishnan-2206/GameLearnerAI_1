import crypto from 'node:crypto';

// Secret key for token signing (in production, use an environment variable)
const TOKEN_SECRET = process.env.JWT_SECRET || 'gamelearn_ai_secure_token_secret_2026_super_key';

/**
 * Hash password securely with salt using PBKDF2/scrypt
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

/**
 * Verify password against stored hash and salt
 */
export function verifyPassword(password, storedHash, storedSalt) {
  const hash = crypto.scryptSync(password, storedSalt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Create a simple signed token: base64(payload).signature
 */
export function createToken(payload) {
  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
  });
  const encodedData = Buffer.from(data).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(encodedData).digest('base64url');
  return `${encodedData}.${signature}`;
}

/**
 * Verify signed token and return payload, or null if invalid/expired
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedData, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(encodedData).digest('base64url');

  if (signature !== expectedSignature) {
    return null; // Tampered token
  }

  try {
    const data = JSON.parse(Buffer.from(encodedData, 'base64url').toString('utf8'));
    if (data.exp && Date.now() > data.exp) {
      return null; // Expired token
    }
    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Express middleware to authenticate Bearer token from header
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}
