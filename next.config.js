/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "5000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "192.168.0.106", port: "5000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "mahaveerpapersbe.vercel.app", pathname: "/uploads/**" },
      { protocol: "http", hostname: "mahaveerpapersbe.vercel.app", pathname: "/**" },
      { protocol: "https", hostname: "mahaveerpapersbe.vercel.app", pathname: "/uploads/**" },
      { protocol: "https", hostname: "mahaveerpapersbe.vercel.app", pathname: "/**" },
      { protocol: "https", hostname: "encrypted-tbn1.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "mahaveerpapers.blr1.digitaloceanspaces.com", pathname: "/**" }
    ]
  }
};

module.exports = nextConfig;
