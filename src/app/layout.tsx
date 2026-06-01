import type { Metadata, Viewport } from "next";
import { Poppins, Fredoka } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mozin Flashcards",
  description: "Seus flashcards de medicina",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${fredoka.variable} h-full`}>
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: "#F0EEE9",
          backgroundImage: "radial-gradient(#13326622 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
          fontFamily: "var(--font-poppins), sans-serif",
        }}
      >
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
