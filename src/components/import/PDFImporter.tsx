"use client";

import { useState, useRef, useTransition } from "react";
import { createCard } from "@/actions/cardActions";
import { Upload, FileText, CheckSquare, Square, ChevronDown, ChevronUp, AlertCircle, Loader2 } from "lucide-react";

interface Question {
  id: string;
  front: string;       // texto da questão (editável)
  back: string;        // gabarito/resposta (editável)
  selected: boolean;
  expanded: boolean;
}

/** Extrai questões numeradas do markdown. */
function extractQuestions(markdown: string): Question[] {
  // Padrão 1: "1." ou "1)" com quebra de linha antes
  const patterns = [
    /(?:^|\n)(\d{1,3}[.)]\s+[\s\S]+?)(?=\n\d{1,3}[.)]\s|\n*$)/g,
    /(?:^|\n)(Questão\s+\d+[\s\S]+?)(?=\nQuestão\s+\d+|\n*$)/gi,
    /(?:^|\n)(QUESTAO\s+\d+[\s\S]+?)(?=\nQUESTAO\s+\d+|\n*$)/gi,
  ];

  for (const pattern of patterns) {
    const matches = [...markdown.matchAll(pattern)];
    if (matches.length > 1) {
      return matches.map((m, i) => ({
        id: `q${i}`,
        front: m[1].trim(),
        back: "",
        selected: false,
        expanded: false,
      }));
    }
  }

  // Padrão 2: marcadores [Q1], [Q2]... usados no PDF gerado automaticamente
  const qMarkerPattern = /\[Q(\d+)\]\s*([\s\S]+?)(?=\[Q\d+\]|$)/g;
  const qMarkerMatches = [...markdown.matchAll(qMarkerPattern)];
  if (qMarkerMatches.length > 1) {
    return qMarkerMatches.map((m, i) => ({
      id: `q${i}`,
      front: m[2].trim(),
      back: "",
      selected: false,
      expanded: false,
    }));
  }

  // Fallback: divide por parágrafos (linha em branco)
  const paragraphs = markdown
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  return paragraphs.map((p, i) => ({
    id: `q${i}`,
    front: p,
    back: "",
    selected: false,
    expanded: false,
  }));
}

interface Props {
  deckId: number;
  deckName: string;
}

