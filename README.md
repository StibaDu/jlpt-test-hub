# JLPT Test Hub

Free JLPT N5, N4, N3 practice tests with official exam questions, interactive furigana dictionary, and timed simulator. No signup required.

## Features

- **150 official JLPT questions** (50 per level) from the 2018 Official Practice Workbook
- **Interactive furigana dictionary** — click any kanji for reading, meaning, and context
- **Two test modes**: timed real exam simulation + untimed learning with instant explanations
- **Desktop + mobile simulator** modes
- **Bilingual UI**: English + German
- **Full SEO**: structured data, sitemap, per-level routing
- **Monetization**: AdSense-ready, Amazon Associates, JapanesePod101 affiliate, Premium tier
- **Legal compliance**: GDPR cookie consent, privacy policy, terms of service, 特定商取引法 disclosure

## Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 3
- No backend — runs entirely in the browser
- ~145 KB gzipped

## Quick Start

```bash
npm install
npm run dev      # local dev at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Deployment (Cloudflare Pages — free)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → Create a project → Connect to Git
2. Select the `jlpt-test-hub` GitHub repo
3. Set build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Click "Save and Deploy"
5. Your site is live at `https://jlpt-test-hub.pages.dev`

### Custom domain

1. Buy `jlpttesthub.com` (~$10/year at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/))
2. In Cloudflare Pages → Custom domains → Set up a custom domain → Enter `jlpttesthub.com`
3. Follow the DNS instructions (Cloudflare will guide you — usually just add a CNAME)
4. SSL is automatic and free

### Update canonical URL

After connecting your domain, update these files with your real URL:
- `index.html` — `<link rel="canonical">` and all `og:url` / `og:url` meta tags
- `public/robots.txt` — `Sitemap: https://jlpttesthub.com/sitemap.xml`
- `public/sitemap.xml` — all `<loc>` URLs

## Before going live — placeholder checklist

Search for these strings in `src/App.tsx` and `index.html` and replace with real values:

| Placeholder | Replace with |
|---|---|
| `ca-pub-YOUR_PUBLISHER_ID` | Your Google AdSense publisher ID |
| `1111111111` etc. | Real AdSense slot IDs |
| `jlpttesthub-20` | Your Amazon Associates tracking ID |
| `YOUR_AFFILIATE_ID` | Your JapanesePod101 affiliate ID |
| `YOUR_PAYPAL_BUTTON_ID` | Your PayPal hosted button ID for Premium |
| `[YOUR NAME]` | Your real name (seller disclosure) |
| `[YOUR ADDRESS IN JAPAN]` | Your Japanese address |
| `[YOUR EMAIL]` | Your contact email |
| `[YOUR PHONE]` | Your phone number |

## Monetization setup

### Google AdSense
1. Get ~50 daily visitors first
2. Apply at [adsense.google.com](https://adsense.google.com)
3. Replace `ADSENSE_CONFIG` in `src/App.tsx` with your publisher ID + slot IDs
4. Add the AdSense script to `index.html` `<head>`
5. Replace the placeholder `<div>` in `GoogleAdBanner` with real `<ins class="adsbygoogle">` tags

### Amazon Associates
1. Sign up at [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
2. Replace `jlpttesthub-20` in all book links with your tracking ID

### JapanesePod101 Affiliate
1. Sign up at [japanesepod101.com/affiliate-program](https://www.japanesepod101.com/affiliate-program)
2. Replace `YOUR_AFFILIATE_ID` in the affiliate banner link

### Premium tier (PayPal)
1. Create a PayPal subscription button at [paypal.com](https://www.paypal.com/businessmanage/paymentbuttons)
2. Replace `YOUR_PAYPAL_BUTTON_ID` in the Premium modal

## Legal (Japan / EU)

Since the operator will be based in Japan:
- **特定商取引法 (Specified Commercial Transactions Law)**: seller disclosure is included as a modal — fill in real info after moving to Japan
- **GDPR**: cookie consent banner + privacy policy cover EU visitors regardless of operator location
- **APPI (個人情報保護法)**: covered by the dual-compliant privacy policy
- **Affiliate labeling**: all affiliate sections labeled "Werbung" / "Advertisement" as required by UWG §5a and Amazon TOS

## Project structure

```
src/
  data/
    types.ts    — shared TypeScript interfaces
    n5.ts       — N5 official questions + kanji dictionary (176 entries)
    n4.ts       — N4 official questions + kanji dictionary (172 entries)
    n3.ts       — N3 official questions + kanji dictionary (299 entries)
    index.ts    — combines all levels
  App.tsx       — main app (UI, routing, SEO, monetization, legal)
  main.tsx      — entry point
  index.css     — Tailwind + custom animations
public/
  robots.txt
  sitemap.xml
  favicon.svg
index.html       — SEO meta tags, JSON-LD structured data, noscript fallback
```

## License

The JLPT questions are sourced from the official JLPT Practice Workbook published by the Japan Foundation and JEES. This project is not affiliated with or endorsed by the Japan Foundation or JEES. JLPT is a registered trademark.

The application code is proprietary.