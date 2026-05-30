"use client";

import { useRef } from "react";

interface Props {
  deckCount: number;
  cardCount: number;
}

// Sticker badges no rodapé do hero
const badges = [
  { label: "medicina",  bg: "#EFC1C4", rot: -3,  depth: 1.4 },
  { label: "provas",    bg: "#A5DAE3", rot:  4,   depth: 1.8 },
  { label: "anki-like", bg: "#EFE8C1", rot: -5,  depth: 1.2 },
];

export function HeroSection({ deckCount, cardCount }: Props) {
  const heroRef   = useRef<HTMLDivElement>(null);
  const boxRef    = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const badge3Ref = useRef<HTMLDivElement>(null);
  const badgeRefs = [badge1Ref, badge2Ref, badge3Ref];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    // Caixa do título: tilt suave
    if (boxRef.current) {
      boxRef.current.style.transform =
        `rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(0)`;
    }

    // Badges: tilt mais agressivo com depths diferentes
    badges.forEach((b, i) => {
      const el = badgeRefs[i].current;
      if (!el) return;
      el.style.transform =
        `rotate(${b.rot}deg) rotateX(${-y * 14 * b.depth}deg) rotateY(${x * 14 * b.depth}deg) translateZ(0)`;
    });
  }

  function handleMouseLeave() {
    if (boxRef.current) {
      boxRef.current.style.transition = "transform 0.6s cubic-bezier(.175,.885,.32,1.275)";
      boxRef.current.style.transform  = "translateZ(0)";
      setTimeout(() => { if (boxRef.current) boxRef.current.style.transition = ""; }, 600);
    }
    badges.forEach((b, i) => {
      const el = badgeRefs[i].current;
      if (!el) return;
      el.style.transition = "transform 0.6s cubic-bezier(.175,.885,.32,1.275)";
      el.style.transform  = `rotate(${b.rot}deg) translateZ(0)`;
      setTimeout(() => { if (el) el.style.transition = ""; }, 600);
    });
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full flex flex-col items-center text-center px-4 pt-14 pb-10 select-none"
      style={{
        perspective: "900px",
      }}
    >
      {/* Logo — sticker de cartas empilhadas */}
      <div
        className="relative w-14 h-14 mb-6 stagger-hero-1"
        style={{ filter: "drop-shadow(3px 3px 0 #133266)", "--sr": "0deg" } as React.CSSProperties}
      >
        <div className="absolute inset-0 rounded-2xl"
             style={{ backgroundColor: "#A5DAE3", border: "2.5px solid #133266", transform: "translate(3px, 3px)" }} />
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
             style={{ backgroundColor: "#EFC1C4", border: "2.5px solid #133266" }}>
          <span className="font-black text-[#133266] text-xs leading-none"
                style={{ fontFamily: "var(--font-caveat)" }}>FL<br/>IP</span>
        </div>
      </div>

      {/* Título */}
      <p
        className="font-black text-[#133266] text-3xl sm:text-4xl leading-none mb-3 stagger-hero-2"
        style={{ fontFamily: "var(--font-caveat)", "--sr": "0deg" } as React.CSSProperties}
      >
        Mozin —
      </p>

      {/* Palavra destaque em caixa brutalist interativa */}
      <div
        className="stagger-hero-3 relative mb-2"
        style={{ paddingRight: "6px", paddingBottom: "6px", "--sr": "0deg" } as React.CSSProperties}
      >
        {/* Sombra estática */}
        <div className="absolute rounded-xl bg-[#133266]"
             style={{ top: "6px", left: "6px", right: 0, bottom: 0 }} />
        {/* Caixa */}
        <div
          ref={boxRef}
          className="hero-sticker relative px-6 py-2 rounded-xl cursor-default"
          style={{
            backgroundColor: "#EFC1C4",
            border: "3px solid #133266",
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <span
            className="font-black text-[#133266] text-4xl sm:text-5xl leading-tight"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            Flashcards
          </span>
        </div>
      </div>

      {/* Subtítulo */}
      <p
        className="text-sm text-gray-400 font-semibold mt-4 mb-8 max-w-xs stagger-hero-4"
        style={{ lineHeight: 1.6, "--sr": "0deg" } as React.CSSProperties}
      >
        Seus flashcards de medicina, organizados por deck e priorizados por dificuldade.
      </p>

      {/* Badge stickers — stats + tags */}
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {/* Deck count */}
        <div className="relative stagger-hero-1" style={{ paddingRight: "5px", paddingBottom: "5px" }}>
          <div className="absolute inset-0 rounded-xl bg-[#133266]"
               style={{ top: "5px", left: "5px", right: 0, bottom: 0 }} />
          <div
            ref={badge1Ref}
            className="hero-sticker relative px-4 py-2 rounded-xl"
            style={{
              backgroundColor: "#133266",
              border: "2.5px solid #133266",
              transform: "rotate(-3deg) translateZ(0)",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <span className="font-black text-white text-base" style={{ fontFamily: "var(--font-caveat)" }}>
              {deckCount} {deckCount === 1 ? "deck" : "decks"}
            </span>
          </div>
        </div>

        {/* Tag badges */}
        {badges.map((b, i) => (
          <div key={b.label} className={`relative stagger-hero-${i + 2}`}
               style={{ paddingRight: "5px", paddingBottom: "5px" }}>
            <div className="absolute inset-0 rounded-xl bg-[#133266]"
                 style={{ top: "5px", left: "5px", right: 0, bottom: 0 }} />
            <div
              ref={badgeRefs[i]}
              className="hero-sticker relative px-4 py-2 rounded-xl"
              style={{
                backgroundColor: b.bg,
                border: "2.5px solid #133266",
                transform: `rotate(${b.rot}deg) translateZ(0)`,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <span className="font-black text-[#133266] text-base" style={{ fontFamily: "var(--font-caveat)" }}>
                {b.label}
              </span>
            </div>
          </div>
        ))}

        {/* Card count */}
        <div className="relative stagger-hero-4" style={{ paddingRight: "5px", paddingBottom: "5px" }}>
          <div className="absolute inset-0 rounded-xl bg-[#133266]"
               style={{ top: "5px", left: "5px", right: 0, bottom: 0 }} />
          <div
            className="hero-sticker relative px-4 py-2 rounded-xl"
            style={{
              backgroundColor: "#AED5CC",
              border: "2.5px solid #133266",
              transform: "rotate(4deg) translateZ(0)",
              willChange: "transform",
            }}
          >
            <span className="font-black text-[#133266] text-base" style={{ fontFamily: "var(--font-caveat)" }}>
              {cardCount} {cardCount === 1 ? "card" : "cards"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
