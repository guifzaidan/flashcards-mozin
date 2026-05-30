"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteDeck } from "@/actions/deckActions";

interface Props {
  trigger: React.ReactElement;
  deckId: number;
  deckName: string;
}

export function DeleteDeckDialog({ trigger, deckId, deckName }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteDeck(deckId);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir deck?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 font-medium mb-5">
          O deck <span className="font-black text-[#133266]">{deckName}</span> e todos os seus
          flashcards serão excluídos permanentemente.
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
            className="btn-cartoon px-5 py-2.5 rounded-xl font-black text-white text-base disabled:opacity-50"
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
