# PlateCheck AI

A responsive website/PWA starter that can also be packaged for mobile later. It lets a user choose a meal photo, sends it to a server-side vision endpoint, and displays visible food groups plus optional variety ideas.

## Requirements
- Node.js 18 or newer
- An OpenAI API key for live photo analysis

## Run locally
1. Install Node.js.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your API key in `.env` as `OPENAI_API_KEY=...`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

The API key stays on the server. Do not put it in files inside `public/`, commit it to GitHub, or share it in screenshots.

## What is included
- Responsive mobile-first website.
- Photo selection and preview.
- Server-side image analysis endpoint.
- PWA manifest and service worker for installable website shell.
- Friendly food-group result cards.

## Important
- Photo recognition can be wrong. Foods can be hidden, mixed into dishes, or outside the frame.
- “Not obvious” does not mean the food group is definitely missing.
- This app does not calculate calories, diagnose conditions, set diets, or judge a person's body or meal.
- For public deployment, host the Node server on a service that supports server-side environment variables and HTTPS. GitHub Pages alone cannot run `server.js`.
- The PWA can be added to a phone home screen from a supported browser. A store-ready Android/iOS app is a later step using a wrapper such as Capacitor, plus platform-specific testing and publishing.
- Before sharing publicly, add a privacy notice, rate limiting, upload abuse protection, and review the hosting provider's data-retention settings.
