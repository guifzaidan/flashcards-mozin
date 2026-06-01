export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDeckById } from "@/lib/queries/decks";
import { getCardsByDeckId } from "@/lib/queries/cards";
import { StudyView } from "@/components/study/StudyView";
import { ArrowLeft } from "@/components/icons";

interface Props {
  params: Promise<{ deckId: string }>;
}

export default async function StudyPage({ params }: Props) {
  const { deckId } = await params;
  const id = Number(deckId);
  const [deck, cards] = await Promise.all([getDeckById(id), getCardsByDeckId(id)]);
  if (!deck) notFound();
  if (cards.length === 0) notFound();

  return (
    /* 100dvh desconta a header (4rem = 64px) e respeita notch do iOS */
    <main
      className="flex flex-col w-full"
      style={{ height: "100dvh", overscrollBehavior: "contain" }}
    >
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-lg mx-auto px-4 pt-4 pb-safe">
        {/* Topo: voltar + nome do deck */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <Link
            href={`/decks/${id}`}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-[#133266] hover:bg-[#133266] hover:text-white transition-colors shrink-0"
            style={{ border: "2px solid #133266", boxShadow: "2px 2px 0 #133266" }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </Link>
          <h1
            className="font-black text-[#133266] truncate text-lg leading-tight"
            style={{ fontFamily: "var(--font-caveat)", fontSize: "1.25rem" }}
          >
            {deck.name}
          </h1>
        </div>

        {/* StudyView preenche o espaço restante */}
        <StudyView cards={cards} deckId={id} />
      </div>
    </main>
  );
}
