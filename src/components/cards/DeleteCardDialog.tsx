"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteCard } from "@/actions/cardActions";

interface Props {
  trigger: React.ReactElement;
  cardId: number;
  deckId: number;
}

export function DeleteCardDialog({ trigger, cardId, deckId }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteCard(cardId, deckId);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir card?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 font-medium mb-5">
          Este flashcard será excluído permanentemente. Esta ação não pode ser desfeita.
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setOpen(false)}
            className="btn-cartoon px-5 py-2.5 rounded-xl font-black text-[#133266] bg-white text-base"
            style={{
              border: "2px solid #133266",
              boxShadow: "3px 3px 0 #133266",
              fontFamily: "var(--font-caveat)",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="btn-cartoon px-5 py-2.5 rounded-xl font-black text-base disabled:opacity-50"
            style={{
              backgroundColor: "#EFC1C4",
              border: "2px solid #133266",
              boxShadow: "3px 3px 0 #133266",
              color: "#133266",
              fontFamily: "var(--font-caveat)",
            }}
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
