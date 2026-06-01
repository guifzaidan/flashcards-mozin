"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDeck(name: string) {
  await db.execute({
    sql: "INSERT INTO decks (name) VALUES (?)",
    args: [name.trim()],
  });
  revalidatePath("/decks");
}

export async function renameDeck(id: number, name: string) {
  await db.execute({
    sql: "UPDATE decks SET name = ? WHERE id = ?",
    args: [name.trim(), id],
  });
  revalidatePath("/decks");
}

export async function deleteDeck(id: number) {
  await db.execute({
    sql: "DELETE FROM decks WHERE id = ?",
    args: [id],
  });
  revalidatePath("/decks");
}
