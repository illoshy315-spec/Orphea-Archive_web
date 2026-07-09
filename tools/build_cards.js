// build_cards.js — generates standalone 1080x1350 Instagram card pages from a facts JSON file.
// Usage: node build_cards.js ep01-facts.json
// Reused across episodes — point it at a new facts JSON to generate that episode's cards.
const fs = require('fs');
const path = require('path');

const dataPath = process.argv[2];
if (!dataPath) { console.error('Usage: node build_cards.js <facts.json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const SOURCE_TAG_SYMBOL = { verified: '✓', verifying: '◐', contested: '⚠' };

const outDir = path.join(__dirname, '..', 'archive', data.episode.slug, 'cards');
fs.mkdirSync(outDir, { recursive: true });

for (const fact of data.facts) {
  const bodyHtml = fact.card.body.map(p => `      <p>${p}</p>`).join('\n');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${fact.title} — Orphea Archive</title>
<meta name="robots" content="noindex" />
<link rel="stylesheet" href="/archive.css" />
<style>
  html, body { width: 1080px; height: 1350px; overflow: hidden; }
</style>
</head>
<body class="ig-page">
  <div class="ig-card">
    <div class="ig-eyebrow">${fact.no} <span class="ep">· ${data.episode.label}</span></div>
    <h1>${fact.title}</h1>
    <div class="ig-hook">${fact.card.hook}</div>
    <div class="ig-body">
${bodyHtml}
    </div>
    <div class="ig-footer">
      <span class="brand">Orphea Archive</span>
      <span>orpheaarchive.com</span>
    </div>
  </div>
</body>
</html>
`;
  const outPath = path.join(outDir, `${fact.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('wrote', outPath);
}
console.log(`\n${data.facts.length} card(s) generated. Screenshot each at exactly 1080x1350 viewport to export for Instagram.`);
