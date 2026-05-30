"use server";

import { mockCards, getNextCardId } from "@/lib/mockStore";
import { revalidatePath } from "next/cache";

export async function createCard(deckId: number, front: string, back: string) {
  mockCards.push({
    id: getNextCardId(),
    deck_id: deckId,
    front: front.trim(),
    back: back.trim(),
    times_correct: 0,
    times_incorrect: 0,
    last_reviewed: null,
    created_at: new Date().toISOString(),
  });
  revalidatePath(`/decks/${deckId}`);
}

export async function updateCard(id: number, deckId: number, front: string, back: string) {
  const card = mockCards.find((c) => c.id === id);
  if (card) {
    card.front = front.trim();
    card.back = back.trim();
  }
  revalidatePath(`/decks/${deckId}`);
}

export async function deleteCard(id: number, deckId: number) {
  const idx = mockCards.findIndex((c) => c.id === id);
  if (idx !== -1) mockCards.splice(idx, 1);
  revalidatePath(`/decks/${deckId}`);
}

export async function saveStudySession(
  deckId: number,
  results: { cardId: number; knew: boolean }[]
) {
  const now = new Date().toISOString();
  for (const r of results) {
    const card = mockCards.find((c) => c.id === r.cardId);
    if (card) {
      if (r.knew) {
        card.times_correct += 1;
      } else {
        card.times_incorrect += 1;
      }
      card.last_reviewed = now;
    }
  }
  revalidatePath(`/decks/${deckId}`);
}
