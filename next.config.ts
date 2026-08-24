import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neondatabase/serverless", "@electric-sql/pglite"],
};

export default nextConfig;
