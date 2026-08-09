import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { verifyPassword, signToken } from '../_auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email a heslo sú povinné.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [normalizedEmail]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Nesprávny email alebo heslo.' });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Nesprávny email alebo heslo.' });
    }

    const token = signToken({ userId: user.id, email: user.email });
    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('[login] Error:', err);
    return res.status(500).json({ error: 'Nepodarilo sa prihlásiť.' });
  }
}
