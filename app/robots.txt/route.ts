// app/robots.txt/route.ts
export function GET() {
  const body = `User-agent: *
Allow: /
Sitemap: https://socialselling.store/sitemap.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
