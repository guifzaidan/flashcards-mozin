import { notFound } from "next/navigation";
import Link from "next/link";
import { getDeckById } from "@/lib/queries/decks";
import { PDFImporter } from "@/components/import/PDFImporter";
import { ArrowLeft } from "@/components/icons";

interface Props {
  params: Promise<{ deckId: string }>;
}

export default async function ImportPage({ params }: Props) {
  const { deckId } = await params;
  const id = Number(deckId);
  const deck = await getDeckById(id);
  if (!deck) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href={`/decks/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#133266] transition-colors mb-5"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Voltar ao deck
      </Link>

      <div className="mb-6" style={{ animation: "slide-up 0.35s cubic-bezier(.175,.885,.32,1.275) both" }}>
        <h1
          className="text-2xl font-black text-[#133266] leading-tight"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          Importar PDF
        </h1>
        <p className="text-sm text-gray-400 font-semibold mt-1">
          Deck: <span className="text-[#133266]">{deck.name}</span>
        </p>
      </div>

      <PDFImporter deckId={id} deckName={deck.name} />
    </main>
  );
}
