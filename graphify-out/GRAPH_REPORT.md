# Graph Report - jlpt-n5-simulator  (2026-10-11)

## Corpus Check
- 80 files · ~230,528 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 695 nodes · 790 edges · 52 communities (50 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `794bea1c`
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
- Wohnen in Tokyo: Share Houses & Apartments günstig finden
- Budget Housing in Tokyo: Share Houses & Apartments
- Der 30-Tage-Plan
- JLPT N5 Study Plan: Your 30-Day Guide
- JLPT-Prüfungstag: Was dich erwartet & Last-Minute-Tipps
- JLPT Test Day: What to Expect & Last-Minute Tips
- Wo Arbeitssuchende wirklich fündig werden
- Where job seekers actually find work
- build-blog.mjs
- Tokyo günstig unterwegs: Metro-Pässe, Rabatt-Tickets & IC Cards
- Tokyo Transport on a Budget: Metro Passes, Discount Tickets & IC Cards
- Günstig essen in Tokyo: Über 1.000 Restaurants unter 1.000 ¥
- Cheap Eats in Tokyo: 1000+ Restaurants Under ¥1,000
- Genki Versicherung für Japan: Traveler vs Native (ehrlicher Test 2026)
- Genki Insurance for Japan: Traveler vs Native (Honest 2026 Review)
- Japanisch-Schulen in Tokyo: So findest du die günstige
- Japanese Language Schools in Tokyo: How to Pick an Affordable One
- Karteikarten für JLPT-Kanji (N5–N3) — die Spaced-Repetition-Methode
- How to Use Flashcards for JLPT Kanji (N5–N3) — the Spaced Way
- build-pages.mjs
- romaji.ts
- TutorialModal.tsx
- JLPT N3 Grammatik: Die Muster, die über das Ergebnis entscheiden
- ai-catalog.json
- JLPT N3 Grammar: The Patterns That Decide the Test
- tts.ts
- Wie man Kanji lernt: eine Methode, die bis zum Prüfungstag hält
- How to Study Kanji: A Method That Actually Holds to Test Day
- JLPT Hören üben: Wie die Sektion funktioniert und was sie wirklich trainiert
- JLPT Listening Practice: How the Section Works and What Actually Trains It
- AuthModal.tsx
- Launch posts — copy-paste ready (post these yourself)
- kanjiReadings.ts

## God Nodes (most connected - your core abstractions)
1. `JLPT N4 Grammar: The 15 Most Important Patterns` - 21 edges
2. `JLPT N4 Grammatik: Die 15 wichtigsten Muster` - 19 edges
3. `useAuth()` - 18 edges
4. `Launch Checklist — JLPT Test Hub` - 12 edges
5. `JLPT-Prüfungstag: Was dich erwartet & Last-Minute-Tipps` - 11 edges
6. `JLPT Test Day: What to Expect & Last-Minute Tips` - 10 edges
7. `JLPT N3 Grammatik: Die Muster, die über das Ergebnis entscheiden` - 10 edges
8. `JLPT N3 Grammar: The Patterns That Decide the Test` - 10 edges
9. `JLPT Test Hub` - 10 edges
10. `Launch posts — copy-paste ready (post these yourself)` - 9 edges

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

## Communities (52 total, 2 thin omitted)

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
Cohesion: 0.07
Nodes (11): ADSENSE_CONFIG, App(), CookieBanner(), getConsent(), renderFurigana(), SelectedKanji, setConsent(), shuffleArray() (+3 more)

### Community 4 - "devDependencies"
Cohesion: 0.08
Nodes (25): autoprefixer, marked, oxlint, devDependencies, autoprefixer, marked, oxlint, postcss (+17 more)

### Community 5 - "flashcards.ts"
Cohesion: 0.14
Nodes (19): allDecks(), buildCompoundReadings(), buildDeck(), buildGrammarCards(), buildKanjiCards(), buildKanjiFocusDeck(), buildVocabCards(), buildWeakGrammarDeck() (+11 more)

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
Cohesion: 0.10
Nodes (19): 10. 〜てみる (ausprobieren), 11. 〜ば / 〜たら / 〜なら / 〜と (die vier "wenn"s), 12. 〜すぎる / 〜すぎ (zu sehr), 13. 〜やすい / 〜にくい (leicht/schwer zu tun), 14. 〜はず (es sollte sein / vermutlich), 15. 〜ため(に) (wegen / zum Zweck), 1. 〜ことになっている (es ist die Regel, dass…), 2. 〜のに (obwohl — mit Frust) (+11 more)

### Community 15 - "JLPT N4 Grammar: The 15 Most Important Patterns"
Cohesion: 0.09
Nodes (21): 10. 〜てみる (try and see), 11. 〜ば / 〜たら / 〜なら / 〜と (the four "if"s), 12. 〜すぎる / 〜すぎ (too much), 13. 〜やすい / 〜にくい (easy/hard to do), 14. 〜はず (it should be / supposed to), 15. 〜ため(に) (because of / for the purpose), 1. 〜ことになっている (it's the rule that…), 2. 〜のに (even though — frustration) (+13 more)

### Community 16 - "15 Tokyo-Spartipps: Touristenfallen vermeiden & Geld sparen"
Cohesion: 0.12
Nodes (15): 15 Tokyo-Spartipps: Touristenfallen vermeiden & Geld sparen, 2nd Street statt Shimokitazawa-Vintage, Alltags-Tipps, Bessere Alternativen, Check den letzten Zug, Deine Monatsbudgets in Tokyo — konkret, Die 60-Sekunden-Liste gratis Unterhaltung, Diese Touristenfallen überspringen (+7 more)

### Community 17 - "15 Tokyo Budget Tips: Avoid Tourist Traps & Save Money"
Cohesion: 0.12
Nodes (15): 15 Tokyo Budget Tips: Avoid Tourist Traps & Save Money, 2nd Street instead of Shimokitazawa vintage, And the biggest money-saver of all, Better swaps, Carry your trash, Check the last train, Lunch menus are the cheat code, Nakano Broadway instead of Akihabara (+7 more)

### Community 18 - "The Only Guide you need, to live Cheap in Tokyo!"
Cohesion: 0.18
Nodes (10): 🏠 AFFORDABLE ACCOMMODATION, 🍔 CHEAP EATS & PLACES IN TOKYO, 👕CLOTHING, 📚EDUCATION AND LANGUAGE, **Every Restaurant in Tokyo with a under ￥1000 Lunch Menu**, 🏥 HEALTH INSURANCE, 💰JOBS, 📱SIM CARDS (+2 more)

### Community 19 - "Wohnen in Tokyo: Share Houses & Apartments günstig finden"
Cohesion: 0.18
Nodes (10): Aus deutscher Sicht — die Punkte, die wirklich anders sind, Empfehlenswerte Share-House-Portale, Share House vs. eigene Wohnung, [Share Share (シェアシェア)](https://share-share.jp/), [Shares (シェアーズ)](https://shares.house/), [Tokyo β](https://www.tokyobeta.jp/en/), Und die Sprache?, Wohnen in Tokyo: Share Houses & Apartments günstig finden (+2 more)

### Community 20 - "Budget Housing in Tokyo: Share Houses & Apartments"
Cohesion: 0.17
Nodes (11): Budget Housing in Tokyo: Share Houses & Apartments, Ready for the language part of living in Japan?, Recommended share house sites, Share house vs. private apartment, [Share Share (シェアシェア)](https://share-share.jp/), [Shares (シェアーズ)](https://shares.house/), The three-month decision path, [Tokyo β](https://www.tokyobeta.jp/en/) (+3 more)

### Community 21 - "Der 30-Tage-Plan"
Cohesion: 0.17
Nodes (11): Das 100-Kanji-Paket in vier Wochen, Der 30-Tage-Plan, Germany-spezifisch: Anmeldung, Prüfungsorte, Kosten, JLPT N5 Lernplan: Dein 30-Tage-Guide, Tag 15–21: Lesen & Hören pushen, Tag 1–7: Fundament, Tag 22–27: Simulation, Tag 28–30: Finalpolitur (+3 more)

### Community 22 - "JLPT N5 Study Plan: Your 30-Day Guide"
Cohesion: 0.14
Nodes (13): Common N5 mistakes (and the day to fix each), Days 15–21: Reading & listening push, Days 1–7: Foundations, Days 22–27: Simulation, Days 28–30: Final polish, Days 8–14: Structure, JLPT N5 Study Plan: Your 30-Day Guide, Listening practice without a premium subscription (+5 more)

### Community 23 - "JLPT-Prüfungstag: Was dich erwartet & Last-Minute-Tipps"
Cohesion: 0.17
Nodes (11): Der Prüfungstag im Testzentrum (reale Folgen), Der Zeitplan (der JLPT läuft überall nach japanischer Zeit), Deutschland-spezifisch: Anreise und Logistik, Die Countdown-Checkliste, Die Nacht davor, JLPT-Prüfungstag: Was dich erwartet & Last-Minute-Tipps, Schon am Ziel?, Taktik pro Sektion (+3 more)

### Community 24 - "JLPT Test Day: What to Expect & Last-Minute Tips"
Cohesion: 0.18
Nodes (10): Already past the finish line?, How scoring actually works, JLPT Test Day: What to Expect & Last-Minute Tips, Section tactics, Test-day flow at the venue (real sequence), The last-week checklist, The night before, The schedule (JLPT runs on Japanese time, everywhere) (+2 more)

### Community 25 - "Wo Arbeitssuchende wirklich fündig werden"
Cohesion: 0.20
Nodes (9): Aus deutschsprachiger Sicht: Visum, Steuern, Krankenversicherung, Das Japanisch, das du am Job brauchst, [LanCul (ランカル英会話)](https://lancul.com/recruit_en), Persönlich fragen: WEGO und Clothing-Shops, Uber Eats (Tokyo), Welche Jobs kann ich machen?, Wo Arbeitssuchende wirklich fündig werden, Working Holiday Jobs in Japan: Typen, Löhne & wie du sie findest (+1 more)

### Community 26 - "Where job seekers actually find work"
Cohesion: 0.17
Nodes (11): Ask in person: WEGO and clothing shops, Jobs by Japanese level, [LanCul (ランカル英会話)](https://lancul.com/recruit_en), The Japanese you'll need on the job, The two channels people ignore, Uber Eats (Tokyo), What jobs can you do?, What the "keigo wall" actually costs you (+3 more)

### Community 27 - "build-blog.mjs"
Cohesion: 0.14
Nodes (11): files, frontmatters, legalSections, OUT, posts, relatedBlock(), relatedFor(), ROOT (+3 more)

### Community 28 - "Tokyo günstig unterwegs: Metro-Pässe, Rabatt-Tickets & IC Cards"
Cohesion: 0.22
Nodes (8): Deutschland-Vergleich: Was dich beim Bahnhofssystem überrascht, ⚠️ Die Last-Train-Regel (spart dir ein 5.000-¥-Taxi), Günstige Tickets & IC Cards, In Japan günstig leben — die ganze Serie, Metro & Gurutto Pass (メトロ＆ぐるっとパス), Spar-Habits, Tokyo günstig unterwegs: Metro-Pässe, Rabatt-Tickets & IC Cards, Unbegrenzte Metro-Pässe (bester Wert)

### Community 29 - "Tokyo Transport on a Budget: Metro Passes, Discount Tickets & IC Cards"
Cohesion: 0.20
Nodes (9): Cheap Tickets & IC Cards, Living in Japan on a budget — the full series, Metro & Gurutto Pass (メトロ＆ぐるっとパス), Save money with these habits, ⚠️ The last-train rule (saves you a ¥5,000 taxi), The teiki-ken reality for long-stay learners, Tokyo Transport on a Budget: Metro Passes, Discount Tickets & IC Cards, Unlimited metro passes (the best value) (+1 more)

### Community 30 - "Günstig essen in Tokyo: Über 1.000 Restaurants unter 1.000 ¥"
Cohesion: 0.25
Nodes (7): Aus deutscher Sicht — was dich beim Essen in Japan überraschen wird, Bereit, japanisch zu bestellen?, Budget-Fallen vermeiden, Die 1.000-¥-Mittagsregel, Die Local-Food-Karte, Günstig essen in Tokyo: Über 1.000 Restaurants unter 1.000 ¥, Highlights aus der 1.000-¥-Liste

### Community 31 - "Cheap Eats in Tokyo: 1000+ Restaurants Under ¥1,000"
Cohesion: 0.20
Nodes (9): Avoid these budget traps, Cheap Eats in Tokyo: 1000+ Restaurants Under ¥1,000, Highlights from the ¥1,000 list, Konbini strategy — the underrated default, Neighborhoods that feed you well for cheap, Ready to order in Japanese?, The ¥1,000 Lunch Rule, The Local Food Map (+1 more)

### Community 32 - "Genki Versicherung für Japan: Traveler vs Native (ehrlicher Test 2026)"
Cohesion: 0.22
Nodes (8): Die Entscheidung in drei Zeilen, Genki Native — internationale Krankenversicherung, fürs Leben im Ausland, Genki Traveler — Reiseversicherung, bis 12 Monate, Genki Versicherung für Japan: Traveler vs Native (ehrlicher Test 2026), Warum eine unversicherte Woche in Japan teuer wird, Was Genki anbietet (und für wen), Was Nichtstun kostet, Während du dich versicherst — lerne die medizinische Vokabel

### Community 33 - "Genki Insurance for Japan: Traveler vs Native (Honest 2026 Review)"
Cohesion: 0.22
Nodes (8): Genki Insurance for Japan: Traveler vs Native (Honest 2026 Review), Genki Native — international health insurance, for life abroad, Genki Traveler — travel insurance, up to 12 months, The decision, in three lines, What Genki actually offers (and for whom), What it costs you to do nothing, While you're getting insured — learn the medical vocabulary, Why being uninsured in Japan for even a week is expensive

### Community 34 - "Japanisch-Schulen in Tokyo: So findest du die günstige"
Cohesion: 0.20
Nodes (9): Günstiger Tipp in Tokyo: ALA, Japanisch-Schulen in Tokyo: So findest du die günstige, Nach der Schule: übe die Prüfung selbst, Schultypen im Überblick, Vermittlungsagentur nutzen — für dich kostenlos, Visum-Mathematik, konkret, Warum „billig" und „teuer" in die Irre führen, Was eine Schule nicht fixen wird (+1 more)

### Community 35 - "Japanese Language Schools in Tokyo: How to Pick an Affordable One"
Cohesion: 0.20
Nodes (9): Affordable pick in Tokyo: ALA, After school: practice the exam itself, Japanese Language Schools in Tokyo: How to Pick an Affordable One, School types at a glance, The visa math, concretely, Use a placement agency — free for you, What a school will not fix, What to check before enrolling (+1 more)

### Community 36 - "Karteikarten für JLPT-Kanji (N5–N3) — die Spaced-Repetition-Methode"
Cohesion: 0.22
Nodes (8): Die Gewohnheits-Schleife, die überlebt, Die Kanji-Zahlen, damit dich nichts überrascht, Die zwei Fehlermodi, die du vermeiden musst, Karteikarten für JLPT-Kanji (N5–N3) — die Spaced-Repetition-Methode, Karten aus deinen echten Fehlern bauen, Lesen vs. Schreiben — deine Priorität, Radikale: der Cheat-Code, den dir niemand gesagt hat, Warum Abstände funktionieren (die Wissenschaft in einem Absatz)

### Community 37 - "How to Use Flashcards for JLPT Kanji (N5–N3) — the Spaced Way"
Cohesion: 0.22
Nodes (8): Building the deck properly, How to Use Flashcards for JLPT Kanji (N5–N3) — the Spaced Way, Radicals: the cheat code nobody mentioned to you, The habit loop that survives, The kanji counts, so nothing surprises you, The two failure modes to avoid, Use your actual mistakes as cards, Why spacing works (the science in one paragraph)

### Community 38 - "build-pages.mjs"
Cohesion: 0.17
Nodes (13): catName, esc(), kanjiTable(), META, okLabel(), OUT, questionBlock(), renderRuby() (+5 more)

### Community 39 - "romaji.ts"
Cohesion: 0.38
Nodes (6): ch_next_romaji(), HIRAGANA, KATAKANA_MAP, toRomaji(), translitKana(), youonHira

### Community 40 - "TutorialModal.tsx"
Cohesion: 0.15
Nodes (12): HINT_FLASH_KEY, HINT_REALTEST_KEY, HINT_WRONG_KEY, HINTS_ENABLED_KEY, hintsEnabled(), hintShown(), markHint(), SlideArt (+4 more)

### Community 41 - "JLPT N3 Grammatik: Die Muster, die über das Ergebnis entscheiden"
Cohesion: 0.18
Nodes (10): Der Aspectual-Satz (ている vs てある vs ておく), Der Satzbau-Test bei N3, Der Sprung von N4 in einem Satz, Die Erscheinungs-Familie (そうだ / ようだ / らしい / ように思われる), Die Konditionale bei N3 (ば・たら・なら・と・ばかり), Die Nominalisierer-Familie (こと vs の vs わけ), Die Stance-Marker (として / に対して / にとって / によると), Die Ursachen-Familie (おかげで / せいで / ばかりに / くせに) (+2 more)

### Community 42 - "ai-catalog.json"
Cohesion: 0.10
Nodes (20): format, required, content_policy, attribution, crawling, notes, training, description (+12 more)

### Community 43 - "JLPT N3 Grammar: The Patterns That Decide the Test"
Cohesion: 0.18
Nodes (10): JLPT N3 Grammar: The Patterns That Decide the Test, Practice in context, not from lists, The appearance family (そうだ / ようだ / らしい / ように思われる), The aspectual pair (ている vs てある vs ておく), The cause family (おかげで / せいで / ばかりに / くせに), The conditionals at N3 (ば・たら・なら・と・ばかり), The jump from N4 in one sentence, The nominalizer family (こと vs の vs わけ) (+2 more)

### Community 44 - "tts.ts"
Cohesion: 0.38
Nodes (9): getJapaneseVoice(), getSavedRate(), hasGoodJapaneseVoice(), listJapaneseVoices(), QUALITY_KEYWORDS, saveRate(), speak(), stopSpeaking() (+1 more)

### Community 45 - "Wie man Kanji lernt: eine Methode, die bis zum Prüfungstag hält"
Cohesion: 0.22
Nodes (8): Die zwei echten Blocker (und wie man sie löst), Schritt 1: Radikale önce lernen, dann Kanji, Schritt 2: Kanji immer mit einem Wort lernen, nie isoliert, Schritt 3: Lesen vs. Schreiben — setze deine Priorität, Schritt 4: Spaced (SRS — kommt nicht daran vorbei), Schritt 5: Der Fehler-Loop (die wertvollsten Karten), Wie eine Woche davon aussieht, Wie man Kanji lernt: eine Methode, die bis zum Prüfungstag hält

### Community 46 - "How to Study Kanji: A Method That Actually Holds to Test Day"
Cohesion: 0.22
Nodes (8): How to Study Kanji: A Method That Actually Holds to Test Day, Step 1: Meet radicals before kanji, Step 2: Learn the kanji with a word, never alone, Step 3: Reading vs. writing — pick your priority, Step 4: Space it (SRS — no way around this one), Step 5: The mistake loop (your highest-value cards), The two real blockers (and how to handle them), What a week of this looks like

### Community 47 - "JLPT Hören üben: Wie die Sektion funktioniert und was sie wirklich trainiert"
Cohesion: 0.22
Nodes (8): Das Audio läuft zweimal — nutze beide Durchgänge unterschiedlich, Die 10-Minuten-Routine, die funktioniert, Die Falle: die Sprache der Ablehnung, Gratis-Audio, das zum JLPT passt, JLPT Hören üben: Wie die Sektion funktioniert und was sie wirklich trainiert, Sofortantwort-Drills, die echtes Hören trainieren, Warum die Hörsektion scheitert, Wie die Hörsektion aufgebaut ist

### Community 48 - "JLPT Listening Practice: How the Section Works and What Actually Trains It"
Cohesion: 0.22
Nodes (8): Free audio sources that actually fit the JLPT, How the listening section is built, JLPT Listening Practice: How the Section Works and What Actually Trains It, Quick-response drills that train real listening, The 10-minute daily routine that works, The audio plays twice — use both passes differently, The trap: refusal language, Why the listening section fails people

### Community 50 - "Launch posts — copy-paste ready (post these yourself)"
Cohesion: 0.20
Nodes (9): 1. Reddit — r/LearnJapanese (biggest: ~900k members), 2. Reddit — r/JLPT / r/Bunpo / r/Japanese, 3. Language-learning Discords, 4. Product Hunt launch (worth doing once), 5. Pinterest (compounding, underestimated for study content), 6. Resource listicle outreach (5–8 emails, highest-quality backlinks), 7. Quora, 8. YouTube Shorts (optional but powerful) (+1 more)

### Community 51 - "kanjiReadings.ts"
Cohesion: 0.50
Nodes (3): KanjiReading, kanjiReadings, lookupReadings()

## Knowledge Gaps
- **396 isolated node(s):** `1. Reddit — r/LearnJapanese (biggest: ~900k members)`, `2. Reddit — r/JLPT / r/Bunpo / r/Japanese`, `3. Language-learning Discords`, `4. Product Hunt launch (worth doing once)`, `5. Pinterest (compounding, underestimated for study content)` (+391 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `dependencies`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `Icons.tsx`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `1. Reddit — r/LearnJapanese (biggest: ~900k members)`, `2. Reddit — r/JLPT / r/Bunpo / r/Japanese`, `3. Language-learning Discords` to the rest of the system?**
  _396 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JLPT Test Hub` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.07439024390243902 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07007575757575757 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._