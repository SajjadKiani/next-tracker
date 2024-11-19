/** @type {import('next').NextConfig} */
import withPWAInit from 'next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // any other next-pwa options you may have
});

const nextConfig = withPWA({
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
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
});

export default nextConfig;
