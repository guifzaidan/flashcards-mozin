import { notFound } from "next/navigation";
import Link from "next/link";
import { getDeckById } from "@/lib/queries/decks";
import { getCardsByDeckId } from "@/lib/queries/cards";
import { CardSearchFilter } from "@/components/cards/CardSearchFilter";
import { CardFormDialog } from "@/components/cards/CardFormDialog";
import { ArrowLeft, BookOpenIcon, FileImport } from "@/components/icons";

interface Props {
  params: Promise<{ deckId: string }>;
}

export default async function DeckDetailPage({ params }: Props) {
  const { deckId } = await params;
  const id = Number(deckId);
  const [deck, cards] = await Promise.all([getDeckById(id), getCardsByDeckId(id)]);
  if (!deck) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href="/decks"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#133266] transition-colors mb-5"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Voltar
      </Link>

      <div
        className="mb-6"
        style={{ animation: "slide-up 0.35s cubic-bezier(.175,.885,.32,1.275) both" }}
      >
        <h1
          className="text-2xl sm:text-3xl font-black text-[#133266] leading-tight mb-1"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          {deck.name}
        </h1>
        <p className="text-sm text-gray-400 font-semibold">
          {cards.length} {cards.length === 1 ? "flashcard" : "flashcards"}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {cards.length > 0 && (
            <Link href={`/decks/${deck.id}/study`} className="flex-1 sm:flex-none">
              <button
                className="btn-cartoon w-full sm:w-auto flex items-center justify-center gap-2 text-white font-black text-sm px-4 py-2 rounded-xl"
                style={{
                  backgroundColor: "#133266",
                  border: "2.5px solid #133266",
                  boxShadow: "3px 3px 0 rgba(19,50,102,0.25)",
                  fontFamily: "var(--font-caveat)",
                }}
              >
                <BookOpenIcon size={15} color="white" strokeWidth={2.5} />
                Estudar agora
              </button>
            </Link>
          )}
          <CardFormDialog
            deckId={deck.id}
            trigger={
              <button
                className="btn-cartoon flex-1 sm:flex-none flex items-center justify-center gap-2 font-black text-sm px-4 py-2 rounded-xl bg-white text-[#133266]"
                style={{
                  border: "2.5px solid #133266",
                  boxShadow: "3px 3px 0 #133266",
                  fontFamily: "var(--font-caveat)",
                }}
              >
                + Novo card
              </button>
            }
          />
          <Link href={`/decks/${deck.id}/import`} className="flex-1 sm:flex-none">
            <button
              className="btn-cartoon w-full flex items-center justify-center gap-2 font-black text-sm px-4 py-2 rounded-xl text-[#133266]"
              style={{
                backgroundColor: "#EFE8C1",
                border: "2.5px solid #133266",
                boxShadow: "3px 3px 0 #133266",
                fontFamily: "var(--font-caveat)",
              }}
            >
              <FileImport size={15} strokeWidth={2.5} />
              Importar PDF
            </button>
          </Link>
        </div>
      </div>

      <CardSearchFilter cards={cards} deckId={deck.id} />
    </main>
  );
}
