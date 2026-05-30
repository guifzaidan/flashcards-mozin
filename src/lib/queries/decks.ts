import { mockDecks, mockCards } from "@/lib/mockStore";

export interface Deck {
  id: number;
  name: string;
  created_at: string;
  card_count?: number;
}

export async function getDecksWithCardCount(): Promise<Deck[]> {
  return mockDecks.map((d) => ({
    ...d,
    card_count: mockCards.filter((c) => c.deck_id === d.id).length,
  }));
}

export async function getDeckById(id: number): Promise<Deck | null> {
  return mockDecks.find((d) => d.id === id) ?? null;
}
