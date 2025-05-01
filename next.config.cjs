/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Use SWC instead of Babel for better performance
  experimental: {
    // Prevent issues with ESM/CJS module conflicts
    esmExternals: 'loose',
    // Force Next.js to use SWC for compilation
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig; 