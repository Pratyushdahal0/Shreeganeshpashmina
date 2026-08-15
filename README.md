# Shree Ganesh Pashmina — Production Frontend V5

Next.js + TypeScript + Framer Motion + Font Awesome storefront foundation.

## Design direction
International luxury fashion — Loro Piana-inspired restraint, modern editorial typography, and Nepali craftsmanship as the origin story. The site is intentionally not designed as a Nepal-only marketplace.

## V5 polish
- Font Awesome icons instead of emoji icons
- Real SVG country flags stored locally under `public/flags`
- Region + currency selector with persisted selection
- USD, GBP, EUR, AUD, CAD, INR, NPR
- Smooth route-level page transitions via Next.js template
- Staggered hero text reveal
- Softer blur + rise scroll reveals
- Cinematic hero image scale-in
- Refined product hover motion
- Smooth search, mega-menu, currency and cart drawers
- Responsive mobile navigation
- Reduced-motion support

## V1 commerce rules
- No online payment
- Cart → WhatsApp ordering
- Direct product enquiry → WhatsApp
- Final shipping and payment confirmed in WhatsApp
- Free shipping threshold: USD 400 (business policy still to be finalized)
- Temporary WhatsApp: +977 9849220167

## Data
`lib/data.ts` contains temporary product/catalogue data. On 17 Aug 2026, replace this fallback data with the approved catalogue or connect `lib/data.ts` to the backend API from the admin developer.

## Run
npm install
npm run dev
