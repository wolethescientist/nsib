import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/flight-track",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://globe.adsbexchange.com https://www.flightradar24.com;",
          },
        ],
      },
      {
        // The inner widget page — must allow VesselFinder's script and resources
        source: "/vessel-widget",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-inline' https://www.vesselfinder.com; frame-src 'self' https://www.vesselfinder.com; connect-src 'self' https://www.vesselfinder.com https://*.vesselfinder.com; img-src 'self' data: blob: https://*.vesselfinder.com https://*.openstreetmap.org https://*.tile.openstreetmap.org;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
