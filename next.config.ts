import type { NextConfig } from "next";

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((origin) => origin.trim())
  : ["26.85.165.77"];

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins,
};

export default nextConfig;
