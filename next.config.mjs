/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                pathname: '**',
                hostname: 'cdn.dexscreener.com'
            },
            {
                pathname: '**',
                hostname: 'dd.dexscreener.com'
            }
        ]
    }
};

export default nextConfig;
