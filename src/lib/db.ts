import { createClient } from "@libsql/client";

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error(
    "Variáveis de ambiente TURSO_DATABASE_URL e TURSO_AUTH_TOKEN não configuradas. " +
    "Adicione-as no painel da Vercel em Settings → Environment Variables."
  );
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
