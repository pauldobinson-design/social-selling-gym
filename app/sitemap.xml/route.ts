// app/sitemap.xml/route.ts
const routes = ["", "dashboard", "challenges", "account", "postcraft", "pitch-perfect", "privacy", "terms"];

export function GET() {
  const urls = routes
    .map((r) => `<url><loc>https://socialselling.store/${r}</loc></url>`)
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
