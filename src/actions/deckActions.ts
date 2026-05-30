"use server";

import { mockDecks, getNextDeckId } from "@/lib/mockStore";
import { revalidatePath } from "next/cache";

export async function createDeck(name: string) {
  mockDecks.push({
    id: getNextDeckId(),
    name: name.trim(),
    created_at: new Date().toISOString(),
  });
  revalidatePath("/decks");
}

export async function renameDeck(id: number, name: string) {
  const deck = mockDecks.find((d) => d.id === id);
  if (deck) deck.name = name.trim();
  revalidatePath("/decks");
}

export async function deleteDeck(id: number) {
  const idx = mockDecks.findIndex((d) => d.id === id);
  if (idx !== -1) mockDecks.splice(idx, 1);
  revalidatePath("/decks");
}
