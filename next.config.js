/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper server configuration for Vercel
  outputFileTracingIncludes: {
    '/api/**/*': ['./src/**/*'],
  },
  // Transpile packages that use ES modules
  transpilePackages: [],
  // Webpack configuration for better module resolution
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

export default nextConfig

