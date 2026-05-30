import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const maxDuration = 60; // segundos para o Python processar o PDF

export async function POST(request: NextRequest) {
  let tmpPath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Apenas arquivos PDF são aceitos" }, { status: 400 });
    }

    // Salva o PDF em arquivo temporário
    const bytes = await file.arrayBuffer();
    tmpPath = join(tmpdir(), `mozin_${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
    await writeFile(tmpPath, Buffer.from(bytes));

    // Caminho do script Python
    const scriptPath = join(process.cwd(), "scripts", "parse_pdf.py");

    // Tenta python, depois py (Windows), depois python3
    let stdout = "";
    let lastError = "";
    for (const cmd of ["python", "py", "python3"]) {
      try {
        const result = await execAsync(`"${cmd}" "${scriptPath}" "${tmpPath}"`, {
          timeout: 55_000,
          maxBuffer: 10 * 1024 * 1024, // 10 MB
        });
        stdout = result.stdout;
        break;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (!stdout) {
      return NextResponse.json(
        { error: `Não foi possível executar Python: ${lastError}` },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(stdout) as { markdown: string; error: string | null };
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 500 });
    }

    return NextResponse.json({ markdown: parsed.markdown });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro inesperado" },
      { status: 500 }
    );
  } finally {
    if (tmpPath) await unlink(tmpPath).catch(() => {});
  }
}
