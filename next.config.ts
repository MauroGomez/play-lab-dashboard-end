import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: {
    // Bottom-left (the default) overlaps the user box of the sidenav
    position: 'bottom-right',
  },
  typescript: {
    // Excludes src/live-coding from the type check of the build
    tsconfigPath: 'tsconfig.build.json',
  },
};

export default nextConfig;
