import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/image-forge',
  images: { unoptimized: true },
}

export default nextConfig
