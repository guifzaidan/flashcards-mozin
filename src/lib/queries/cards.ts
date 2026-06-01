import { db } from "@/lib/db";

export interface Card {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  times_correct: number;
  times_incorrect: number;
  last_reviewed: string | null;
  created_at: string;
}

export async function getCardsByDeckId(deckId: number): Promise<Card[]> {
  const result = await db.execute({
    sql: "SELECT * FROM cards WHERE deck_id = ? ORDER BY created_at ASC",
    args: [deckId],
  });
  return result.rows as unknown as Card[];
}

export async function getCardById(id: number): Promise<Card | null> {
  const result = await db.execute({
    sql: "SELECT * FROM cards WHERE id = ?",
    args: [id],
  });
  return (result.rows[0] as unknown as Card) ?? null;
}

export async function getAllCards(): Promise<Card[]> {
  const result = await db.execute("SELECT * FROM cards");
  return result.rows as unknown as Card[];
}
