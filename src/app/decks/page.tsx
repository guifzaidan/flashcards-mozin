import { getDecksWithCardCount } from "@/lib/queries/decks";
import { getAllCards } from "@/lib/queries/cards";
import { DeckSearchFilter } from "@/components/decks/DeckSearchFilter";
import { DeckFormDialog } from "@/components/decks/DeckFormDialog";
import { HeroSection } from "@/components/HeroSection";
import { CardStack } from "@/components/icons";

export default async function DecksPage() {
  const [decks, allCards] = await Promise.all([
    getDecksWithCardCount(),
    getAllCards(),
  ]);
  const cardCount = decks.reduce((sum, d) => sum + (d.card_count ?? 0), 0);

  return (
    <>
      <HeroSection deckCount={decks.length} cardCount={cardCount} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div
          className="mb-6 flex items-center justify-between gap-3"
          style={{ animation: "slide-up 0.4s cubic-bezier(.175,.885,.32,1.275) both" }}
        >
          <div className="flex items-center gap-3">
            <div className="icon-wiggle">
              <CardStack size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2
                className="text-2xl font-black text-[#133266]"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                Meus Decks
              </h2>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                {decks.length} {decks.length === 1 ? "deck" : "decks"} criados
              </p>
            </div>
          </div>

          <DeckFormDialog
            mode="create"
            trigger={
              <button
                className="btn-cartoon flex items-center gap-1.5 font-black text-sm px-4 py-2 rounded-xl bg-transparent text-[#133266] hover:bg-[#133266] hover:text-white transition-colors duration-150"
                style={{
                  border: "2.5px solid #133266",
                  boxShadow: "3px 3px 0 #133266",
                  fontFamily: "var(--font-caveat)",
                } as React.CSSProperties}
              >
                + Novo deck
              </button>
            }
          />
        </div>

        <DeckSearchFilter decks={decks} allCards={allCards} />
      </main>
    </>
  );
}
