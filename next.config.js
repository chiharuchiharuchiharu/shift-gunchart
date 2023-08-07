/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{
      source: '/api/:path*',
      destination: 'https://linebot-chi.onrender.com/api/:path*',
    }]
  }
}

module.exports = nextConfig
