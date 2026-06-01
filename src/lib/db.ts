import { createClient, type Client } from "@libsql/client";

let _db: Client | null = null;

export function getDb(): Client {
  if (_db) return _db;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      "TURSO_DATABASE_URL e TURSO_AUTH_TOKEN não configurados. " +
        "Adicione-os em Settings → Environment Variables na Vercel."
    );
  }

  _db = createClient({ url, authToken });
  return _db;
}

// Atalho para compatibilidade com o código existente
export const db = new Proxy({} as Client, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string, unknown>)[prop as string];
  },
});
