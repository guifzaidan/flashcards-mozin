export async function GET() {
  return Response.json({
    status: "ok",
    turso_url: process.env.TURSO_DATABASE_URL
      ? `${process.env.TURSO_DATABASE_URL.slice(0, 20)}...`
      : "NOT SET",
    turso_token: process.env.TURSO_AUTH_TOKEN ? "SET" : "NOT SET",
    node: process.version,
  });
}
