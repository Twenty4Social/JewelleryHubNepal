# Jewellery Hub Nepal

Multi-jeweller discovery for Nepal: shoppers describe a piece, receive unbiased catalog matches, and continue directly with the jeweller on WhatsApp. Aabhushan Crafts is the mock founding house.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) to `.env.local`. The server uses `gemini-3.6-flash`; without a key, search falls back to deterministic local catalog matching. Gemini's free tier currently has free input/output tokens, but submitted prompts may be used by Google to improve its products.

## Funnel analytics

The app records searches, WhatsApp clicks, and jeweller-signup clicks through `/api/leads`. To persist them:

1. Create a free Supabase project.
2. Run [supabase/schema.sql](./supabase/schema.sql) in its SQL editor.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and Vercel.

Without Supabase credentials, the customer flow still works but events are not persisted.

## Live sources

- Nepal gold and silver rates: [Federation of Nepal Gold & Silver Dealers' Associations](https://www.fenegosida.org/), refreshed every 30 minutes.
- Industry headlines: [Rapaport](https://rapaport.com/) and [Jewellery Business](https://www.jewellerybusiness.com/), refreshed hourly from publisher RSS feeds.

## Checks

```bash
npm test
npm run lint
npm run build
```
