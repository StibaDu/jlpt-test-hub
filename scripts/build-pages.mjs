// Static content pages: /n5/, /n4/, /n3/ — real question banks + kanji lists as crawlable HTML.
// The SPA renders everything client-side; AdSense's crawler sees nothing. These pages expose
// the actual unique value (155 questions, explanations, kanji dictionary) in plain HTML.
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');
const TMP = '/var/folders/7v/hhmd9cmn0c9d6fcn0dd13fth0000gn/T/opencode/jlpt-qa';

for (const level of ['n5', 'n4', 'n3']) {
  execSync(`node_modules/.bin/esbuild src/data/${level}.ts --bundle --format=esm --outfile=${TMP}/${level}-prerender.mjs --log-level=error`, { cwd: ROOT });
}

const canonical = 'https://www.jlpttesthub.com';

const META = {
  N5: { title: 'JLPT N5 Practice Questions & Kanji List (All 50 Questions with Answers)', desc: 'All 50 JLPT N5 practice questions with multiple-choice options, correct answers and explanations — plus the complete N5 kanji list. Free, with furigana.' },
  N4: { title: 'JLPT N4 Practice Questions & Kanji List (All 50 Questions with Answers)', desc: 'All 50 JLPT N4 practice questions with options, correct answers and detailed explanations — plus the N4 kanji list with on- and kun-readings.' },
  N3: { title: 'JLPT N3 Practice Questions & Kanji List (All 55 Questions with Answers)', desc: 'All 55 JLPT N3 practice questions with options, correct answers and explanations — plus the N3 kanji list with on- and kun-readings.' },
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// furigana-tagged string -> HTML with <ruby>; "\n" -> paragraph break
function renderRuby(s) {
  const parts = s.replace(/\\n/g, '\n').split(/\[([^\]]+)\]\(([^)]+)\)/g);
  let out = '';
  for (let i = 0; i < parts.length; i += 3) {
    out += esc(parts[i]);
    if (parts[i + 1] !== undefined) {
      out += `<ruby>${esc(parts[i + 1])}<rt>${esc(parts[i + 2])}</rt></ruby>`;
    }
  }
  return out.replace(/\n/g, '<br/>');
}
// plain text without tags
const plain = s => s.replace(/\\n/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

const catName = { 'Verb & Konjugation': 'Verb conjugation', 'Satzbau & Struktur': 'Sentence structure', 'Kanji & Lesung': 'Kanji & readings', 'Höflichkeit & Ausdruck': 'Politeness & expressions' };

const CSS = `
:root{--emerald:#059669;--emerald-light:#ecfdf5;--border:#e5e7eb;--gray:#6b7280}
body{font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1f2937;margin:0;line-height:1.65}
main{max-width:880px;margin:0 auto;padding:2rem 1.25rem 4rem}
h1{font-size:1.6rem;margin:0 0 .5rem}
h2{font-size:1.25rem;margin:2.5rem 0 1rem;border-bottom:2px solid var(--emerald);padding-bottom:.35rem}
h3{font-size:1.05rem;margin:1.75rem 0 .5rem}
.lead{color:var(--gray);margin-bottom:1.5rem}
.back{display:inline-block;margin-bottom:1.25rem;color:var(--emerald);text-decoration:none;font-weight:600}
header.site{background:#111827;color:#fff;padding:.75rem 1.25rem}
header.site a{color:#fff;text-decoration:none;font-weight:700}
.q{border:1px solid var(--border);border-left:4px solid var(--emerald);border-radius:.75rem;padding:1rem 1.25rem;margin:1.25rem 0}
.q .meta{font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:var(--gray);margin-bottom:.4rem}
.q .stem{font-size:1.02rem;margin-bottom:.75rem}
.opts{list-style:none;margin:0 0 .75rem;padding:0}
.opts li{padding:.3rem 0 .3rem 1.75rem;position:relative;font-size:.95rem}
.opts li::before{content:attr(data-i) ".";position:absolute;left:.2rem;color:var(--gray)}
.opts li.ok{font-weight:700;color:var(--emerald)}
.opts li.ok::before{content:"✓";color:var(--emerald)}
.expl{background:var(--emerald-light);border-radius:.5rem;padding:.75rem 1rem;font-size:.9rem}
.expl b{color:var(--emerald)}
table{border-collapse:collapse;width:100%;font-size:.9rem;margin:1rem 0}
th,td{border:1px solid var(--border);padding:.45rem .6rem;text-align:left;vertical-align:top}
th{background:var(--emerald-light);font-weight:700}
.kanji-cell{font-size:1.5rem;font-family:'Hiragino Mincho ProN','Noto Serif JP',serif}
footer{border-top:1px solid var(--border);margin-top:3rem;padding:1.5rem;text-align:center;font-size:.85rem;color:var(--gray)}
footer a{color:var(--emerald);text-decoration:none}
@media print{.q{page-break-inside:avoid}}
`;

function shell({ lang, title, desc, path, body }) {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)} | JLPT Test Hub</title>
<meta name="description" content="${esc(desc)}"/>
<link rel="canonical" href="${canonical}${path}"/>
<link rel="alternate" hreflang="en" href="${canonical}${path}"/>
<link rel="alternate" hreflang="de" href="${canonical}/de${path}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="${canonical}${path}"/>
<style>${CSS}</style>
</head>
<body>
<header class="site"><a href="/#/">JLPT Test Hub</a></header>
<main>
<a class="back" href="/#/">← Back to the practice app</a>
${body}
</main>
<footer>JLPT Test Hub · <a href="/#/">Practice tests</a> · <a href="/blog/">Blog</a> · Questions based on the official JLPT Practice Workbook (2018) of the Japan Foundation / JEES. Not affiliated with the Japan Foundation or JEES.</footer>
</body>
</html>`;
}

function questionBlock(q, lang) {
  const opts = q.options.map((o, i) => {
    const ok = i === q.correctIndex;
    return `<li class="${ok ? 'ok' : ''}" data-i="${i + 1}">${renderRuby(o)}</li>`;
  }).join('\n');
  const cat = catName[q.category] || q.category;
  const ex = q.explanation[lang] || q.explanation.en;
  return `<article class="q" id="q${q.id}">
  <p class="meta">${cat} · Question ${q.id}</p>
  <p class="stem">${renderRuby(q.text)}</p>
  <ol class="opts">${opts}</ol>
  <div class="expl"><b>${okLabel(lang)}:</b> ${esc(ex)}</div>
