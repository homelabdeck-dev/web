import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/cron/newsletter": ["./src/content/newsletter/**"],
  },
};

export default withNextIntl(nextConfig);
