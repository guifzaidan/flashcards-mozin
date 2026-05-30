"use client";

import Link from "next/link";
import { FaceSmile, FaceSad, FlipArrows, ArrowLeft, Trophy } from "@/components/icons";

interface Props {
  knew: number;
  didntKnow: number;
  total: number;
  deckId: number;
  onStudyAgain: () => void;
}

const MAZE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20zM40 0h20v20H40zM60 20h20v20H60zM0 40h20v20H0zM20 60h20v20H20zM40 40h20v20H40zM60 60h20v20H60z' fill='none' stroke='white' stroke-width='3'/%3E%3Cpath d='M20 0v20M0 20h20M40 20v20M20 40h20M60 0v20M40 20h20M80 40v20M60 60h20M0 60v20M20 80h-20M40 60v20M60 80H40' fill='none' stroke='white' stroke-width='3'/%3E%3C/svg%3E")`;

export function StudyResult({ knew, didntKnow, total, deckId, onStudyAgain }: Props) {
  const pct = total > 0 ? Math.round((knew / total) * 100) : 0;

  return (
    <div className="stagger-children flex flex-col gap-4 pb-4">
      {/* Hero score */}
      <div
        className="relative overflow-hidden text-center py-10 px-6"
        style={{
          backgroundColor: "#133266",
          border: "3px solid #133266",
          borderRadius: "24px",
          boxShadow: "5px 5px 0 rgba(19,50,102,0.3)",
          animation: "bounce-in 0.55s cubic-bezier(.175,.885,.32,1.275) both",
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: MAZE, backgroundSize: "80px 80px" }} />
        <div className="relative flex flex-col items-center gap-3">
          <div style={{ animation: "wiggle 0.6s 0.4s ease both" }}>
            <Trophy size={40} color="#EFC1C4" strokeWidth={2.5} />
          </div>
          <p
            className="font-black leading-none"
            style={{
              color: "#EFC1C4",
              fontFamily: "var(--font-caveat)",
              fontSize: "5.5rem",
              animation: "slide-up 0.4s 0.15s ease both",
            }}
          >
            {pct}%
          </p>
          <p className="text-white/60 font-semibold text-sm" style={{ animation: "slide-up 0.4s 0.25s ease both" }}>
            de acerto nessa sessão
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-white flex flex-col items-center justify-center py-6 rounded-2xl gap-2"
          style={{ border: "3px solid #133266", boxShadow: "4px 4px 0 #133266" }}
        >
          <div className="icon-pop"><FaceSmile size={36} strokeWidth={2.5} /></div>
          <p className="text-5xl font-black text-[#133266]" style={{ fontFamily: "var(--font-caveat)" }}>{knew}</p>
          <p className="text-sm font-bold text-gray-400">Sabia</p>
        </div>
        <div
          className="bg-white flex flex-col items-center justify-center py-6 rounded-2xl gap-2"
          style={{ border: "3px solid #133266", boxShadow: "4px 4px 0 #133266" }}
        >
          <div className="icon-wiggle"><FaceSad size={36} strokeWidth={2.5} /></div>
          <p className="text-5xl font-black text-[#133266]" style={{ fontFamily: "var(--font-caveat)" }}>{didntKnow}</p>
          <p className="text-sm font-bold text-gray-400">Esqueci</p>
        </div>
      </div>

      {/* Buttons */}
      <button
        onClick={onStudyAgain}
        className="btn-cartoon icon-spin w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xl text-[#133266]"
        style={{
          backgroundColor: "#EFC1C4",
          border: "3px solid #133266",
          boxShadow: "4px 4px 0 #133266",
          fontFamily: "var(--font-caveat)",
          "--shadow-color": "#133266",
        } as React.CSSProperties}
      >
        <FlipArrows size={22} strokeWidth={2.5} />
        Estudar de novo
      </button>

      <Link href={`/decks/${deckId}`}>
        <button
          className="btn-cartoon w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xl text-[#133266] bg-white"
          style={{
            border: "3px solid #133266",
            boxShadow: "4px 4px 0 #133266",
            fontFamily: "var(--font-caveat)",
            "--shadow-color": "#133266",
          } as React.CSSProperties}
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
          Voltar ao deck
        </button>
      </Link>
    </div>
  );
}
