// build_episode_page.js — generates the full web article page (archive/[slug]/index.html)
// from a facts JSON file. This is the long-form version — separate from the short
// card text used by build_cards.js, so web SEO depth and card brevity don't fight each other.
// Usage: node build_episode_page.js ep01-facts.json
const fs = require('fs');
const path = require('path');

const dataPath = process.argv[2];
if (!dataPath) { console.error('Usage: node build_episode_page.js <facts.json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const ep = data.episode;

const TAG_LABEL = { verified: '✓ verified', verifying: '◐ verifying', contested: '⚠ contested' };

function factCard(fact, index) {
  const articleHtml = fact.article.map(p => `    <p>${p}</p>`).join('\n');
  const sourcesHtml = fact.sources.map(s =>
    s.url ? `<a href="${s.url}" target="_blank" rel="noopener nofollow">${s.label}</a>` : s.label
  ).join(' &nbsp;·&nbsp; ');

  return `
  <div class="card" id="${fact.slug}">
    <div class="fact-no">${fact.no} <span class="flourish">·</span> ${fact.eyebrow}</div>
    <h2>${fact.title}</h2>
    <p class="hook">${fact.card.hook}</p>
${articleHtml}
    <div class="sources"><span class="tag">${TAG_LABEL[fact.sourceTag] || fact.sourceTag}</span>${sourcesHtml}</div>
    <div class="card-footer">
      <span class="ending-tag">In-game: see Instance walkthrough</span>
      <a class="card-link" href="/archive/${ep.slug}/cards/${fact.slug}.html">View as card →</a>
    </div>
  </div>
${index === 3 ? '\n  <div class="ad-slot">Advertisement space — reserved</div>\n' : ''}`;
}

const cardsHtml = data.facts.map(factCard).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${ep.title} — The Records | Orphea Archive</title>
  <meta name="description" content="The true history behind Instance: ${ep.title}. ${data.facts.length} documented facts stranger than the simulation, with sources." />
  <meta property="og:title" content="${ep.title} — The Records" />
  <meta property="og:description" content="${data.facts.length} documented facts behind the ${ep.title} simulation — the traps were real." />
  <meta property="og:url" content="https://orpheaarchive.com/archive/${ep.slug}/" />
  <link rel="canonical" href="https://orpheaarchive.com/archive/${ep.slug}/" />
  <link rel="stylesheet" href="/archive.css" />
</head>
<body>
<div class="wrap">

  <a class="back-link" href="/archive/">← The Archive</a>

  <div class="eyebrow">${ep.label}</div>
  <h1 class="title">${ep.title}</h1>
  <p class="subtitle">${ep.subtitle}</p>

  <div class="ornament"><span class="flourish">✦</span></div>

  <p style="font-family: var(--serif); font-size: 1.05rem; color: var(--text-dim); text-align: center; margin-bottom: 2.5rem;">
    ${ep.intro}
  </p>

  <div class="ad-slot">Advertisement space — reserved</div>
${cardsHtml}

  <div class="ornament"><span class="flourish">✦</span></div>

  <p style="font-family: var(--serif); font-style: italic; color: var(--text-dim); text-align: center; margin-bottom: 2rem;">
    "Records compiled from primary trial documents and peer-reviewed secondary sources.
    Where a claim is contested, it is marked. Orphea does not editorialize. History does that on its own." — Archive note
  </p>

  <div class="ad-slot">Advertisement space — reserved</div>

  <footer class="site-footer">© Orphea Archive. All records are preserved.</footer>
</div>
</body>
</html>
`;

const outDir = path.join(__dirname, '..', 'archive', ep.slug);
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'index.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('wrote', outPath);
