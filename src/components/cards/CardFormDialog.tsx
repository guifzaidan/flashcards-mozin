"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCard, updateCard } from "@/actions/cardActions";
import type { Card } from "@/lib/queries/cards";

interface Props {
  trigger: React.ReactElement;
  deckId: number;
  card?: Card;
}

export function CardFormDialog({ trigger, deckId, card }: Props) {
  const isEdit = !!card;
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState(card?.front ?? "");
  const [back, setBack] = useState(card?.back ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    startTransition(async () => {
      if (isEdit) await updateCard(card.id, deckId, front, back);
      else await createCard(deckId, front, back);
      setOpen(false);
      if (!isEdit) { setFront(""); setBack(""); }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar flashcard" : "Novo flashcard"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Frente */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-black uppercase tracking-wide text-gray-400">
              Frente — questão
            </Label>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "2px solid #133266" }}
            >
              <Textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Escreva a questão ou enunciado..."
                className="min-h-[90px] resize-none border-0 rounded-none font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
            </div>
          </div>

          {/* Verso */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-black uppercase tracking-wide text-gray-400">
              Verso — resposta
            </Label>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "2px solid #EFC1C4", borderLeft: "4px solid #133266" }}
            >
              <Textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Escreva a resposta correta..."
                className="min-h-[90px] resize-none border-0 rounded-none font-medium focus-visible:ring-0 focus-visible:ring-offset-0 bg-pink-50/40"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
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
              type="submit"
              disabled={isPending || !front.trim() || !back.trim()}
              className="btn-cartoon px-5 py-2.5 rounded-xl font-black text-white text-base disabled:opacity-50"
              style={{
                backgroundColor: "#133266",
                border: "2px solid #133266",
                boxShadow: "3px 3px 0 rgba(19,50,102,0.3)",
                fontFamily: "var(--font-caveat)",
              }}
            >
              {isPending ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
