"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { DeckFormDialog } from "./DeckFormDialog";
import { DeleteDeckDialog } from "./DeleteDeckDialog";
import type { Deck } from "@/lib/queries/decks";

interface Props {
  deck: Deck;
  accentColor: string;
  index: number;
}

export function DeckCard({ deck, accentColor, index: _index }: Props) {
  const count = deck.card_count ?? 0;
  const rot = 0;

  return (
    /*
      Wrapper: tem padding bottom+right para dar espaço à sombra estática.
      A sombra (.deck-shadow) ocupa esse espaço e NUNCA se move.
      O card (.deck-card) levanta sobre ela no hover/active — efeito brutalista.
    */
    <div className="relative" style={{ paddingRight: "6px", paddingBottom: "6px" }}>

      {/* Sombra estática — fica presa ao fundo enquanto o card sobe */}
      <div
        className="absolute rounded-2xl bg-[#133266]"
        style={{ top: "6px", left: "6px", right: 0, bottom: 0 }}
        aria-hidden="true"
      />

      {/* Card — levanta sobre a sombra */}
      <div
        className="deck-card group relative bg-white"
        style={{
          "--card-rot": `${rot}deg`,
          border: "3px solid #133266",
          borderRadius: "16px",
        } as React.CSSProperties}
      >
        {/* Shine sweep */}
        <div className="shine" />

        {/* Accent stripe */}
        <div
          className="accent-stripe absolute left-0 top-0 bottom-0 w-3 rounded-l-[12px]"
          style={{ backgroundColor: accentColor, borderRight: "3px solid #133266" }}
        />

        <div className="pl-6 pr-3 py-3.5 flex items-center gap-2 sm:gap-3 relative z-10">

          {/* Nome + subtítulo */}
          <Link href={`/decks/${deck.id}`} className="flex-1 min-w-0 py-0.5">
            <p
              className="font-black text-[#133266] leading-tight truncate
                         group-hover:text-[#1a3f7a] transition-colors duration-200"
              style={{ fontFamily: "var(--font-caveat)", fontSize: "1.15rem" }}
            >
              {deck.name}
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">
              {count} {count === 1 ? "card" : "cards"}
            </p>
          </Link>

          {/* Badge de contagem */}
          <span
            className="count-pill shrink-0 font-black text-[#133266] px-2.5 py-1 rounded-full text-sm"
            style={{
              backgroundColor: accentColor,
              border: "2px solid #133266",
              fontFamily: "var(--font-caveat)",
            }}
          >
            {count}
          </span>

          {/* Edit / Delete */}
          <div className="card-actions flex gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-150 shrink-0">
            <DeckFormDialog
              mode="rename"
              deckId={deck.id}
              currentName={deck.name}
              trigger={
                <button
                  className="btn-cartoon flex items-center justify-center w-8 h-8 rounded-lg bg-white text-[#133266]"
                  style={{ border: "2px solid #133266", boxShadow: "2px 2px 0 #133266" }}
                >
                  <Pencil size={13} />
                </button>
              }
            />
            <DeleteDeckDialog
              deckId={deck.id}
              deckName={deck.name}
              trigger={
                <button
                  className="btn-cartoon flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor: "#EFC1C4",
                    border: "2px solid #133266",
                    boxShadow: "2px 2px 0 #133266",
                  }}
                >
                  <Trash2 size={13} color="#133266" />
                </button>
              }
            />
          </div>

        </div>
      </div>
    </div>
  );
}
