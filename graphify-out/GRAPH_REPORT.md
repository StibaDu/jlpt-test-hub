# Graph Report - jlpt-n5-simulator  (2026-10-02)

## Corpus Check
- 46 files · ~82,927 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 282 nodes · 391 edges · 15 communities (14 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4a62df3a`
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
- data/index.ts
- Icons.tsx
- 0001_initial_schema.sql
- dependencies
- useAuth.ts
- romaji.ts
- vite.config.ts

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 18 edges
2. `Launch Checklist — JLPT Test Hub` - 12 edges
3. `JLPT Test Hub` - 10 edges
4. `buildGrammarCards()` - 6 edges
5. `speak()` - 6 edges
6. `users` - 6 edges
7. `stripFurigana()` - 5 edges
8. `buildVocabCards()` - 5 edges
9. `buildDeck()` - 5 edges
10. `LevelData` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/Dashboard.tsx → src/context/AuthContext.tsx
- `ForgotPassword()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/ForgotPassword.tsx → src/context/AuthContext.tsx
- `Login()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/Login.tsx → src/context/AuthContext.tsx
- `ResetPassword()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/ResetPassword.tsx → src/context/AuthContext.tsx
- `Signup()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/Signup.tsx → src/context/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (15 total, 1 thin omitted)

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
Nodes (25): ADSENSE_CONFIG, App(), CookieBanner(), getConsent(), renderFurigana(), SelectedKanji, setConsent(), shuffleArray() (+17 more)

### Community 4 - "devDependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @types/node (+15 more)

### Community 5 - "flashcards.ts"
Cohesion: 0.18
Nodes (17): allDecks(), buildCompoundReadings(), buildDeck(), buildGrammarCards(), buildKanjiCards(), buildVocabCards(), buildWeakGrammarDeck(), COMPOUND_READINGS (+9 more)

### Community 6 - "worker/index.ts"
Cohesion: 0.10
Nodes (15): adminRoutes, authRoutes, TODO: Send reset email, progressRoutes, answerToQuality(), qualityToSM2(), sm2(), SM2State (+7 more)

### Community 7 - "data/index.ts"
Cohesion: 0.18
Nodes (15): allLevels, hydrateLevelData(), levelData, n3Data, n4Data, n5Data, DeviceMode, GameState (+7 more)

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
Cohesion: 0.30
Nodes (10): enqueueResult(), flushQueue(), newClientTestId(), QueuedTestResult, queueSize(), read(), write(), Subscription (+2 more)

### Community 13 - "romaji.ts"
Cohesion: 0.38
Nodes (6): ch_next_romaji(), HIRAGANA, KATAKANA_MAP, toRomaji(), translitKana(), youonHira

## Knowledge Gaps
- **95 isolated node(s):** `UiStrings`, `uiTranslations`, `SvgProps`, `ADSENSE_CONFIG`, `SelectedKanji` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `dependencies`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `Icons.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `UiStrings`, `uiTranslations`, `SvgProps` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JLPT Test Hub` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.07439024390243902 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06028368794326241 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._