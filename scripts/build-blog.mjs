// Blog generator: content/blog/*.md → dist/blog/*.html (static, SEO-complete)
// Run manually: node scripts/build-blog.mjs  (also wired into npm run build)
import { marked } from 'marked';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'content', 'blog');
const OUT = join(ROOT, 'public', 'blog');
mkdirSync(OUT, { recursive: true });

const canonical = 'https://www.jlpttesthub.com';

// Legal sections extracted from the main page's server-rendered HTML (single source of truth)
function extractLegalSections() {
  const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const ids = ['datenschutz', 'impressum', 'agb', 'anbieterkennzeichnung', 'barrierefreiheit'];
  const sections = {};
  for (const id of ids) {
    const m = new RegExp(`<section id="${id}"[^>]*>([\\s\\S]*?)</section>`).exec(indexHtml);
    if (m) sections[id] = m[1].trim();
  }
  return sections;
}

// ---- Frontmatter parser (key: value lines between --- ---) ----
function parseFrontmatter(md) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(md);
  if (!m) return { meta: {}, body: md };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const km = /^(\w+):\s*(.+)$/.exec(line);
    if (km) meta[km[1]] = km[2].trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: m[2] };
}

// ---- Shared shell ----
function page({ lang, title, description, tags = [], date, body, isIndex = false, jsonLdType = 'BlogPosting', slug = '', legalSections = {} }) {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': jsonLdType,
    headline: title,
    description,
    inLanguage: lang,
    datePublished: date,
    dateModified: date,
    publisher: { '@type': 'Organization', name: 'JLPT Test Hub', url: canonical },
    author: { '@type': 'Person', name: 'Sebastian Thomas' },
    mainEntityOfPage: canonical + '/blog/',
  }).replace(/</g, '\\u003c');

  const appPath = (lang === 'de' ? '/blog/de/' : '/blog/') + (slug ? slug + '/' : '');
  const langToggleHref = lang === 'en' ? '/' : '/en/';

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} | JLPT Test Hub Blog</title>
<meta name="description" content="${description}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${canonical}${appPath}" />
<meta name="twitter:card" content="summary" />
<link rel="canonical" href="${canonical}${appPath}" />
<link rel="alternate" hreflang="${lang}" href="${canonical}${appPath}" />
<link rel="alternate" hreflang="${lang === 'en' ? 'de' : 'en'}" href="${canonical}${lang === 'en' ? '/blog/de/' : '/blog/'}" />
<link rel="stylesheet" href="/blog/blog.css" />
<script type="application/ld+json">${jsonLd}</script>
</head>
<body>
<header class="blog-header">
<h1>JLPT Test Hub</h1>
<div class="subtitle">${lang === 'de' ? 'Kostenlose JLPT-Übungstests · N5 · N4 · N3' : 'Free JLPT practice tests · N5 · N4 · N3'}</div>
<a class="blog-back" href="/#/${lang === 'de' ? 'de' : 'n5'}">← ${lang === 'de' ? 'Zurück zur App' : 'Back to the app'}</a>
</header>
<main class="blog-content">
${body}
</main>
<details class="legal-accordion">
<summary>${lang === 'de' ? 'Rechtliches (Impressum · Datenschutz · AGB · Barrierefreiheit)' : 'Legal (Impressum · Privacy · Terms · Accessibility)'}</summary>
<div class="legal-content">
${legalSections.impressum ? `<section>${legalSections.impressum}</section>` : ''}
${legalSections.datenschutz ? `<section>${legalSections.datenschutz}</section>` : ''}
${legalSections.agb ? `<section>${legalSections.agb}</section>` : ''}
${legalSections.anbieterkennzeichnung ? `<section>${legalSections.anbieterkennzeichnung}</section>` : ''}
${legalSections.barrierefreiheit ? `<section>${legalSections.barrierefreiheit}</section>` : ''}
</div>
</details>
<footer class="blog-footer">
© 2026 JLPT Test Hub · <a href="/#/">${lang === 'de' ? 'Übungstests' : 'Practice tests'}</a> ·
<a href="/blog/">${lang === 'de' ? 'Blog' : 'Blog'}</a>
</footer>
${isIndex ? '' : ''}
</body>
</html>`;
}

// ---- Legal + post pages ----
const legalSections = extractLegalSections();
const files = readdirSync(SRC).filter(f => f.endsWith('.md') && !f.startsWith('_'));
const posts = [];
for (const file of files) {
  const raw = readFileSync(join(SRC, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  let html = await marked.parse(body);

  // Language toggle block at the top of each post
  const toggle = `<div class="lang-toggle"><a href="${canonical}/blog/${meta.slug}/" style="${meta.lang === 'en' ? 'font-weight:700' : ''}">EN</a> | <a href="${canonical}/blog/de/${meta.slug}/" style="${meta.lang === 'de' ? 'font-weight:700' : ''}">DE</a></div>`;
  html = toggle + html;

  // Language class wrappers: if content contains de-only paragraphs we mark with ::: de — skip; both langs are in separate files
  const out = page({
    lang: meta.lang || 'en',
    title: meta.title,
    description: meta.description,
    tags: (meta.tags || '').split(/,\s*/).filter(Boolean),
    date: meta.date,
    body: html,
    slug: meta.slug,
    legalSections,
  });
  const outDir = meta.lang === 'de' ? join(OUT, 'de') : OUT;
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  // URL pattern: /blog/slug/index.html and /blog/de/slug/index.html
  const slugDir = join(outDir, meta.slug);
  mkdirSync(slugDir, { recursive: true });
  writeFileSync(join(slugDir, 'index.html'), out);
  posts.push({
    slug: meta.slug, lang: meta.lang || 'en', title: meta.title,
    description: meta.description, date: meta.date,
    tags: (meta.tags || '').split(/,\s*/).filter(Boolean),
    url: (meta.lang === 'de' ? '/blog/de/' : '/blog/') + meta.slug + '/',
  });
}

// ---- Copy static assets ----
copyFileSync(join(SRC, '_source_restaurants.csv'), join(OUT, 'restaurants-tokyo-under1000.csv'));
if (existsSync(join(SRC, '_source_metro_pass.pdf'))) copyFileSync(join(SRC, '_source_metro_pass.pdf'), join(OUT, 'metro-pass-leaflet-2024.pdf'));

// ---- Blog index (both languages) ----
for (const lang of ['en', 'de']) {
  const langPosts = posts.filter(p => p.lang === lang).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const list = langPosts.map(p => `<article class="post-card">
