// build_episode_page.js — generates the episode hub (TOC) page + one full article
// page per fact, from a facts JSON file. Long-form article content lives in its own
// page per fact (better for SEO + ad inventory) — separate from the short card text
// used by build_cards.js, so web depth and card brevity don't fight each other.
// Usage: node build_episode_page.js ep01-facts.json
const fs = require('fs');
const path = require('path');

const dataPath = process.argv[2];
if (!dataPath) { console.error('Usage: node build_episode_page.js <facts.json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const ep = data.episode;

const TAG_LABEL = { verified: '✓ verified', verifying: '◐ verifying', contested: '⚠ contested' };
const outRoot = path.join(__dirname, '..', 'archive', ep.slug);

function pageShell(title, description, canonicalPath, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="https://orpheaarchive.com${canonicalPath}" />
  <link rel="canonical" href="https://orpheaarchive.com${canonicalPath}" />
  <link rel="stylesheet" href="/archive.css" />
</head>
<body>
<div class="wrap">
${bodyHtml}
  <footer class="site-footer">© Orphea Archive. All records are preserved.</footer>
</div>
</body>
</html>
`;
}

// ---------- Episode hub / table of contents ----------
const teasers = data.facts.map(fact => `
  <a class="teaser-row" href="/archive/${ep.slug}/${fact.slug}/">
    <div class="fact-no">${fact.no} <span class="flourish">·</span> ${fact.eyebrow}</div>
    <h3>${fact.title}</h3>
    <p class="hook">${fact.card.hook}</p>
  </a>`).join('\n');

const hubBody = `
  <a class="back-link" href="/archive/">← The Archive</a>

  <div class="eyebrow">${ep.label}</div>
  <h1 class="title">${ep.title}</h1>
  <p class="subtitle">${ep.subtitle}</p>

  <div class="ornament"><span class="flourish">✦</span></div>

  <p class="orphea-intro">“${ep.orphea_intro}”<span class="attr">— Orphea, Archive Administrator</span></p>

  <p style="font-family: var(--serif); font-size: 1.05rem; color: var(--text-dim); text-align: center; margin-bottom: 2.5rem;">
    ${ep.intro}
  </p>
${teasers}

  <div class="ornament"><span class="flourish">✦</span></div>
`;

fs.mkdirSync(outRoot, { recursive: true });
fs.writeFileSync(
  path.join(outRoot, 'index.html'),
  pageShell(
    `${ep.title} — The Records | Orphea Archive`,
    `The true history behind Instance: ${ep.title}. ${data.facts.length} documented facts stranger than the simulation, with sources.`,
    `/archive/${ep.slug}/`,
    hubBody
  ),
  'utf8'
);
console.log('wrote', path.join(outRoot, 'index.html'));

// ---------- One full article page per fact ----------
for (const fact of data.facts) {
  const articleHtml = fact.article.map(p => `    <p>${p}</p>`).join('\n');
  const sourcesHtml = fact.sources.map(s =>
    s.url ? `<a href="${s.url}" target="_blank" rel="noopener nofollow">${s.label}</a>` : s.label
  ).join(' &nbsp;·&nbsp; ');

  const idx = data.facts.indexOf(fact);
  const prev = data.facts[idx - 1];
  const next = data.facts[idx + 1];
  const prevNextNav = `
  <div style="display:flex; justify-content:space-between; margin-top:2.5rem; font-family:var(--mono); font-size:0.7rem; letter-spacing:0.08em; text-transform:uppercase;">
    <span>${prev ? `<a href="/archive/${ep.slug}/${prev.slug}/">← ${prev.no}</a>` : ''}</span>
    <span>${next ? `<a href="/archive/${ep.slug}/${next.slug}/">${next.no} →</a>` : ''}</span>
  </div>`;

  const factBody = `
  <a class="back-link" href="/archive/${ep.slug}/">← ${ep.title}</a>

  <div class="eyebrow">${ep.label}</div>

  <div class="card" id="${fact.slug}" style="margin-top: 1.5rem;">
    <div class="fact-no">${fact.no} <span class="flourish">·</span> ${fact.eyebrow}</div>
    <h2>${fact.title}</h2>
    <p class="hook">${fact.card.hook}</p>
${articleHtml}
    <div class="orphea-note">
      <div class="label">Orphea's Note</div>
      <p>${fact.orphea}</p>
    </div>
    <div class="sources"><span class="tag">${TAG_LABEL[fact.sourceTag] || fact.sourceTag}</span>${sourcesHtml}</div>
    <div class="card-footer">
      <span class="ending-tag">In-game: ${fact.inGame || 'referenced in the simulation'}</span>
      <a class="card-link" href="/archive/${ep.slug}/cards/${fact.slug}.html">View as card →</a>
    </div>
  </div>
${prevNextNav}
`;

  const outDir = path.join(outRoot, fact.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'index.html'),
    pageShell(
      `${fact.title} — ${ep.title} | Orphea Archive`,
      `${fact.card.hook} A documented record from ${ep.title}, with sources.`,
      `/archive/${ep.slug}/${fact.slug}/`,
      factBody
    ),
    'utf8'
  );
  console.log('wrote', path.join(outDir, 'index.html'));
}
