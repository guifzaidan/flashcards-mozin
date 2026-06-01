import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const maxDuration = 60;

/** Tenta extrair questões estruturadas do texto do PDF. */
function parseQuestions(text: string): { front: string; back: string }[] | null {
  // Padrão 1: marcadores [Q1]...[Q100] gerados pelo script Python
  const qPattern = /\[Q(\d+)\]([\s\S]+?)(?=\[Q\d+\]|$)/g;
  const qMatches = [...text.matchAll(qPattern)];
  if (qMatches.length > 1) {
    return qMatches.map(m => ({ front: m[2].trim(), back: "" }));
  }

  // Padrão 2: QUESTÃO N / Questão N
  const questaoPattern = /(?:^|\n)(Quest[aã]o\s+\d+[\s\S]+?)(?=\nQuest[aã]o\s+\d+|\n*$)/gi;
  const questaoMatches = [...text.matchAll(questaoPattern)];
  if (questaoMatches.length > 1) {
    return questaoMatches.map(m => ({ front: m[1].trim(), back: "" }));
  }

  // Padrão 3: "1." ou "1)" no início de linha
  const numberedPattern = /(?:^|\n)(\d{1,3}[.)]\s+[\s\S]+?)(?=\n\d{1,3}[.)]\s|\n*$)/g;
  const numberedMatches = [...text.matchAll(numberedPattern)];
  if (numberedMatches.length > 1) {
    return numberedMatches.map(m => ({ front: m[1].trim(), back: "" }));
  }

  return null; // deixa o cliente fazer o parse
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Apenas arquivos PDF são aceitos" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const { text } = await extractText(buffer, { mergePages: true });

    const questions = parseQuestions(text);

    return NextResponse.json({
      markdown: text,
      ...(questions && questions.length > 1 ? { questions } : {}),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro inesperado ao processar PDF" },
      { status: 500 }
    );
  }
}
