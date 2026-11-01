import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Retired locale: permanent redirects keep old /bg links and Google signals working.
  async redirects() {
    return [
      { source: "/bg", destination: "/en", permanent: true },
      { source: "/bg/:path*", destination: "/en/:path*", permanent: true },
    ];
  },
  outputFileTracingIncludes: {
    "/api/cron/newsletter": ["./src/content/newsletter/**"],
  },
};

export default withNextIntl(nextConfig);
