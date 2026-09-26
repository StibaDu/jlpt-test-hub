# Graph Report - jlpt-n5-simulator  (2026-09-26)

## Corpus Check
- 17 files · ~40,331 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 61 nodes · 63 edges · 5 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c45504c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Launch Checklist — JLPT Test Hub
- JLPT Test Hub
- Monetization setup
- App.tsx
- App

## God Nodes (most connected - your core abstractions)
1. `Launch Checklist — JLPT Test Hub` - 12 edges
2. `JLPT Test Hub` - 10 edges
3. `Monetization setup` - 5 edges
4. `App()` - 4 edges
5. `getConsent()` - 3 edges
6. `CookieBanner()` - 3 edges
7. `Deployment (Cloudflare Pages — free)` - 3 edges
8. `setConsent()` - 2 edges
9. `renderFurigana()` - 2 edges
10. `shuffleArray()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (5 total, 0 thin omitted)

### Community 0 - "Launch Checklist — JLPT Test Hub"
Cohesion: 0.15
Nodes (12): Launch Checklist — JLPT Test Hub, Phase 10: Growth & SEO (Ongoing), Phase 1: Deploy to Cloudflare Pages (Day 1), Phase 2: Custom Domain (Day 1–2), Phase 3: Google Search Console (Day 2), Phase 4: Fill in Placeholders (Day 2–3), Phase 5: Amazon Associates (Week 2 — after ~some traffic), Phase 6: Google AdSense (Month 2 — after ~50 daily visitors) (+4 more)

### Community 1 - "JLPT Test Hub"
Cohesion: 0.17
Nodes (11): Before going live — placeholder checklist, Custom domain, Deployment (Cloudflare Pages — free), Features, JLPT Test Hub, Legal (Japan / EU), License, Project structure (+3 more)

### Community 2 - "Monetization setup"
Cohesion: 0.40
Nodes (5): Amazon Associates, Google AdSense, JapanesePod101 Affiliate, Monetization setup, Premium tier (PayPal)

### Community 3 - "App.tsx"
Cohesion: 0.08
Nodes (5): ADSENSE_CONFIG, SelectedKanji, SvgProps, UiStrings, uiTranslations

### Community 4 - "App"
Cohesion: 0.33
Nodes (6): App(), CookieBanner(), getConsent(), renderFurigana(), setConsent(), shuffleArray()

## Knowledge Gaps
- **29 isolated node(s):** `UiStrings`, `uiTranslations`, `SvgProps`, `ADSENSE_CONFIG`, `SelectedKanji` (+24 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `JLPT Test Hub` connect `JLPT Test Hub` to `Monetization setup`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `Monetization setup` connect `Monetization setup` to `JLPT Test Hub`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `UiStrings`, `uiTranslations`, `SvgProps` to the rest of the system?**
  _29 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._