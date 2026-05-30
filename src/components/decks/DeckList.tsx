import { DeckCard } from "./DeckCard";
import type { Deck } from "@/lib/queries/decks";
import { CardStack } from "@/components/icons";

const ACCENT_COLORS = ["#EFC1C4", "#A5DAE3", "#EFE8C1", "#AED5CC", "#AEBED6"];

export function DeckList({ decks }: { decks: Deck[] }) {
  if (decks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center bg-white gap-4"
        style={{
          border: "3px dashed #133266",
          borderRadius: "20px",
          boxShadow: "4px 4px 0 #133266",
          animation: "bounce-in 0.5s cubic-bezier(.175,.885,.32,1.275) both",
        }}
      >
        <div className="icon-float">
          <CardStack size={52} strokeWidth={2} />
        </div>
        <p className="text-2xl font-black text-[#133266]" style={{ fontFamily: "var(--font-caveat)" }}>
          Nenhum deck ainda!
        </p>
        <p className="text-sm text-gray-400 font-medium">Crie seu primeiro deck para começar a estudar</p>
      </div>
    );
  }

  return (
    <div className="stagger-children flex flex-col gap-5">
      {decks.map((deck, i) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
          index={i}
        />
      ))}
    </div>
  );
}
