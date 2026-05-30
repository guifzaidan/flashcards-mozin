"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDeck, renameDeck } from "@/actions/deckActions";

interface Props {
  trigger: React.ReactElement;
  mode: "create" | "rename";
  deckId?: number;
  currentName?: string;
}

export function DeckFormDialog({ trigger, mode, deckId, currentName }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      if (mode === "create") await createDeck(name);
      else if (deckId) await renameDeck(deckId, name);
      setOpen(false);
      if (mode === "create") setName("");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo deck" : "Renomear deck"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deck-name" className="text-xs font-black uppercase tracking-wide text-gray-400">
              Nome do deck
            </Label>
            <Input
              id="deck-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Anatomia – Cabeça e Pescoço"
              className="h-11 rounded-xl font-medium"
              style={{ border: "2px solid #133266", outline: "none" }}
              autoFocus
            />
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
              disabled={isPending || !name.trim()}
              className="btn-cartoon px-5 py-2.5 rounded-xl font-black text-white text-base disabled:opacity-50"
              style={{
                backgroundColor: "#133266",
                border: "2px solid #133266",
                boxShadow: "3px 3px 0 rgba(19,50,102,0.3)",
                fontFamily: "var(--font-caveat)",
              }}
            >
              {isPending ? "Salvando..." : mode === "create" ? "Criar" : "Salvar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
