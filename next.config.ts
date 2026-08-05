import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

// Media (dish photos, gallery images, hero slides, service icons, videos)
// is served from the same WordPress origin as the GraphQL endpoint. Deriving
// the allowed remote host from the env var (rather than hardcoding it) means
// dev (localhost) and whatever production host gets configured both work
// without duplicating it here.
function getWordPressRemotePattern(): RemotePattern | null {
  let origin: URL;
  try {
    origin = new URL(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ?? "");
  } catch {
    return null;
  }

  const pattern: RemotePattern = {
    protocol: origin.protocol.replace(":", "") as "http" | "https",
    hostname: origin.hostname,
    pathname: "/**",
  };
  if (origin.port) {
    pattern.port = origin.port;
  }
  return pattern;
}

const wpRemotePattern = getWordPressRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: wpRemotePattern ? [wpRemotePattern] : [],
    // Next.js 16 blocks optimizing images from local/private IPs by default
    // (SSRF hardening). The WordPress dev instance runs on localhost, so
    // this needs to be explicitly allowed — harmless in production, where
    // the configured host will be a real public domain, not a local IP.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
