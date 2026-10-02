# Graph Report - jlpt-n5-simulator  (2026-10-02)

## Corpus Check
- 70 files · ~109,766 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 516 nodes · 601 edges · 38 communities (37 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88b111d4`
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
- JLPT N4 Grammatik: Die 15 wichtigsten Muster
- vite.config.ts
- JLPT N4 Grammar: The 15 Most Important Patterns
- 15 Tokyo-Spartipps: Touristenfallen vermeiden & Geld sparen
- 15 Tokyo Budget Tips: Avoid Tourist Traps & Save Money
- The Only Guide you need, to live Cheap in Tokyo!
- Empfehlenswerte Share-House-Portale
- Budget Housing in Tokyo: Share Houses & Apartments
- Der 30-Tage-Plan
- The 30-day plan
- JLPT-Prüfungstag: Was dich erwartet & Last-Minute-Tipps
- JLPT Test Day: What to Expect & Last-Minute Tips
- Wo Arbeitssuchende wirklich fündig werden
- Where job seekers actually find work
- build-blog.mjs
- Tokyo günstig unterwegs: Metro-Pässe, Rabatt-Tickets & IC Cards
- Tokyo Transport on a Budget: Metro Passes, Discount Tickets & IC Cards
- Günstig essen in Tokyo: Über 1.000 Restaurants unter 1.000 ¥
- Cheap Eats in Tokyo: 1000+ Restaurants Under ¥1,000
- Krankenversicherung in Japan für Studenten & Digital Nomads
- Health Insurance in Japan for Students & Digital Nomads
- Japanisch-Schulen in Tokyo: So findest du die günstige
- Japanese Language Schools in Tokyo: How to Pick an Affordable One
- Karteikarten für JLPT-Kanji (N5–N3) — die Spaced-Repetition-Methode
- How to Use Flashcards for JLPT Kanji (N5–N3) — the Spaced Way

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 18 edges
2. `JLPT N4 Grammatik: Die 15 wichtigsten Muster` - 17 edges
3. `JLPT N4 Grammar: The 15 Most Important Patterns` - 17 edges
4. `Launch Checklist — JLPT Test Hub` - 12 edges
5. `JLPT Test Hub` - 10 edges
6. `The Only Guide you need, to live Cheap in Tokyo!` - 9 edges
7. `JLPT-Prüfungstag: Was dich erwartet & Last-Minute-Tipps` - 8 edges
8. `JLPT Test Day: What to Expect & Last-Minute Tips` - 8 edges
9. `Günstig essen in Tokyo: Über 1.000 Restaurants unter 1.000 ¥` - 6 edges
10. `Cheap Eats in Tokyo: 1000+ Restaurants Under ¥1,000` - 6 edges

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

## Communities (38 total, 1 thin omitted)

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
Cohesion: 0.05
Nodes (31): ADSENSE_CONFIG, App(), CookieBanner(), getConsent(), renderFurigana(), SelectedKanji, setConsent(), shuffleArray() (+23 more)

### Community 4 - "devDependencies"
Cohesion: 0.08
Nodes (25): autoprefixer, marked, oxlint, devDependencies, autoprefixer, marked, oxlint, postcss (+17 more)

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

### Community 13 - "JLPT N4 Grammatik: Die 15 wichtigsten Muster"
Cohesion: 0.11
Nodes (17): 10. 〜てみる (ausprobieren), 11. 〜ば / 〜たら / 〜なら / 〜と (die vier "wenn"s), 12. 〜すぎる / 〜すぎ (zu sehr), 13. 〜やすい / 〜にくい (leicht/schwer zu tun), 14. 〜はず (es sollte sein / vermutlich), 15. 〜ため(に) (wegen / zum Zweck), 1. 〜ことになっている (es ist die Regel, dass…), 2. 〜のに (obwohl — mit Frust) (+9 more)

### Community 15 - "JLPT N4 Grammar: The 15 Most Important Patterns"
Cohesion: 0.11
Nodes (17): 10. 〜てみる (try and see), 11. 〜ば / 〜たら / 〜なら / 〜と (the four "if"s), 12. 〜すぎる / 〜すぎ (too much), 13. 〜やすい / 〜にくい (easy/hard to do), 14. 〜はず (it should be / supposed to), 15. 〜ため(に) (because of / for the purpose), 1. 〜ことになっている (it's the rule that…), 2. 〜のに (even though — frustration) (+9 more)

### Community 16 - "15 Tokyo-Spartipps: Touristenfallen vermeiden & Geld sparen"
Cohesion: 0.14
Nodes (13): 15 Tokyo-Spartipps: Touristenfallen vermeiden & Geld sparen, 2nd Street statt Shimokitazawa-Vintage, Alltags-Tipps, Bessere Alternativen, Check den letzten Zug, Diese Touristenfallen überspringen, Mittagsmenüs sind der Cheat-Code, Nakano Broadway statt Akihabara (+5 more)

### Community 17 - "15 Tokyo Budget Tips: Avoid Tourist Traps & Save Money"
Cohesion: 0.14
Nodes (13): 15 Tokyo Budget Tips: Avoid Tourist Traps & Save Money, 2nd Street instead of Shimokitazawa vintage, And the biggest money-saver of all, Better swaps, Carry your trash, Check the last train, Lunch menus are the cheat code, Nakano Broadway instead of Akihabara (+5 more)

### Community 18 - "The Only Guide you need, to live Cheap in Tokyo!"
Cohesion: 0.18
Nodes (10): 🏠 AFFORDABLE ACCOMMODATION, 🍔 CHEAP EATS & PLACES IN TOKYO, 👕CLOTHING, 📚EDUCATION AND LANGUAGE, **Every Restaurant in Tokyo with a under ￥1000 Lunch Menu**, 🏥 HEALTH INSURANCE, 💰JOBS, 📱SIM CARDS (+2 more)

### Community 19 - "Empfehlenswerte Share-House-Portale"
Cohesion: 0.20
Nodes (9): Empfehlenswerte Share-House-Portale, Share House vs. eigene Wohnung, [Share Share (シェアシェア)](https://share-share.jp/), [Shares (シェアーズ)](https://shares.house/), [Tokyo β](https://www.tokyobeta.jp/en/), Und die Sprache?, Wohnen in Tokyo: Share Houses & Apartments günstig finden, Worauf du achten solltest (+1 more)

### Community 20 - "Budget Housing in Tokyo: Share Houses & Apartments"
Cohesion: 0.20
Nodes (9): Budget Housing in Tokyo: Share Houses & Apartments, Ready for the language part of living in Japan?, Recommended share house sites, Share house vs. private apartment, [Share Share (シェアシェア)](https://share-share.jp/), [Shares (シェアーズ)](https://shares.house/), [Tokyo β](https://www.tokyobeta.jp/en/), What to watch for (+1 more)

### Community 21 - "Der 30-Tage-Plan"
Cohesion: 0.20
Nodes (9): Der 30-Tage-Plan, JLPT N5 Lernplan: Dein 30-Tage-Guide, Tag 15–21: Lesen & Hören pushen, Tag 1–7: Fundament, Tag 22–27: Simulation, Tag 28–30: Finalpolitur, Tag 8–14: Struktur, Warum Simulation wichtiger ist als Studium (+1 more)

### Community 22 - "The 30-day plan"
Cohesion: 0.20
Nodes (9): Days 15–21: Reading & listening push, Days 1–7: Foundations, Days 22–27: Simulation, Days 28–30: Final polish, Days 8–14: Structure, JLPT N5 Study Plan: Your 30-Day Guide, The 30-day plan, What N5 actually requires (+1 more)

### Community 23 - "JLPT-Prüfungstag: Was dich erwartet & Last-Minute-Tipps"
Cohesion: 0.22
Nodes (8): Der Zeitplan (der JLPT läuft überall nach japanischer Zeit), Die Countdown-Checkliste, Die Nacht davor, JLPT-Prüfungstag: Was dich erwartet & Last-Minute-Tipps, Schon am Ziel?, Taktik pro Sektion, Was du mitnimmst, Was konfisziert wird oder Anmerkungen gibt

### Community 24 - "JLPT Test Day: What to Expect & Last-Minute Tips"
Cohesion: 0.22
Nodes (8): Already past the finish line?, JLPT Test Day: What to Expect & Last-Minute Tips, Section tactics, The last-week checklist, The night before, The schedule (JLPT runs on Japanese time, everywhere), What gets confiscated or marked, What to bring

### Community 25 - "Wo Arbeitssuchende wirklich fündig werden"
Cohesion: 0.22
Nodes (8): Das Japanisch, das du am Job brauchst, [LanCul (ランカル英会話)](https://lancul.com/recruit_en), Persönlich fragen: WEGO und Clothing-Shops, Uber Eats (Tokyo), Welche Jobs kann ich machen?, Wo Arbeitssuchende wirklich fündig werden, Working Holiday Jobs in Japan: Typen, Löhne & wie du sie findest, [World Unite!](https://www.world-unite.de/en/working-holiday/japan/ryokan-jobs-traditional-restaurant-hotel.html)

### Community 26 - "Where job seekers actually find work"
Cohesion: 0.22
Nodes (8): Ask in person: WEGO and clothing shops, [LanCul (ランカル英会話)](https://lancul.com/recruit_en), The Japanese you'll need on the job, Uber Eats (Tokyo), What jobs can you do?, Where job seekers actually find work, Working Holiday Jobs in Japan: Types, Wages & Where to Find Them, [World Unite!](https://www.world-unite.de/en/working-holiday/japan/ryokan-jobs-traditional-restaurant-hotel.html)

### Community 27 - "build-blog.mjs"
Cohesion: 0.22
Nodes (6): files, OUT, posts, ROOT, sitemapEntries, SRC

### Community 28 - "Tokyo günstig unterwegs: Metro-Pässe, Rabatt-Tickets & IC Cards"
Cohesion: 0.25
Nodes (7): ⚠️ Die Last-Train-Regel (spart dir ein 5.000-¥-Taxi), Günstige Tickets & IC Cards, In Japan günstig leben — die ganze Serie, Metro & Gurutto Pass (メトロ＆ぐるっとパス), Spar-Habits, Tokyo günstig unterwegs: Metro-Pässe, Rabatt-Tickets & IC Cards, Unbegrenzte Metro-Pässe (bester Wert)

### Community 29 - "Tokyo Transport on a Budget: Metro Passes, Discount Tickets & IC Cards"
Cohesion: 0.25
Nodes (7): Cheap Tickets & IC Cards, Living in Japan on a budget — the full series, Metro & Gurutto Pass (メトロ＆ぐるっとパス), Save money with these habits, ⚠️ The last-train rule (saves you a ¥5,000 taxi), Tokyo Transport on a Budget: Metro Passes, Discount Tickets & IC Cards, Unlimited metro passes (the best value)

### Community 30 - "Günstig essen in Tokyo: Über 1.000 Restaurants unter 1.000 ¥"
Cohesion: 0.29
Nodes (6): Bereit, japanisch zu bestellen?, Budget-Fallen vermeiden, Die 1.000-¥-Mittagsregel, Die Local-Food-Karte, Günstig essen in Tokyo: Über 1.000 Restaurants unter 1.000 ¥, Highlights aus der 1.000-¥-Liste

### Community 31 - "Cheap Eats in Tokyo: 1000+ Restaurants Under ¥1,000"
Cohesion: 0.29
Nodes (6): Avoid these budget traps, Cheap Eats in Tokyo: 1000+ Restaurants Under ¥1,000, Highlights from the ¥1,000 list, Ready to order in Japanese?, The ¥1,000 Lunch Rule, The Local Food Map

### Community 32 - "Krankenversicherung in Japan für Studenten & Digital Nomads"
Cohesion: 0.29
Nodes (6): Das Pflichtsystem (National Health Insurance), [Genki — Health Insurance for Digital Nomads](https://genki.world), Krankenversicherung in Japan für Studenten & Digital Nomads, Reiseflexible Versicherung für Kurzaufenthalte & Nomaden, Versichert ist Schritt eins — Arztverständnis Schritt zwei, Wann Genki-artige Versicherung besser ist als das lokale System

### Community 33 - "Health Insurance in Japan for Students & Digital Nomads"
Cohesion: 0.29
Nodes (6): [Genki — Health Insurance for Digital Nomads](https://genki.world), Getting insured is step one — understanding doctors is step two, Health Insurance in Japan for Students & Digital Nomads, The mandatory system (National Health Insurance), Travel/flexible insurance for short stays & nomads, When Genki-type insurance beats the local system

### Community 34 - "Japanisch-Schulen in Tokyo: So findest du die günstige"
Cohesion: 0.29
Nodes (6): Günstiger Tipp in Tokyo: ALA, Japanisch-Schulen in Tokyo: So findest du die günstige, Nach der Schule: übe die Prüfung selbst, Schultypen im Überblick, Vermittlungsagentur nutzen — für dich kostenlos, Worauf du vor der Anmeldung achten solltest

### Community 35 - "Japanese Language Schools in Tokyo: How to Pick an Affordable One"
Cohesion: 0.29
Nodes (6): Affordable pick in Tokyo: ALA, After school: practice the exam itself, Japanese Language Schools in Tokyo: How to Pick an Affordable One, School types at a glance, Use a placement agency — free for you, What to check before enrolling

### Community 36 - "Karteikarten für JLPT-Kanji (N5–N3) — die Spaced-Repetition-Methode"
Cohesion: 0.29
Nodes (6): Die Gewohnheits-Schleife, die überlebt, Die Kanji-Zahlen, damit dich nichts überrascht, Die zwei Fehlermodi, die du vermeiden musst, Karteikarten für JLPT-Kanji (N5–N3) — die Spaced-Repetition-Methode, Karten aus deinen echten Fehlern bauen, Warum Abstände funktionieren (die Wissenschaft in einem Absatz)

### Community 37 - "How to Use Flashcards for JLPT Kanji (N5–N3) — the Spaced Way"
Cohesion: 0.29
Nodes (6): How to Use Flashcards for JLPT Kanji (N5–N3) — the Spaced Way, The habit loop that survives, The kanji counts, so nothing surprises you, The two failure modes to avoid, Use your actual mistakes as cards, Why spacing works (the science in one paragraph)

## Knowledge Gaps
- **264 isolated node(s):** `UiStrings`, `uiTranslations`, `SvgProps`, `ADSENSE_CONFIG`, `SelectedKanji` (+259 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `dependencies`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `Icons.tsx`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `UiStrings`, `uiTranslations`, `SvgProps` to the rest of the system?**
  _264 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JLPT Test Hub` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.07439024390243902 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.052525252525252523 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._