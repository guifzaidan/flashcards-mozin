"use client";

interface Props {
  front: string;
  back: string;
  isFlipped: boolean;
}

export function FlipCard({ front, back, isFlipped }: Props) {
  return (
    /* h-full: ocupa todo o flex-1 do pai */
    <div className="w-full h-full" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.45s cubic-bezier(.4,0,.2,1)",
          willChange: "transform",
          minHeight: "200px",
        }}
      >
        {/* Frente */}
        <div
          className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 sm:p-8 text-center"
          style={{
            backfaceVisibility: "hidden",
            border: "3px solid #133266",
            borderRadius: "24px",
            boxShadow: "5px 5px 0 #133266",
          }}
        >
          <span
            className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 text-[#133266]"
            style={{ backgroundColor: "#EFC1C4", border: "2px solid #133266" }}
          >
            Questão
          </span>
          <p
            className="font-black text-[#133266] leading-snug"
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
            }}
          >
            {front}
          </p>
          <p className="text-xs text-gray-300 font-semibold mt-6 hidden sm:block">toque para virar</p>
        </div>

        {/* Verso */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: "#133266",
            border: "3px solid #133266",
            borderRadius: "24px",
            boxShadow: "5px 5px 0 rgba(0,0,0,0.25)",
          }}
        >
          <span
            className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 text-[#133266]"
            style={{ backgroundColor: "#A5DAE3", border: "2px solid rgba(255,255,255,0.3)" }}
          >
            Resposta
          </span>
          <p
            className="font-black text-white leading-snug"
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
            }}
          >
            {back}
          </p>
        </div>
      </div>
    </div>
  );
}
