export default async function sitemap() {
  const base = 'https://example.com'; // replace after deploy
  const routes = ['', '/services', '/areas', '/gallery', '/faq', '/contact'];
  return routes.map((r) => ({
    url: base + r,
    lastModified: new Date().toISOString(),
  }));
}
