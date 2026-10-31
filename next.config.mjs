/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so it can deploy to any static host (GitHub Pages / Vercel).
  output: "export",
  images: { unoptimized: true },
  // basePath is set at build time for GitHub Pages project sites; empty locally.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
  transpilePackages: ["three"],
};

export default nextConfig;
