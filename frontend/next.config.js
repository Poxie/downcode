/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.CDN_HOST]
    }
}

module.exports = nextConfig
