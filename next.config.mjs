/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    TEMPLATE: process.env.TEMPLATE,
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `/api/:path*`,
      },
      {
        source: '/:path*',
        destination: `/${process.env.TEMPLATE}/:path*`,
      },
    ]
  },
  // Only use standalone output for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  outputFileTracingRoot: process.cwd(),
  ...(process.env.SEPARATE_BUILD === 'true' && process.env.TEMPLATE !== ''
    ? { distDir: `.next-${process.env.TEMPLATE}` }
    : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aurawell-files.s3.us-east-2.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cannbe-files-v1.s3.us-east-1.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cannbe-files-v1.s3.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
      },
    ],
  },
}

export default nextConfig
