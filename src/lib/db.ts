/**
 * Cliente Turso via HTTP API (fetch nativo).
 * Evita problemas com @libsql/client em ambientes serverless (Vercel).
 */

interface TursoResult {
  rows: Record<string, unknown>[];
}

interface ExecuteOptions {
  sql: string;
  args?: (string | number | null)[];
}

async function tursoFetch(
  statements: ExecuteOptions[]
): Promise<TursoResult[]> {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url || !token) {
    throw new Error(
      "TURSO_DATABASE_URL e TURSO_AUTH_TOKEN não configurados."
    );
  }

  // Converte libsql:// → https://
  const httpUrl = url.replace(/^libsql:\/\//, "https://");

  const body = {
    requests: statements.map((s) => ({
      type: "execute",
      stmt: {
        sql: s.sql,
        args: s.args?.map((a) =>
          a === null
            ? { type: "null" }
            : typeof a === "number"
            ? { type: "integer", value: String(a) }
            : { type: "text", value: String(a) }
        ) ?? [],
      },
    })),
  };

  const res = await fetch(`${httpUrl}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso HTTP error ${res.status}: ${text}`);
  }

  const data = await res.json();

  return data.results.map((r: unknown) => {
    const result = r as {
      response: {
        result: {
          cols: { name: string }[];
          rows: { value: unknown }[][];
        };
      };
    };
    const { cols, rows } = result.response.result;
    return {
      rows: rows.map((row) =>
        Object.fromEntries(
          cols.map((col, i) => [col.name, (row[i] as { value: unknown }).value])
        )
      ),
    };
  });
}

/** Interface compatível com o código existente */
export const db = {
  async execute(
    sqlOrOptions: string | ExecuteOptions
  ): Promise<{ rows: Record<string, unknown>[] }> {
    const opts =
      typeof sqlOrOptions === "string"
        ? { sql: sqlOrOptions }
        : sqlOrOptions;
    const [result] = await tursoFetch([opts]);
    return result;
  },
};
