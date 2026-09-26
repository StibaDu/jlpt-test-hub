# Graph Report - jlpt-n5-simulator  (2026-09-26)

## Corpus Check
- 38 files · ~53,049 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 197 nodes · 220 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c806f4bf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Launch Checklist — JLPT Test Hub
- JLPT Test Hub
- useAuth
- App.tsx
- devDependencies
- package.json
- auth/index.ts
- routes.tsx
- Icons.tsx
- 0001_initial_schema.sql
- worker/index.ts
- admin/index.ts
- progress/index.ts
- subscription/index.ts
- tests/index.ts
- user/index.ts

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 20 edges
2. `Launch Checklist — JLPT Test Hub` - 12 edges
3. `JLPT Test Hub` - 10 edges
4. `users` - 6 edges
5. `scripts` - 5 edges
6. `Monetization setup` - 5 edges
7. `App()` - 4 edges
8. `weak_questions` - 3 edges
9. `ProtectedRoute()` - 3 edges
10. `PublicRoute()` - 3 edges

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

## Communities (17 total, 5 thin omitted)

### Community 0 - "Launch Checklist — JLPT Test Hub"
Cohesion: 0.15
Nodes (12): Launch Checklist — JLPT Test Hub, Phase 10: Growth & SEO (Ongoing), Phase 1: Deploy to Cloudflare Pages (Day 1), Phase 2: Custom Domain (Day 1–2), Phase 3: Google Search Console (Day 2), Phase 4: Fill in Placeholders (Day 2–3), Phase 5: Amazon Associates (Week 2 — after ~some traffic), Phase 6: Google AdSense (Month 2 — after ~50 daily visitors) (+4 more)

### Community 1 - "JLPT Test Hub"
Cohesion: 0.12
Nodes (16): Amazon Associates, Before going live — placeholder checklist, Custom domain, Deployment (Cloudflare Pages — free), Features, Google AdSense, JapanesePod101 Affiliate, JLPT Test Hub (+8 more)

### Community 2 - "useAuth"
Cohesion: 0.12
Nodes (19): ProtectedRoute(), ProtectedRouteProps, PublicRoute(), AuthContext, AuthContextType, AuthProvider(), fetchWithAuth(), refreshAccessToken() (+11 more)

### Community 3 - "App.tsx"
Cohesion: 0.08
Nodes (11): ADSENSE_CONFIG, App(), CookieBanner(), getConsent(), renderFurigana(), SelectedKanji, setConsent(), shuffleArray() (+3 more)

### Community 4 - "devDependencies"
Cohesion: 0.10
Nodes (21): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @types/node (+13 more)

### Community 5 - "package.json"
Cohesion: 0.12
Nodes (16): dependencies, react, react-dom, react-router-dom, name, private, scripts, build (+8 more)

### Community 6 - "auth/index.ts"
Cohesion: 0.14
Nodes (7): authRoutes, forgotPasswordSchema, loginSchema, TODO: Implement actual email sending, resetPasswordSchema, signupSchema, verifyEmailSchema

### Community 7 - "routes.tsx"
Cohesion: 0.17
Nodes (9): Dashboard, ForgotPassword, Intro, Login, ResetPassword, Signup, TestPage, Upgrade (+1 more)

### Community 8 - "Icons.tsx"
Cohesion: 0.24
Nodes (5): IconCheck(), IconClock(), IconX(), SvgProps, TestPage()

### Community 9 - "0001_initial_schema.sql"
Cohesion: 0.36
Nodes (8): refresh_tokens, subscriptions, test_attempts, user_progress, users, weak_questions, webhook_events, question

### Community 10 - "worker/index.ts"
Cohesion: 0.25
Nodes (6): adminRoutesProtected, app, Bindings, protectedRoutes, TODO: Verify signature and process event, TODO: Verify PayPal webhook signature

## Knowledge Gaps
- **82 isolated node(s):** `webhook_events`, `name`, `private`, `version`, `type` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `useAuth` to `Icons.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `webhook_events`, `name`, `private` to the rest of the system?**
  _82 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JLPT Test Hub` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.11822660098522167 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07526881720430108 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._