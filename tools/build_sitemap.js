// build_sitemap.js — regenerates sitemap.xml from every *-facts.json in tools/.
// Run this after adding a new episode's facts JSON. Static root URLs are hardcoded below;
// everything under /archive/ is derived from the facts files so it never drifts out of sync.
const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().slice(0, 10);
const toolsDir = __dirname;
const factFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('-facts.json'));

const urls = [
  { loc: 'https://orpheaarchive.com/', priority: '1.0', changefreq: 'monthly' },
  { loc: 'https://orpheaarchive.com/archive/', priority: '0.9', changefreq: 'monthly' },
  { loc: 'https://orpheaarchive.com/about/', priority: '0.5', changefreq: 'yearly' },
];

for (const file of factFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf8'));
  const ep = data.episode;
  urls.push({ loc: `https://orpheaarchive.com/archive/${ep.slug}/`, priority: '0.9', changefreq: 'monthly' });
  for (const fact of data.facts) {
    urls.push({ loc: `https://orpheaarchive.com/archive/${ep.slug}/${fact.slug}/`, priority: '0.7', changefreq: 'yearly' });
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(toolsDir, '..', 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml regenerated — ${urls.length} URLs`);
