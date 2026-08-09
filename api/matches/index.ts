import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../_db';
import { getUserFromAuthHeader } from '../_auth';
import type { MatchRecord } from '../../src/types';

// GET  /api/matches  → list all matches (newest first)
// POST /api/matches  → create a match
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = getUserFromAuthHeader(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'Neautorizovaný prístup.' });
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        `SELECT id, date, map_id, player1_civ_id, player1_color_id,
                player2_civ_id, player2_color_id, winner
         FROM matches
         ORDER BY created_at DESC`
      );
      const matches: MatchRecord[] = result.rows.map((r) => ({
        id: r.id,
        date: r.date,
        mapId: r.map_id,
        player1CivId: r.player1_civ_id,
        player1ColorId: r.player1_color_id ?? '',
        player2CivId: r.player2_civ_id,
        player2ColorId: r.player2_color_id ?? '',
        winner: r.winner,
      }));
      return res.status(200).json({ matches });
    } catch (err) {
      console.error('[matches GET] Error:', err);
      return res.status(500).json({ error: 'Nepodarilo sa načítať zápasy.' });
    }
  }

  if (req.method === 'POST') {
    const match = req.body as MatchRecord;
    if (!match || !match.id || !match.date || !match.mapId || !match.winner) {
      return res.status(400).json({ error: 'Neplatné dáta zápasu.' });
    }

    try {
      await pool.query(
        `INSERT INTO matches (id, date, map_id, player1_civ_id, player1_color_id,
                              player2_civ_id, player2_color_id, winner, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [
          match.id,
          match.date,
          match.mapId,
          match.player1CivId,
          match.player1ColorId ?? '',
          match.player2CivId,
          match.player2ColorId ?? '',
          match.winner,
          user.userId,
        ]
      );
      return res.status(201).json({ match });
    } catch (err) {
      console.error('[matches POST] Error:', err);
      return res.status(500).json({ error: 'Nepodarilo sa uložiť zápas.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