<h2><a href="${p.url}">${p.title}</a></h2>
<div class="blog-meta">${p.date} ${p.tags.map(t => `<span class="blog-tag">${t}</span>`).join('')}</div>
<p class="excerpt">${p.description}</p>
<p><a href="${p.url}">${lang === 'de' ? 'Weiterlesen →' : 'Read more →'}</a></p>
</article>`).join('\n');

  const title = lang === 'de' ? 'JLPT Test Hub Blog — Japan-Tipps & JLPT-Lernmaterial' : 'JLPT Test Hub Blog — Japan Guides & JLPT Study Tips';
  const desc = lang === 'de' ? 'Lebe günstig in Japan und besteh den JLPT: Essen, Wohnen, Transport, Jobs, Versicherung und Lernpläne — verfasst von jemandem, der dort lebt.' : 'Live cheap in Japan and pass the JLPT: food, housing, transport, jobs, insurance and study plans — written by someone who lives there.';
  const out = page({ lang, title, description: desc, tags: [], date: '2026-10-02', body: list, isIndex: true, jsonLdType: 'Blog', legalSections });
  const dir = lang === 'de' ? join(OUT, 'de') : OUT;
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), out);
}

// ---- Sitemap entries ----
const sitemapEntries = posts.map(p => `\n  <url><loc>${canonical}${p.url}</loc><lastmod>${p.date}</lastmod></url>`);
sitemapEntries.push(`\n  <url><loc>${canonical}/blog/</loc><lastmod>2026-10-02</lastmod></url>`);
sitemapEntries.push(`\n  <url><loc>${canonical}/de/blog/</loc><lastmod>2026-10-02</lastmod></url>`);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries.join('')}\n</urlset>\n`;
writeFileSync(join(ROOT, 'public', 'sitemap-blog.xml'), sitemap);

console.log(`✓ Blog built: ${posts.length} posts → ${OUT}`);
for (const p of posts.sort((a, b) => a.slug.localeCompare(b.slug))) console.log(`   ${p.lang === 'de' ? 'DE' : 'EN'} ${p.url}`);