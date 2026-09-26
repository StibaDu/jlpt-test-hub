# Launch Checklist — JLPT Test Hub

## Phase 1: Deploy to Cloudflare Pages (Day 1)

- [ ] Go to https://pages.cloudflare.com → Create a project → Connect to Git
- [ ] Select `StibaDu/jlpt-test-hub` repo
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Deploy — site live at `https://jlpt-test-hub.pages.dev`

## Phase 2: Custom Domain (Day 1–2)

- [ ] Buy `jlpttesthub.com` at Cloudflare Registrar (~$10/year)
- [ ] In Cloudflare Pages → Custom domains → Add `jlpttesthub.com`
- [ ] Add `www.jlpttesthub.com` as well (redirects to apex)
- [ ] Wait for SSL provisioning (~5 min)
- [ ] Update canonical URLs in `index.html`, `public/robots.txt`, `public/sitemap.xml`
- [ ] Push updated code → Cloudflare auto-redeploys
- [ ] Verify site loads at https://jlpttesthub.com

## Phase 3: Google Search Console (Day 2)

- [ ] Go to https://search.google.com/search-console
- [ ] Add property → `jlpttesthub.com`
- [ ] Verify ownership (Cloudflare DNS TXT record — instructions in GSC)
- [ ] Submit sitemap: `https://jlpttesthub.com/sitemap.xml`
- [ ] Request indexing for the homepage
- [ ] Check "Coverage" tab for any errors

## Phase 4: Fill in Placeholders (Day 2–3)

- [ ] Replace `[YOUR NAME]` in seller disclosure
- [ ] Replace `[YOUR ADDRESS IN JAPAN]` (can use a placeholder until you move)
- [ ] Replace `[YOUR EMAIL]` — set up a contact email (e.g. contact@jlpttesthub.com)
- [ ] Replace `[YOUR PHONE]` (optional — can omit until in Japan)
- [ ] Push changes

## Phase 5: Amazon Associates (Week 2 — after ~some traffic)

- [ ] Sign up at https://affiliate-program.amazon.com
- [ ] Get your tracking ID (e.g. `jlpttesthub-20`)
- [ ] Replace `jlpttesthub-20` in all book links in `src/App.tsx`
- [ ] Push changes
- [ ] Test that affiliate links work (click one → check Amazon URL has your tag)

## Phase 6: Google AdSense (Month 2 — after ~50 daily visitors)

- [ ] Apply at https://adsense.google.com
- [ ] Add `jlpttesthub.com` as a site
- [ ] Wait for approval (1–14 days)
- [ ] Once approved: get your publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`)
- [ ] Create 4 ad units → get slot IDs
- [ ] Replace `ADSENSE_CONFIG` in `src/App.tsx` with real IDs
- [ ] Add AdSense script to `index.html` `<head>`:
      `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXX" crossorigin="anonymous"></script>`
- [ ] Replace placeholder divs in `GoogleAdBanner` with real `<ins>` tags
- [ ] Push changes
- [ ] Verify ads appear (may take 24–48h for first ads)

## Phase 7: JapanesePod101 Affiliate (Month 2)

- [ ] Sign up at https://www.japanesepod101.com/affiliate-program
- [ ] Get your affiliate ID
- [ ] Replace `YOUR_AFFILIATE_ID` in `src/App.tsx`
- [ ] Push changes

## Phase 8: Premium Tier — PayPal (Month 3+)

- [ ] Create a PayPal Business account (if not already)
- [ ] Create a subscription button at PayPal → Tools → Payment Buttons
- [ ] Set price: $4.99/month and $29.99/year
- [ ] Get the hosted button ID
- [ ] Replace `YOUR_PAYPAL_BUTTON_ID` in `src/App.tsx`
- [ ] Push changes
- [ ] Test: click "Go Pro" → complete a test purchase → verify it works

## Phase 9: Post-Japan Move (After relocating)

- [ ] Register as 個人事業 (sole proprietor) at local tax office
- [ ] Update seller disclosure with real Japanese address + phone
- [ ] Set up Japanese bank account (SMBC / MUFG) for Stripe payouts
- [ ] Consider switching PayPal to Japanese PayPal account
- [ ] File 確定申告 (tax return) by March 15 — declare website income

## Phase 10: Growth & SEO (Ongoing)

- [ ] Share on r/LearnJapanese and r/jlpt (without spamming — provide value)
- [ ] Post on Japanese learning forums (JLPT Boot Camp, WaniKani community)
- [ ] Write a blog post / Twitter thread about the project
- [ ] Consider adding N2/N1 levels (more content = more SEO = more traffic)
- [ ] Monitor Google Search Console for keyword opportunities
- [ ] Add more questions per level (aim for 100+ per level eventually)
- [ ] Consider adding listening section (audio questions)

## Quick reference — all placeholder strings to replace

```
grep -rn "YOUR_\|ca-pub-\|jlpttesthub-20\|\[YOUR" src/ index.html public/
```