"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCard(deckId: number, front: string, back: string) {
  await db.execute({
    sql: "INSERT INTO cards (deck_id, front, back) VALUES (?, ?, ?)",
    args: [deckId, front.trim(), back.trim()],
  });
  revalidatePath(`/decks/${deckId}`);
}

export async function updateCard(id: number, deckId: number, front: string, back: string) {
  await db.execute({
    sql: "UPDATE cards SET front = ?, back = ? WHERE id = ?",
    args: [front.trim(), back.trim(), id],
  });
  revalidatePath(`/decks/${deckId}`);
}

export async function deleteCard(id: number, deckId: number) {
  await db.execute({
    sql: "DELETE FROM cards WHERE id = ?",
    args: [id],
  });
  revalidatePath(`/decks/${deckId}`);
}

export async function saveStudySession(
  deckId: number,
  results: { cardId: number; knew: boolean }[]
) {
  const now = new Date().toISOString();
  for (const r of results) {
    if (r.knew) {
      await db.execute({
        sql: "UPDATE cards SET times_correct = times_correct + 1, last_reviewed = ? WHERE id = ?",
        args: [now, r.cardId],
      });
    } else {
      await db.execute({
        sql: "UPDATE cards SET times_incorrect = times_incorrect + 1, last_reviewed = ? WHERE id = ?",
        args: [now, r.cardId],
      });
    }
  }
  revalidatePath(`/decks/${deckId}`);
}
