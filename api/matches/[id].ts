import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { getUserFromAuthHeader } from '../_auth';
import type { MatchRecord } from '../../src/types';

// PUT    /api/matches/:id  → update a match
// DELETE /api/matches/:id  → delete a match
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = getUserFromAuthHeader(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'Neautorizovaný prístup.' });
  }

  const { id } = req.query as { id: string };
  if (!id) {
    return res.status(400).json({ error: 'Chýba ID zápasu.' });
  }

  if (req.method === 'PUT') {
    const match = req.body as MatchRecord;
    if (!match || match.id !== id) {
      return res.status(400).json({ error: 'Neplatné dáta zápasu.' });
    }

    try {
      await pool.query(
        `UPDATE matches
         SET date = $2, map_id = $3, player1_civ_id = $4, player1_color_id = $5,
             player2_civ_id = $6, player2_color_id = $7, winner = $8
         WHERE id = $1`,
        [
          match.id,
          match.date,
          match.mapId,
          match.player1CivId,
          match.player1ColorId ?? '',
          match.player2CivId,
          match.player2ColorId ?? '',
          match.winner,
        ]
      );
      return res.status(200).json({ match });
    } catch (err) {
      console.error('[matches PUT] Error:', err);
      return res.status(500).json({ error: 'Nepodarilo sa upraviť zápas.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM matches WHERE id = $1', [id]);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[matches DELETE] Error:', err);
      return res.status(500).json({ error: 'Nepodarilo sa vymazať zápas.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
