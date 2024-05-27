/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/v0/:path*',
                destination: 'http://107.172.83.222:8080/:path*' // Proxy to Backend
            },
            {
                source: '/buzz/:path*',
                destination: 'https://chainbuzz.xyz/:path*' // Proxy to Backend
            }
        ]
    }
};

export default nextConfig;
