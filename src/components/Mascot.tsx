"use client";

import { useState, useEffect, useCallback } from "react";

const MESSAGES = [
  "Vai conseguir! Cada questão é um passo! 💪",
  "Você está mais perto da aprovação! 🏆",
  "Medicina é paixão, e você tem de sobra! 🩺",
  "Revisão é o segredo dos melhores médicos! 📚",
  "Beba água e continue estudando! 💧",
  "Um card de cada vez — você chega lá! ⭐",
  "Acredita no processo! A prova vai ser sua! 🎯",
  "Mozin te apoia! Vai com tudo! 🔥",
  "Cada erro é uma lição. Continue! 🧠",
  "Hoje você planta, amanhã você colhe! 🌱",
  "Foco total! A aprovação está chegando! ✨",
  "Você é mais forte do que imagina! 💙",
];

const INTERVAL_MS = 18_000; // aparece a cada 18 segundos
const VISIBLE_MS  = 5_500;  // fica visível por 5,5 segundos

export function Mascot() {
  const [message, setMessage]   = useState<string | null>(null);
  const [visible, setVisible]   = useState(false);
  const [bounce,  setBounce]    = useState(false);

  const showMessage = useCallback(() => {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMessage(msg);
    setVisible(true);
    setBounce(true);
    setTimeout(() => setBounce(false), 600);
    setTimeout(() => setVisible(false), VISIBLE_MS);
  }, []);

  // Mostra a primeira mensagem após 4s e depois a cada INTERVAL_MS
  useEffect(() => {
    const first = setTimeout(showMessage, 4_000);
    const loop  = setInterval(showMessage, INTERVAL_MS);
    return () => { clearTimeout(first); clearInterval(loop); };
  }, [showMessage]);

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2"
      style={{ pointerEvents: "none" }}
    >
      {/* Balão de mensagem */}
      <div
        className="relative max-w-[220px]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(8px) scale(0.92)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div
          className="px-4 py-3 text-sm font-bold text-[#133266] bg-white leading-snug"
          style={{
            border: "2.5px solid #133266",
            borderRadius: "16px 16px 4px 16px",
            boxShadow: "3px 3px 0 #133266",
            fontFamily: "var(--font-caveat)",
            fontSize: "1rem",
          }}
        >
          {message}
        </div>
        {/* Ponteirinho do balão */}
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "18px",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "0px solid transparent",
            borderTop: "10px solid #133266",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-7px",
            right: "20px",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "0px solid transparent",
            borderTop: "8px solid white",
          }}
        />
      </div>

      {/* Avatar — clicável para nova mensagem */}
      <button
        onClick={showMessage}
        aria-label="Mensagem motivacional"
        className="select-none"
        style={{
          pointerEvents: "auto",
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#EFC1C4",
          border: "3px solid #133266",
          boxShadow: "3px 3px 0 #133266",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          cursor: "pointer",
          transform: bounce ? "scale(1.2) rotate(-8deg)" : "scale(1) rotate(0deg)",
          transition: "transform 0.3s cubic-bezier(.175,.885,.32,1.275)",
        }}
      >
        🩺
      </button>
    </div>
  );
}
