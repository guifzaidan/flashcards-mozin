"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { DeckList } from "@/components/decks/DeckList";
import type { Deck } from "@/lib/queries/decks";
import type { Card } from "@/lib/queries/cards";

interface Props {
  decks: Deck[];
  allCards: Card[];
}

export function DeckSearchFilter({ decks, allCards }: Props) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  // Decks cujos cards contenham a keyword
  const filtered = q
    ? decks.filter((deck) =>
        // também aceita match no nome do deck
        deck.name.toLowerCase().includes(q) ||
        allCards.some(
          (c) =>
            c.deck_id === deck.id &&
            (c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q))
        )
      )
    : decks;

  // Conta quantos cards batem a busca (para o label)
  const matchingCards = q
    ? allCards.filter(
        (c) => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Buscar por palavra-chave nos cards..."
      />

      {q && (
        <p className="text-xs text-gray-400 font-semibold">
          {matchingCards.length === 0
            ? "Nenhum card encontrado"
            : `${matchingCards.length} ${matchingCards.length === 1 ? "card encontrado" : "cards encontrados"} em ${filtered.length} ${filtered.length === 1 ? "deck" : "decks"}`}
        </p>
      )}

      <DeckList decks={filtered} />
    </div>
  );
}
