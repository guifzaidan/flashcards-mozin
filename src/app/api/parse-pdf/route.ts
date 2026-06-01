import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const maxDuration = 60;

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

    return NextResponse.json({ markdown: text });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro inesperado ao processar PDF" },
      { status: 500 }
    );
  }
}
