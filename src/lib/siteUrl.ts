/**
 * Канонический origin сайта для sitemap, robots и metadataBase.
 * В проде задайте NEXT_PUBLIC_SITE_URL (например https://www.elevateintern.com).
 * На Vercel без переменной используется VERCEL_URL превью/деплоя.
 */
export function getSiteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`.replace(/\/$/, "");
  }
  return "https://www.elevateintern.com";
}

export function getSiteMetadataBase(): URL {
  return new URL(`${getSiteBaseUrl()}/`);
}
