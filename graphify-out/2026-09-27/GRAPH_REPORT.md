# Graph Report - jlpt-n5-simulator  (2026-09-27)

## Corpus Check
- 44 files · ~75,741 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 248 nodes · 319 edges · 13 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `51e52181`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Launch Checklist — JLPT Test Hub
- JLPT Test Hub
- useAuth
- App.tsx
- devDependencies
- package.json
- worker/index.ts
- types.ts
- Icons.tsx
- 0001_initial_schema.sql
- dependencies
- useAuth.ts

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 18 edges
2. `Launch Checklist — JLPT Test Hub` - 12 edges
3. `JLPT Test Hub` - 10 edges
4. `useAuth()` - 6 edges
5. `users` - 6 edges
6. `App()` - 5 edges
7. `enqueueResult()` - 5 edges
8. `flushQueue()` - 5 edges
9. `ttsSupported()` - 5 edges
10. `speak()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `useAuth()` --indirect_call--> `queueSize()`  [INFERRED]
  src/useAuth.ts → src/resultQueue.ts
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
Nodes (25): ADSENSE_CONFIG, App(), CookieBanner(), getConsent(), renderFurigana(), SelectedKanji, setConsent(), shuffleArray() (+17 more)

### Community 4 - "devDependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @types/node (+15 more)

### Community 5 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 6 - "worker/index.ts"
Cohesion: 0.11
Nodes (14): adminRoutes, authRoutes, TODO: Send reset email, progressRoutes, answerToQuality(), sm2(), SM2State, subscriptionRoutes (+6 more)

### Community 7 - "types.ts"
Cohesion: 0.15
Nodes (12): n3Data, n4Data, n5Data, DeviceMode, GameState, JLPTLevel, KanjiEntry, Lang (+4 more)

### Community 8 - "Icons.tsx"
Cohesion: 0.24
Nodes (4): IconCheck(), IconClock(), IconX(), SvgProps

### Community 9 - "0001_initial_schema.sql"
Cohesion: 0.36
Nodes (8): refresh_tokens, subscriptions, test_attempts, user_progress, users, weak_questions, webhook_events, question

### Community 10 - "dependencies"
Cohesion: 0.12
Nodes (17): argon2, hono, @hono/zod-validator, dependencies, argon2, hono, @hono/zod-validator, react (+9 more)

### Community 12 - "useAuth.ts"
Cohesion: 0.36
Nodes (10): enqueueResult(), flushQueue(), newClientTestId(), QueuedTestResult, queueSize(), read(), write(), Subscription (+2 more)

## Knowledge Gaps
- **95 isolated node(s):** `UiStrings`, `uiTranslations`, `SvgProps`, `ADSENSE_CONFIG`, `SelectedKanji` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `Icons.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `UiStrings`, `uiTranslations`, `SvgProps` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JLPT Test Hub` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.07439024390243902 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.061170212765957445 - nodes in this community are weakly interconnected._