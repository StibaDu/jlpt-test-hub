# Graph Report - jlpt-n5-simulator  (2026-09-26)

## Corpus Check
- 38 files · ~51,650 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 199 nodes · 236 edges · 12 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `84ed7d09`
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
- routes.tsx
- Icons.tsx
- 0001_initial_schema.sql
- dependencies

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 20 edges
2. `Launch Checklist — JLPT Test Hub` - 12 edges
3. `JLPT Test Hub` - 10 edges
4. `users` - 6 edges
5. `scripts` - 5 edges
6. `Monetization setup` - 5 edges
7. `App()` - 4 edges
8. `AuthProvider()` - 4 edges
9. `getConsent()` - 3 edges
10. `CookieBanner()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `TestPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/TestPage.tsx → src/context/AuthContext.tsx
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

## Communities (12 total, 0 thin omitted)

### Community 0 - "Launch Checklist — JLPT Test Hub"
Cohesion: 0.15
Nodes (12): Launch Checklist — JLPT Test Hub, Phase 10: Growth & SEO (Ongoing), Phase 1: Deploy to Cloudflare Pages (Day 1), Phase 2: Custom Domain (Day 1–2), Phase 3: Google Search Console (Day 2), Phase 4: Fill in Placeholders (Day 2–3), Phase 5: Amazon Associates (Week 2 — after ~some traffic), Phase 6: Google AdSense (Month 2 — after ~50 daily visitors) (+4 more)

### Community 1 - "JLPT Test Hub"
Cohesion: 0.12
Nodes (16): Amazon Associates, Before going live — placeholder checklist, Custom domain, Deployment (Cloudflare Pages — free), Features, Google AdSense, JapanesePod101 Affiliate, JLPT Test Hub (+8 more)

### Community 2 - "useAuth"
Cohesion: 0.11
Nodes (19): ProtectedRoute(), ProtectedRouteProps, PublicRoute(), AuthContext, AuthContextType, AuthProvider(), fetchWithAuth(), refreshAccessToken() (+11 more)

### Community 3 - "App.tsx"
Cohesion: 0.08
Nodes (11): ADSENSE_CONFIG, App(), CookieBanner(), getConsent(), renderFurigana(), SelectedKanji, setConsent(), shuffleArray() (+3 more)

### Community 4 - "devDependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @types/node (+15 more)

### Community 5 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 6 - "worker/index.ts"
Cohesion: 0.12
Nodes (11): adminRoutes, authRoutes, TODO: Send reset email, TODO: Send verification email, progressRoutes, subscriptionRoutes, testRoutes, userRoutes (+3 more)

### Community 7 - "routes.tsx"
Cohesion: 0.17
Nodes (9): Dashboard, ForgotPassword, Intro, Login, ResetPassword, Signup, TestPage, Upgrade (+1 more)

### Community 8 - "Icons.tsx"
Cohesion: 0.24
Nodes (5): IconCheck(), IconClock(), IconX(), SvgProps, TestPage()

### Community 9 - "0001_initial_schema.sql"
Cohesion: 0.36
Nodes (8): refresh_tokens, subscriptions, test_attempts, user_progress, users, weak_questions, webhook_events, question

### Community 10 - "dependencies"
Cohesion: 0.12
Nodes (17): argon2, hono, @hono/zod-validator, dependencies, argon2, hono, @hono/zod-validator, react (+9 more)

## Knowledge Gaps
- **76 isolated node(s):** `UiStrings`, `uiTranslations`, `SvgProps`, `ADSENSE_CONFIG`, `SelectedKanji` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `Icons.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `UiStrings`, `uiTranslations`, `SvgProps` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JLPT Test Hub` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.11494252873563218 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07526881720430108 - nodes in this community are weakly interconnected._