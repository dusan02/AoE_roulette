import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { hashPassword, signToken } from '../_auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email a heslo sú povinné.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Heslo musí mať aspoň 6 znakov.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({ error: 'Používateľ s týmto emailom už existuje.' });
    }

    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [normalizedEmail, passwordHash]
    );
    const user = result.rows[0];

    const token = signToken({ userId: user.id, email: user.email });
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('[signup] Error:', err);
    return res.status(500).json({ error: 'Nepodarilo sa vytvoriť účet.' });
  }
}
