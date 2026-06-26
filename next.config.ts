import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  devIndicators: false,
  serverExternalPackages: ["pg", "pg-native"],
};

export default nextConfig;
