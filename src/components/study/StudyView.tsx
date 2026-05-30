"use client";

import { useState, useCallback, useTransition } from "react";
import { FlipCard } from "./FlipCard";
import { StudyResult } from "./StudyResult";
import { saveStudySession } from "@/actions/cardActions";
import { FaceSmile, FaceSad, FlipArrows } from "@/components/icons";
import type { Card } from "@/lib/queries/cards";

interface SessionResult { cardId: number; knew: boolean }
type ExitDir = "left" | "right" | null;

function sortByDifficulty(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const ra = a.times_incorrect / (a.times_correct + a.times_incorrect + 1);
    const rb = b.times_incorrect / (b.times_correct + b.times_incorrect + 1);
    return rb - ra;
  });
}

export function StudyView({ cards, deckId }: { cards: Card[]; deckId: number }) {
  const [deck, setDeck] = useState(() => sortByDifficulty(cards));
  const [index, setIndex] = useState(0);
  const [cardKey, setCardKey] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [exitDir, setExitDir] = useState<ExitDir>(null);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentCard = deck[index];
  const total = deck.length;

  const handleAnswer = useCallback((knew: boolean) => {
    setExitDir(knew ? "right" : "left");
    setTimeout(() => {
      const newResults = [...results, { cardId: currentCard.id, knew }];
      const next = index + 1;
      if (next >= total) {
        startTransition(async () => {
          await saveStudySession(deckId, newResults);
          setResults(newResults);
          setFinished(true);
        });
      } else {
        setResults(newResults);
        setIndex(next);
        setCardKey((k) => k + 1);
        setIsFlipped(false);
        setExitDir(null);
      }
    }, 210);
  }, [results, currentCard, index, total, deckId]);

  function handleStudyAgain() {
    setDeck(sortByDifficulty(cards));
    setIndex(0); setCardKey(0); setIsFlipped(false);
    setResults([]); setFinished(false); setExitDir(null);
  }

  if (finished) {
    const knew = results.filter((r) => r.knew).length;
    return (
      <div className="flex-1 min-h-0 overflow-y-auto">
        <StudyResult
          knew={knew}
          didntKnow={results.length - knew}
          total={total}
          deckId={deckId}
          onStudyAgain={handleStudyAgain}
        />
      </div>
    );
  }

  const progress = Math.round((index / total) * 100);
  const exitClass = exitDir === "left" ? "card-exit-left" : exitDir === "right" ? "card-exit-right" : "";

  return (
    /* Layout coluna: progress → card (flex-1) → botões */
    <div className="flex flex-col flex-1 min-h-0 gap-4">

      {/* Progress */}
      <div className="shrink-0">
        <div className="flex justify-between items-center mb-1.5">
          <span
            className="font-black text-[#133266]"
            style={{ fontFamily: "var(--font-caveat)", fontSize: "1.05rem" }}
          >
            {index + 1} / {total}
          </span>
          <span
            className="font-black text-[#133266] px-2 py-0.5 rounded-full text-sm"
            style={{ backgroundColor: "#EFC1C4", border: "2px solid #133266", fontFamily: "var(--font-caveat)" }}
          >
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden bg-white" style={{ border: "2px solid #133266" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: "#133266",
              transition: "width 0.5s cubic-bezier(.175,.885,.32,1.275)",
            }}
          />
        </div>
      </div>

      {/* Card — ocupa todo espaço disponível */}
      <div
        key={cardKey}
        className={`flex-1 min-h-0 cursor-pointer select-none ${exitClass || "card-enter"}`}
        onClick={() => !isFlipped && !exitDir && setIsFlipped(true)}
      >
        <FlipCard front={currentCard.front} back={currentCard.back} isFlipped={isFlipped} />
      </div>

      {/* Botões — fixos no fundo, acessíveis pelo polegar */}
      <div className="shrink-0 flex gap-3 pb-2">
        {!isFlipped ? (
          <button
            onClick={() => setIsFlipped(true)}
            className="btn-cartoon icon-spin flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xl text-[#133266]"
            style={{
              backgroundColor: "#EFC1C4",
              border: "3px solid #133266",
              boxShadow: "4px 4px 0 #133266",
              fontFamily: "var(--font-caveat)",
              minHeight: "60px",
            }}
          >
            <FlipArrows size={22} strokeWidth={2.5} />
            Virar
          </button>
        ) : (
          <>
            <button
              onClick={() => handleAnswer(false)}
              disabled={isPending || !!exitDir}
              className="btn-cartoon icon-wiggle flex-1 flex items-center justify-center gap-2 rounded-2xl font-black text-xl text-[#133266] bg-white disabled:opacity-50"
              style={{
                border: "3px solid #133266",
                boxShadow: "4px 4px 0 #133266",
                fontFamily: "var(--font-caveat)",
                minHeight: "60px",
              }}
            >
              <FaceSad size={22} strokeWidth={2.5} />
              Esqueci
            </button>
            <button
              onClick={() => handleAnswer(true)}
              disabled={isPending || !!exitDir}
              className="btn-cartoon icon-pop flex-1 flex items-center justify-center gap-2 rounded-2xl font-black text-xl text-[#133266] disabled:opacity-50"
              style={{
                backgroundColor: "#EFC1C4",
                border: "3px solid #133266",
                boxShadow: "4px 4px 0 #133266",
                fontFamily: "var(--font-caveat)",
                minHeight: "60px",
              }}
            >
              <FaceSmile size={22} strokeWidth={2.5} />
              Sabia!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
