import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que o bundler compile @libsql/client internamente —
  // o cliente usa private class fields que quebram com bundling.
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
