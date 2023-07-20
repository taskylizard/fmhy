/** @type {import('next').NextConfig} */
import { withPlausibleProxy } from "next-plausible";

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.clerk.dev"],
  },
  async redirects() {
    return [
      {
        source: "/wiki/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/links/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default withPlausibleProxy({
  subdirectory: "analytics",
  scriptName: "script",
  customDomain: "https://a.bignutty.xyz",
})(nextConfig);