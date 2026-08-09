// Shared auth helpers: password hashing + JWT sign/verify
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
const JWT_EXPIRES_IN = '30d';

export interface JwtPayload {
  userId: string;
  email: string;
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the Bearer token from an Authorization header.
 * Returns the payload or null.
 */
export function getUserFromAuthHeader(authHeader: string | null | undefined): JwtPayload | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return verifyToken(match[1]);
}
