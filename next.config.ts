// ─── 野造 · Next.js 配置 ───
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ── Image Optimization ──
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  // ── ISR / Cache Strategy ──
  experimental: {
    // Optimize package imports for tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
      'recharts',
    ],
    // Inline critical CSS
    optimizeCss: true,
  },

  // ── Headers for Performance & Security ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Caching
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // ── Redirects ──
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth/register',
        permanent: true,
      },
      {
        source: '/me/challenge',
        destination: '/me/challenges',
        permanent: true,
      },
    ]
  },

  // ── Compression ──
  compress: true,

  // ── React Strict Mode ──
  reactStrictMode: true,

  // ── Bundle Analysis (only when ANALYZE=true) ──
  // webpack: (config, { isServer }) => {
  //   if (process.env.ANALYZE && !isServer) {
  //     const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  //     config.plugins.push(new BundleAnalyzerPlugin())
  //   }
  //   return config
  // },
}

export default nextConfig
