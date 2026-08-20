import type { NextConfig } from 'next';
import path from 'path';
const nextConfig: NextConfig = { images: { unoptimized: true }, outputFileTracingRoot: path.join(process.cwd()) };
export default nextConfig;
