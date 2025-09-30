# RUPASARA — By RK House

Vite + React + Tailwind site with Cart, WhatsApp ordering, and Google Sheet webhook.

## Quick Start
```bash
npm install
npm run dev
```

## Env
Duplicate `.env.example` to `.env` and set:
```
VITE_WHATSAPP_NUMBER=33XXXXXXXXX   # no +, no spaces
VITE_SHEET_WEBHOOK=YOUR_APPS_SCRIPT_WEB_APP_URL
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- Edit products in `src/App.jsx` (CATALOG).
- Replace placeholder images with your own (public URLs or local assets).
- WhatsApp buttons work even without webhook; webhook powers the form submission to Google Sheets.
