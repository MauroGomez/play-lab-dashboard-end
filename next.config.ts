import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Excludes src/live-coding from the type check of the build
    tsconfigPath: 'tsconfig.build.json',
  },
};

export default nextConfig;
