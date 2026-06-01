import { db } from "@/lib/db";

export interface Deck {
  id: number;
  name: string;
  created_at: string;
  card_count?: number;
}

export async function getDecksWithCardCount(): Promise<Deck[]> {
  const result = await db.execute(`
    SELECT d.id, d.name, d.created_at,
           COUNT(c.id) as card_count
    FROM decks d
    LEFT JOIN cards c ON c.deck_id = d.id
    GROUP BY d.id
    ORDER BY d.created_at DESC
  `);
  return result.rows as unknown as Deck[];
}

export async function getDeckById(id: number): Promise<Deck | null> {
  const result = await db.execute({
    sql: "SELECT * FROM decks WHERE id = ?",
    args: [id],
  });
  return (result.rows[0] as unknown as Deck) ?? null;
}
