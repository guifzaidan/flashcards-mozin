"use client";

import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFormDialog } from "./CardFormDialog";
import { DeleteCardDialog } from "./DeleteCardDialog";
import { PencilDraw } from "@/components/icons";
import type { Card } from "@/lib/queries/cards";

const ACCENT_COLORS = ["#EFC1C4", "#A5DAE3", "#EFE8C1", "#AED5CC", "#AEBED6"];
const ROTATIONS = [0, 0, 0, 0, 0, 0];

interface Props {
  cards: Card[];
  deckId: number;
}

export function CardTable({ cards, deckId }: Props) {
  if (cards.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-14 text-center bg-white gap-3"
        style={{ border: "3px dashed #133266", borderRadius: "20px" }}
      >
        <PencilDraw size={40} strokeWidth={2} />
        <p
          className="text-xl font-black text-[#133266]"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          Nenhum card ainda!
        </p>
        <p className="text-sm text-gray-400 font-medium">Adicione o primeiro card acima</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {cards.map((card, i) => {
        const total = card.times_correct + card.times_incorrect;
        const pct = total > 0 ? Math.round((card.times_correct / total) * 100) : null;
        const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
        const rot = ROTATIONS[i % ROTATIONS.length];

        return (
          <div
            key={card.id}
            className="deck-card group relative bg-white"
            style={{
              "--card-rot": `${rot}deg`,
              border: "3px solid #133266",
              borderRadius: "16px",
              boxShadow: "4px 4px 0 #133266",
            } as React.CSSProperties}
          >
            {/* Top label bar */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{
                backgroundColor: color,
                borderBottom: "2px solid #133266",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <span
                className="text-sm font-black text-[#133266]"
                style={{ fontFamily: "var(--font-caveat)", fontSize: "1rem" }}
              >
                Card {i + 1}
              </span>
              {pct !== null && (
                <span
                  className="text-xs font-black text-[#133266] px-2 py-0.5 rounded-full bg-white"
                  style={{ border: "1.5px solid #133266" }}
                >
                  {pct}% correto
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-1">Frente</p>
                <p
                  className="text-[#133266] font-semibold leading-snug line-clamp-4"
                  style={{ fontFamily: "var(--font-caveat)", fontSize: "1.05rem" }}
                >
                  {card.front}
                </p>
              </div>
              <div style={{ borderLeft: "2px dashed #e5e7eb", paddingLeft: "1rem" }}>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-1">Verso</p>
                <p
                  className="text-gray-500 leading-snug line-clamp-4"
                  style={{ fontFamily: "var(--font-caveat)", fontSize: "1.05rem" }}
                >
                  {card.back || <span className="italic text-gray-300">sem resposta</span>}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ borderTop: "2px dashed #e5e7eb" }}
            >
              <div className="flex items-center gap-3">
                {total > 0 ? (
                  <>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                      <CheckCircle size={11} /> {card.times_correct}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-red-400">
                      <XCircle size={11} /> {card.times_incorrect}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-300 font-medium">Não estudado ainda</span>
                )}
              </div>
              <div className="card-actions flex gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity">
                <CardFormDialog
                  deckId={deckId}
                  card={card}
                  trigger={
                    <button
                      className="btn-cartoon flex items-center justify-center w-7 h-7 rounded-lg bg-white text-[#133266]"
                      style={{ border: "2px solid #133266", boxShadow: "2px 2px 0 #133266" }}
                    >
                      <Pencil size={12} />
                    </button>
                  }
                />
                <DeleteCardDialog
                  cardId={card.id}
                  deckId={deckId}
                  trigger={
                    <button
                      className="btn-cartoon flex items-center justify-center w-7 h-7 rounded-lg"
                      style={{
                        backgroundColor: "#EFC1C4",
                        border: "2px solid #133266",
                        boxShadow: "2px 2px 0 #133266",
                      }}
                    >
                      <Trash2 size={12} color="#133266" />
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
