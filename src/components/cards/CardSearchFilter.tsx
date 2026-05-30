"use client";

import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CardTable } from "@/components/cards/CardTable";
import type { Card } from "@/lib/queries/cards";

interface Props {
  cards: Card[];
  deckId: number;
}

export function CardSearchFilter({ cards, deckId }: Props) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = q
    ? cards.filter(
        (c) => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)
      )
    : cards;

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Buscar por palavra-chave..."
      />

      {q && (
        <p className="text-xs text-gray-400 font-semibold">
          {filtered.length === 0
            ? "Nenhum card encontrado"
            : `${filtered.length} ${filtered.length === 1 ? "card encontrado" : "cards encontrados"}`}
        </p>
      )}

      <CardTable cards={filtered} deckId={deckId} />
    </div>
  );
}
