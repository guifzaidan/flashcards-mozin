import { mockCards } from "@/lib/mockStore";

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
  return mockCards.filter((c) => c.deck_id === deckId);
}

export async function getCardById(id: number): Promise<Card | null> {
  return mockCards.find((c) => c.id === id) ?? null;
}

export async function getAllCards(): Promise<Card[]> {
  return [...mockCards];
}