export function PDFImporter({ deckId, deckName }: Props) {
  const [step, setStep] = useState<"upload" | "loading" | "select" | "done">("upload");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = questions.filter((q) => q.selected);

  /* ── Upload & parse ── */
  async function handleFile(file: File) {
    setFileName(file.name);
    setError(null);
    setStep("loading");

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/parse-pdf", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Erro ao processar PDF");

      // Usa questões pré-processadas pelo servidor se disponíveis (mais confiável)
      let qs: Question[];
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 1) {
        qs = (data.questions as { front: string; back: string }[]).map((q, i) => ({
          id: `q${i}`,
          front: q.front,
          back: q.back ?? "",
          selected: false,
          expanded: false,
        }));
      } else {
        qs = extractQuestions(data.markdown as string);
      }

      if (qs.length === 0) throw new Error("Nenhuma questão detectada no PDF. Tente um arquivo diferente.");
      setQuestions(qs);
      setStep("select");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setStep("upload");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") handleFile(file);
  }

  /* ── Edição de questões ── */
  function toggle(id: string) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q)));
  }
  function toggleExpand(id: string) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, expanded: !q.expanded } : q)));
  }
  function updateFront(id: string, val: string) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, front: val } : q)));
  }
  function updateBack(id: string, val: string) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, back: val } : q)));
  }
  function selectAll() {
    setQuestions((qs) => qs.map((q) => ({ ...q, selected: true })));
  }
  function deselectAll() {
    setQuestions((qs) => qs.map((q) => ({ ...q, selected: false })));
  }

  /* ── Criar flashcards ── */
  function handleCreate() {
    startTransition(async () => {
      for (const q of selected) {
        await createCard(deckId, q.front, q.back || "(sem resposta — edite depois)");
      }
      setStep("done");
    });
  }

  /* ──────────────────────────────────────── */
  /* STEP: upload                             */
  if (step === "upload") return (
    <div className="flex flex-col gap-4">
      {error && (
        <div
          className="flex items-start gap-2 p-3 rounded-xl text-sm font-medium text-[#133266]"
          style={{ backgroundColor: "#EFC1C4", border: "2px solid #133266" }}
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div
        className="flex flex-col items-center justify-center gap-4 py-14 rounded-2xl bg-white cursor-pointer transition-colors hover:bg-pink-50/40"
        style={{ border: "3px dashed #133266", boxShadow: "4px 4px 0 #133266" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "#EFC1C4", border: "2.5px solid #133266" }}
        >
          <Upload size={24} color="#133266" strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <p className="font-black text-[#133266] text-lg" style={{ fontFamily: "var(--font-caveat)" }}>
            Arraste o PDF aqui
          </p>
          <p className="text-sm text-gray-400 font-medium mt-0.5">ou clique para selecionar</p>
        </div>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      <p className="text-xs text-center text-gray-400 font-medium">
        O texto do PDF é extraído e processado no servidor — o arquivo não é armazenado.
      </p>
    </div>
  );

  /* STEP: loading */
  if (step === "loading") return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Loader2 size={40} color="#133266" className="animate-spin" />
      <div className="text-center">
        <p className="font-black text-[#133266] text-xl" style={{ fontFamily: "var(--font-caveat)" }}>
          Processando {fileName}...
        </p>
        <p className="text-sm text-gray-400 font-medium mt-1">Convertendo PDF com markitdown</p>
      </div>
    </div>
  );

  /* STEP: done */
  if (step === "done") return (
    <div
      className="flex flex-col items-center gap-4 py-14 rounded-2xl bg-white text-center"
      style={{ border: "3px solid #133266", boxShadow: "5px 5px 0 #133266" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: "#A5DAE3", border: "2.5px solid #133266" }}
      >
        <FileText size={24} color="#133266" strokeWidth={2.5} />
      </div>
      <p className="font-black text-[#133266] text-2xl" style={{ fontFamily: "var(--font-caveat)" }}>
        {selected.length} {selected.length === 1 ? "flashcard criado" : "flashcards criados"}!
      </p>
      <p className="text-sm text-gray-400 font-medium">
        Adicionados ao deck <span className="font-bold text-[#133266]">{deckName}</span>
      </p>
      <button
        onClick={() => { setStep("upload"); setQuestions([]); setError(null); }}
        className="btn-cartoon px-6 py-2.5 rounded-xl font-black text-sm text-[#133266] bg-white mt-2"
        style={{ border: "2px solid #133266", boxShadow: "3px 3px 0 #133266", fontFamily: "var(--font-caveat)" }}
      >
        Importar outro PDF
      </button>
    </div>
  );

  /* STEP: select */
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="font-black text-[#133266] text-lg" style={{ fontFamily: "var(--font-caveat)" }}>
            {questions.length} questões detectadas
          </p>
          <p className="text-xs text-gray-400 font-medium">{fileName}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={selectAll}
            className="text-xs font-bold text-[#133266] underline hover:no-underline">
            Selecionar todas
          </button>
          <span className="text-gray-300">·</span>
          <button onClick={deselectAll}
            className="text-xs font-bold text-gray-400 underline hover:no-underline">
            Limpar
          </button>
          <span className="text-gray-300">·</span>
          <button
            onClick={() => setQuestions(qs => qs.map(q => ({ ...q, expanded: true })))}
            className="text-xs font-bold text-gray-400 underline hover:no-underline">
            Expandir todas
          </button>
          <span className="text-gray-300">·</span>
          <button
            onClick={() => setQuestions(qs => qs.map(q => ({ ...q, expanded: false })))}
            className="text-xs font-bold text-gray-400 underline hover:no-underline">
            Colapsar
          </button>
        </div>
      </div>

      {/* Lista de questões */}
      <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="bg-white rounded-xl overflow-hidden"
            style={{
              border: `2px solid ${q.selected ? "#133266" : "#e5e7eb"}`,
              boxShadow: q.selected ? "3px 3px 0 #133266" : "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
              minHeight: "64px",
            }}
          >
            {/* Linha principal — altura mínima garantida */}
            <div
              className="flex items-center gap-3 px-3 cursor-pointer"
              style={{ minHeight: "64px" }}
              onClick={() => toggle(q.id)}
            >
              {/* Checkbox — área clicável própria */}
              <div
                className="shrink-0"
                onClick={(e) => { e.stopPropagation(); toggle(q.id); }}
              >
                {q.selected
                  ? <CheckSquare size={22} color="#133266" strokeWidth={2.5} />
                  : <Square size={22} color="#d1d5db" strokeWidth={2} />}
              </div>

              {/* Número + texto da questão */}
              <div className="flex-1 min-w-0 py-3">
                <p
                  className={`text-sm font-medium text-[#133266] leading-snug ${q.expanded ? "" : "line-clamp-3"}`}
                  style={{ fontFamily: "var(--font-caveat)", fontSize: "1rem" }}
                >
                  <span className="font-black text-gray-300 mr-1 select-none">{i + 1}.</span>
                  {q.front || <span className="text-gray-300 italic">Questão {i + 1}</span>}
                </p>
              </div>

              {/* Botão expandir */}
              <button
                className="shrink-0 p-1 text-gray-300 hover:text-[#133266] transition-colors"
                onClick={(e) => { e.stopPropagation(); toggleExpand(q.id); }}
                aria-label={q.expanded ? "Colapsar" : "Expandir para editar"}
              >
                {q.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Painel expandido: editar frente + verso */}
            {q.expanded && (
              <div className="px-3 pb-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Frente (questão)</p>
                  <textarea
                    value={q.front}
                    onChange={(e) => updateFront(q.id, e.target.value)}
                    rows={5}
                    className="w-full text-sm font-medium text-[#133266] rounded-xl p-2 resize-y outline-none"
                    style={{ border: "2px solid #133266", fontFamily: "var(--font-caveat)" }}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Verso (resposta) — opcional</p>
                  <textarea
                    value={q.back}
                    onChange={(e) => updateBack(q.id, e.target.value)}
                    placeholder="Deixe em branco para preencher depois..."
                    rows={3}
                    className="w-full text-sm font-medium text-gray-500 rounded-xl p-2 resize-y outline-none"
                    style={{ border: "2px solid #EFC1C4", borderLeft: "4px solid #133266", fontFamily: "var(--font-caveat)" }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer sticky */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t-2 border-dashed border-gray-200 sticky bottom-0 bg-[#F0EEE9] py-3">
        <p className="text-sm font-bold text-gray-400">
          {selected.length} selecionada{selected.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => { setStep("upload"); setQuestions([]); }}
            className="btn-cartoon px-4 py-2 rounded-xl font-black text-sm text-[#133266] bg-white"
            style={{ border: "2px solid #133266", boxShadow: "2px 2px 0 #133266", fontFamily: "var(--font-caveat)" }}
          >
            Voltar
          </button>
          <button
            onClick={handleCreate}
            disabled={selected.length === 0 || isPending}
            className="btn-cartoon px-5 py-2 rounded-xl font-black text-sm text-white disabled:opacity-50"
            style={{
              backgroundColor: "#133266",
              border: "2px solid #133266",
              boxShadow: "3px 3px 0 rgba(19,50,102,0.3)",
              fontFamily: "var(--font-caveat)",
            }}
          >
            {isPending ? "Criando..." : `Criar ${selected.length} flashcard${selected.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
