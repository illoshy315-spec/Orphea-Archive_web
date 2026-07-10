---
name: fact-article-writing
description: Write or revise a Salem-witch-trials-style historical fact article for Orphea Archive (ep01-facts.json and future ep0N-facts.json files). Use this whenever drafting a new fact record, expanding an existing one for depth/AdSense-readiness, or auditing existing articles for quality. Covers research methodology, Orphea's voice, structure, and a pre-publish self-review checklist built from real mistakes caught in earlier passes.
---

# Fact Article Writing (Orphea Archive)

Each fact record in `tools/ep0N-facts.json` becomes a standalone page at `/archive/[episode]/[fact-slug]/`. It has to work as three things at once: a piece of real history, a companion page for the game, and evidence for AdSense review that this is a genuine, sourced, non-spammy site. The workflow below exists because every step in it was added after something specific went wrong.

## 1. Research — 3-tier source verification

Don't rely on general knowledge alone for any claim you plan to present as settled fact. Run a WebSearch and rank what comes back:

- **Tier 1 (verified-grade):** government sites (.gov), university law schools/law reviews, primary-source archives (e.g. Famous Trials, university documentary-archive projects), major encyclopedias (Britannica), established news outlets (Smithsonian, History.com).
- **Tier 2 (verifying-grade):** Wikipedia, mainstream journalism, museum/advocacy-org pages (ACLU, Institute for Justice) — fine as supporting sources, but a claim resting *only* on these should be tagged `verifying`, not `verified`.
- **Tier 3 (don't use as a source):** SEO content-mill blogs, law-firm marketing pages, AI-generated wikis (e.g. Grokipedia). If this is the only thing you find, say so honestly rather than citing it.

If you can't find a real source for something at all, don't invent one, and don't quietly downgrade the claim without telling the user — surface it and offer to search further.

## 2. Article structure

```json
"article": [
  "<h2>Section Label</h2>",
  "paragraph text...",
  "paragraph text...",
  "<h2>Case on File — Named Person</h2>",
  "paragraph text..."
]
```

- The fact's `title` renders as the page's `<h1>` — never duplicate an `<h1>` or leave a page with zero `<h1>` elements. (`build_episode_page.js` handles this; if you change the shell template, check this invariant again.)
- Break the body into 3–4 `<h2>` sections. A typical shape: **The Mechanism** (what it is + why it mattered) → **Case on File — [Name]** (one concrete additional example, if real material supports it) → **The Echo** (a modern-day parallel, genuinely sourced — see below).
- Style the `<h2>`s as archive/case-file labels (mono font, gold, small caps with a thin divider), not generic blog subheadings — they should read as a dossier's section tags, in keeping with the site's Gothic Terminal design system, not as SEO-listicle chrome.

## 3. Defining a term: put the "why it matters" in the SAME paragraph as the definition

This was caught twice by the same feedback ("설명이 안 되어있지 않아?") before the pattern was recognized as systemic. Don't write:

> Spectral evidence was sworn testimony that a spirit, not the body, committed the harm. [...two paragraphs later...] This made the evidence unfalsifiable.

A reader hits the unfamiliar term and has to hold an unanswered "wait, why does that matter?" for several sentences. Instead, land the stakes in the same paragraph as the definition:

> The Salem court accepted spectral evidence: sworn testimony that your spirit, apart from your body, had slipped out to torment the witness. That was what made it dangerous — no alibi could reach a spirit acting independently of the body, so the accusation itself became impossible to answer.

Check every unfamiliar term (spectral evidence, familiar, peine forte et dure, quick with child, civil asset forfeiture...) against this before moving on.

## 4. The Echo section (modern comparison)

This is what turns "history recap" into something that justifies the site's own premise — that these traps "survived the century." Requirements:

- Must be a **real, specific** modern parallel, found via WebSearch, not an assertion from memory.
- Prefer parallels with an official/legal anchor (a statute, a Supreme Court ruling, a federal agency report) over vague social-trend comparisons — these read as substantive rather than as filler.
- If the best source you can find for the comparison is weak (e.g. character-witness-letter effectiveness — mostly law-firm blog content, no strong academic backing), don't oversell it. Frame it as a "here's what changed" contrast instead of "studies show," and say so if asked.

## 5. Orphea's voice — where it lives, and where it doesn't

The article body is written in a neutral documentary/historian voice — it's "the record itself." Orphea's personal, cynical reaction lives *only* in the separate one-line `orphea` field (rendered as a distinct "Orphea's Note" callout). This split was a deliberate, earlier decision — don't blend her first-person voice into the article body, and don't drop the `orphea` line when editing an article.

If you rework the body's argument (e.g. add or remove the concept an `orphea` line references, like "unfalsifiable"), check that the `orphea` note still has something in the body to call back to. An edit that quietly orphans the callback term is a coherence bug, not a style nitpick.

## 6. AI-tic checklist — read the whole thing back before calling it done

These are patterns that were specifically flagged as making otherwise-solid prose read as AI-generated. Before finishing a fact, scan for:

- **The "wasn't A, it was B" contrastive construction**, repeated across more than one sentence in the piece ("It wasn't just the safer option. It was, empirically, the only option that worked.") One instance is fine prose; two or three in the same short article is a tic.
- **"It's worth sitting with..." / "It's worth being precise about..."** — reflective meta-commentary that pauses the narration to tell the reader to pause. Cut it; just say the thing.
- **Dictionary-style definitional openers** ("X — sworn testimony that...") as the very first sentence of a section. Lead with the stakes or the "you" address instead, and fold the definition in as a clause.
- **A rhetorical device used twice back-to-back** — e.g. two consecutive paragraphs that both climax with "that's why this was dangerous." Fixing one instance of a problem by relocating it can just move the redundancy rather than remove it — reread the paragraph *before* and *after* any edit, not just the sentence you changed.

## 7. Before publishing: read start to finish, not just the diff

A local edit that looks correct in isolation can still break the paragraph before or after it (redundant climaxes, orphaned callback terms, abrupt transitions where a bridge sentence was deleted). After any edit — even a "small" one — reread the entire article top to bottom, and check it against records that reference the same people or events (e.g. property-motive and peine-forte-et-dure both cover Giles Corey's land transfer; confess-to-survive and peine-forte-et-dure both need to agree that Corey was never convicted). Cross-record contradictions are easy to introduce and easy to miss if you only look at the one record you're editing.

## 8. Push discipline

`Orphea-Archive_web` auto-deploys to the live site on `git push`. Per the standing project rule: commit locally as you go, but do not `git push` new/changed *content* (article text, new pages, copy changes) until the user has actually read it and said go. Bug fixes and structural changes the user explicitly asked for don't need this extra confirmation loop — only newly-authored content does.
