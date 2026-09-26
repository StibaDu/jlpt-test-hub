# Graph Report - jlpt-n5-simulator  (2026-09-26)

## Corpus Check
- 17 files · ~40,725 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 30 nodes · 28 edges · 4 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a0f80d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Launch Checklist — JLPT Test Hub
- JLPT Test Hub
- Monetization setup
- Deployment (Cloudflare Pages — free)

## God Nodes (most connected - your core abstractions)
1. `Launch Checklist — JLPT Test Hub` - 12 edges
2. `JLPT Test Hub` - 10 edges
3. `Monetization setup` - 5 edges
4. `Deployment (Cloudflare Pages — free)` - 3 edges
5. `Phase 1: Deploy to Cloudflare Pages (Day 1)` - 1 edges
6. `Phase 2: Custom Domain (Day 1–2)` - 1 edges
7. `Phase 3: Google Search Console (Day 2)` - 1 edges
8. `Phase 4: Fill in Placeholders (Day 2–3)` - 1 edges
9. `Phase 5: Amazon Associates (Week 2 — after ~some traffic)` - 1 edges
10. `Phase 6: Google AdSense (Month 2 — after ~50 daily visitors)` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (4 total, 0 thin omitted)

### Community 0 - "Launch Checklist — JLPT Test Hub"
Cohesion: 0.15
Nodes (12): Launch Checklist — JLPT Test Hub, Phase 10: Growth & SEO (Ongoing), Phase 1: Deploy to Cloudflare Pages (Day 1), Phase 2: Custom Domain (Day 1–2), Phase 3: Google Search Console (Day 2), Phase 4: Fill in Placeholders (Day 2–3), Phase 5: Amazon Associates (Week 2 — after ~some traffic), Phase 6: Google AdSense (Month 2 — after ~50 daily visitors) (+4 more)

### Community 1 - "JLPT Test Hub"
Cohesion: 0.22
Nodes (8): Before going live — placeholder checklist, Features, JLPT Test Hub, Legal (Japan / EU), License, Project structure, Quick Start, Tech Stack

### Community 2 - "Monetization setup"
Cohesion: 0.40
Nodes (5): Amazon Associates, Google AdSense, JapanesePod101 Affiliate, Monetization setup, Premium tier (PayPal)

### Community 3 - "Deployment (Cloudflare Pages — free)"
Cohesion: 0.67
Nodes (3): Custom domain, Deployment (Cloudflare Pages — free), Update canonical URL

## Knowledge Gaps
- **24 isolated node(s):** `Phase 1: Deploy to Cloudflare Pages (Day 1)`, `Phase 2: Custom Domain (Day 1–2)`, `Phase 3: Google Search Console (Day 2)`, `Phase 4: Fill in Placeholders (Day 2–3)`, `Phase 5: Amazon Associates (Week 2 — after ~some traffic)` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `JLPT Test Hub` connect `JLPT Test Hub` to `Monetization setup`, `Deployment (Cloudflare Pages — free)`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Why does `Monetization setup` connect `Monetization setup` to `JLPT Test Hub`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **What connects `Phase 1: Deploy to Cloudflare Pages (Day 1)`, `Phase 2: Custom Domain (Day 1–2)`, `Phase 3: Google Search Console (Day 2)` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._