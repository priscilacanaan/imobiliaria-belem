// Dois modos:
// - normal (npm run dev / build): servidor Next.js.
// - estático (npm run build:githack): gera a pasta out/ com arquivos .html,
//   para servir no raw.githack a partir do repositório no GitHub.
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: isStatic,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  ...(isStatic && { output: "export", basePath }),
};

export default nextConfig;
