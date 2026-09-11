/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't let a stray lint rule break the production deploy.
    ignoreDuringBuilds: true,
  },
  images: {
    // Placeholder photography lives on these hosts until Shijo uploads real
    // product images from the dashboard. Uploaded images are served locally.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "static.prod-images.emergentagent.com" },
      { protocol: "https", hostname: "customer-assets.emergentagent.com" },
    ],
  },
};

export default nextConfig;
