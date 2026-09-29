# Graph Report - jlpt-n5-simulator  (2026-09-29)

## Corpus Check
- 45 files · ~81,024 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 267 nodes · 368 edges · 13 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1126b318`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Launch Checklist — JLPT Test Hub
- JLPT Test Hub
- useAuth
- App.tsx
- devDependencies
- flashcards.ts
- worker/index.ts
- types.ts
- Icons.tsx
- 0001_initial_schema.sql
- dependencies
- useAuth.ts

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 18 edges
2. `App()` - 13 edges
3. `Launch Checklist — JLPT Test Hub` - 12 edges
4. `JLPT Test Hub` - 10 edges
5. `buildGrammarCards()` - 7 edges
6. `buildDeck()` - 6 edges
7. `speak()` - 6 edges
8. `users` - 6 edges
9. `JLPTLevel` - 5 edges
10. `stripFurigana()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `DeckInfo` --references--> `JLPTLevel`  [EXTRACTED]
  src/flashcards.ts → src/data/types.ts
- `Dashboard()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/Dashboard.tsx → src/context/AuthContext.tsx
- `ForgotPassword()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/ForgotPassword.tsx → src/context/AuthContext.tsx
- `Login()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/Login.tsx → src/context/AuthContext.tsx
- `ResetPassword()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/ResetPassword.tsx → src/context/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (13 total, 0 thin omitted)

### Community 0 - "Launch Checklist — JLPT Test Hub"
Cohesion: 0.15
Nodes (12): Launch Checklist — JLPT Test Hub, Phase 10: Growth & SEO (Ongoing), Phase 1: Deploy to Cloudflare Pages (Day 1), Phase 2: Custom Domain (Day 1–2), Phase 3: Google Search Console (Day 2), Phase 4: Fill in Placeholders (Day 2–3), Phase 5: Amazon Associates (Week 2 — after ~some traffic), Phase 6: Google AdSense (Month 2 — after ~50 daily visitors) (+4 more)

### Community 1 - "JLPT Test Hub"
Cohesion: 0.12
Nodes (16): Amazon Associates, Before going live — placeholder checklist, Custom domain, Deployment (Cloudflare Pages — free), Features, Google AdSense, JapanesePod101 Affiliate, JLPT Test Hub (+8 more)

### Community 2 - "useAuth"
Cohesion: 0.07
Nodes (27): ProtectedRoute(), ProtectedRouteProps, PublicRoute(), AuthContext, AuthContextType, AuthProvider(), fetchWithAuth(), refreshAccessToken() (+19 more)

### Community 3 - "App.tsx"
Cohesion: 0.06
Nodes (22): ADSENSE_CONFIG, CookieBanner(), getConsent(), SelectedKanji, setConsent(), SvgProps, UiStrings, uiTranslations (+14 more)

### Community 4 - "devDependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @types/node (+15 more)

### Community 5 - "flashcards.ts"
Cohesion: 0.18
Nodes (20): App(), renderFurigana(), shuffleArray(), JLPTLevel, allDecks(), buildDeck(), buildGrammarCards(), buildKanjiCards() (+12 more)

### Community 6 - "worker/index.ts"
Cohesion: 0.10
Nodes (15): adminRoutes, authRoutes, TODO: Send reset email, progressRoutes, answerToQuality(), qualityToSM2(), sm2(), SM2State (+7 more)

### Community 7 - "types.ts"
Cohesion: 0.16
Nodes (11): n3Data, n4Data, n5Data, DeviceMode, GameState, KanjiEntry, Lang, LevelData (+3 more)

### Community 8 - "Icons.tsx"
Cohesion: 0.24
Nodes (4): IconCheck(), IconClock(), IconX(), SvgProps

### Community 9 - "0001_initial_schema.sql"
Cohesion: 0.36
Nodes (8): refresh_tokens, subscriptions, test_attempts, user_progress, users, weak_questions, webhook_events, question

### Community 10 - "dependencies"
Cohesion: 0.07
Nodes (26): argon2, hono, @hono/zod-validator, dependencies, argon2, hono, @hono/zod-validator, react (+18 more)

### Community 12 - "useAuth.ts"
Cohesion: 0.35
Nodes (9): enqueueResult(), flushQueue(), newClientTestId(), QueuedTestResult, queueSize(), read(), write(), Subscription (+1 more)

## Knowledge Gaps
- **96 isolated node(s):** `UiStrings`, `uiTranslations`, `SvgProps`, `ADSENSE_CONFIG`, `SelectedKanji` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `dependencies`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `Icons.tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `UiStrings`, `uiTranslations`, `SvgProps` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JLPT Test Hub` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.07439024390243902 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06262626262626263 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._