</article>`;
}
const okLabel = lang => (lang === 'de' ? 'Richtige Antwort + Erklärung' : 'Correct answer + explanation');

function kanjiTable(dict, lang) {
  const rows = Object.entries(dict).map(([k, v]) => {
    const read = [v.onyomi, v.kunyomi].filter(Boolean).map(r => esc(r)).join(' · ') || '—';
    return `<tr><td class="kanji-cell">${esc(k)}</td><td>${esc(v.meaning?.[lang] || '')}</td><td>${read}</td><td>${esc(v.desc?.[lang] || v.desc?.en || '')}</td><td>${v.jlpt || ''}</td></tr>`;
  }).join('\n');
  const heads = lang === 'de' ? ['Kanji', 'Bedeutung', 'Lesungen (On/Kun)', 'Beschreibung', 'Stufe'] : ['Kanji', 'Meaning', 'Readings (on/kun)', 'Description', 'Level'];
  return `<table><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>\n${rows}\n</tbody></table>`;
}

function introCopy(level, n, lang) {
  const L = { N5: 'N5', N4: 'N4', N3: 'N3' }[level];
  if (lang === 'de') {
    return `Hier findest du alle ${n} Übungsfragen für JLPT ${L} aus dem offiziellen Practice Workbook (2018) — mit allen Optionen, der richtigen Antwort und einer vollständigen Erklärung pro Frage. Darunter die komplette ${L}-Kanji-Liste mit On- und Kun-Lesungen und Bedeutung. Ideal zum Lernen am Desktop oder für die Druckvorschau (Strg/Cmd+P).`;
  }
  return `Every practice question for JLPT ${L} from the official Practice Workbook (2018) — each with all four options, the correct answer, and a full explanation. Below that, the complete ${L} kanji list with on- and kun-readings and meanings. Study on desktop or print it out (Ctrl/Cmd+P). For the timed simulator with instant feedback, open the ${`<a href="/#/">practice app</a>`}.`;
}

for (const level of ['N5', 'N4', 'N3']) {
  const mod = await import(`${TMP}/${level.toLowerCase()}-prerender.mjs`);
  const data = mod[`${level.toLowerCase()}Data`];
  const n = data.questionBank.length;
  for (const lang of ['en', 'de']) {
    const path = lang === 'en' ? `/${level.toLowerCase()}/` : `/de/${level.toLowerCase()}/`;
    const dir = join(OUT, lang === 'en' ? '' : 'de', level.toLowerCase());
    mkdirSync(dir, { recursive: true });
    const body = `
<h1>${esc(lang === 'en' ? `JLPT ${level} Practice Questions & Kanji List` : `JLPT ${level} Übungsfragen & Kanji-Liste`)}</h1>
<p class="lead">${introCopy(level, n, lang)}</p>
<h2>${lang === 'en' ? `All ${n} questions (with answers & explanations)` : `Alle ${n} Fragen (mit Antworten & Erklärungen)`}</h2>
${data.questionBank.map(q => questionBlock(q, lang)).join('\n')}
<h2>${lang === 'en' ? `Complete ${level} kanji list` : `Komplette ${level}-Kanji-Liste`}</h2>
<p class="lead">${Object.keys(data.kanjiDictionary).length} ${lang === 'de' ? 'Einträge' : 'entries'}</p>
${kanjiTable(data.kanjiDictionary, lang)}
`;
    const html = shell({ lang, title: META[level].title, desc: META[level].desc, path, body });
    writeFileSync(join(dir, 'index.html'), html);
  }
}

// add entries to sitemap.xml
const smPath = join(OUT, 'sitemap.xml');
let sm = readFileSync(smPath, 'utf8');
const today = new Date().toISOString().slice(0, 10);
let added = false;
for (const lvl of ['n5', 'n4', 'n3']) {
  for (const pre of ['', '/de']) {
    const loc = `${canonical}${pre}/${lvl}/`;
    if (!sm.includes(loc)) {
      sm = sm.replace('</urlset>', `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>\n</urlset>`);
      added = true;
    }
  }
}
if (added) writeFileSync(smPath, sm);
console.log('prerender pages written:', added ? '+6 URLs in sitemap' : 'sitemap already current');