# OPTIC HUB — Frontend (Telegram Mini App)

This is the deployable version of the app you've been testing in Claude —
same code, packaged as a real project so it can get a public HTTPS address
and open inside Telegram.

## 1. Push this folder to GitHub

Same method you already used for the backend: create a new repo (e.g.
`optic-hub-frontend`), then upload this whole folder's contents (drag the
extracted folder into "Add file → Upload files", or use `git push`).

You do **not** need to run anything locally — no Node.js install required.
Vercel builds it in the cloud in the next step.

## 2. Deploy on Railway (same as the backend)

1. In Railway: **New Project → Deploy from GitHub repo**, pick the
   `optic-hub-frontend` repo.
2. Railway auto-detects it's a Node project via `package.json`, runs
   `npm install`, then `npm run build` (thanks to the `build` script),
   then starts it with `npm run start` (from the `Procfile`) — no manual
   configuration needed.
3. Once it's deployed, go to the service's **Settings → Networking** tab
   and click **Generate Domain**. Railway doesn't expose a public URL by
   default the way Vercel does — this button is the one extra step.
4. You'll get a URL like `https://optic-hub-frontend-production.up.railway.app`
   — that's your Mini App's public address. Open it in a browser first to
   confirm it loads.

(If you'd rather use Vercel instead — sign in at vercel.com with GitHub,
Add New → Project, import this repo, click Deploy. It auto-detects Vite
and needs zero configuration, including the public URL. Either platform
works equally well; use whichever is less friction for you.)

## 3. Point your Telegram bot at it

You already have the bot token from BotFather. Two ways to open the Mini
App from Telegram, from simplest to more complete:

### Option A — Menu button (fastest, no bot code needed)

1. Open a chat with **@BotFather** in Telegram.
2. Send `/mybots` → select your bot.
3. **Bot Settings → Menu Button → Configure menu button**.
4. Send the Vercel URL from step 2 (must be `https://`).
5. Send a short button label, e.g. `Открыть OPTIC HUB`.

Now every user who opens a chat with your bot sees a menu button (bottom
left, next to the message box) that opens the Mini App directly.

### Option B — Registered Web App + /start button

For a nicer entry point (a button inside the chat itself, not just the
menu), send BotFather `/newapp`, pick your bot, and follow the prompts —
it will ask for the same URL plus a short description and an icon image.
This also makes the app discoverable from your bot's profile page.

Either way, no separate bot server has to run for the Mini App itself —
BotFather is just storing the URL it should open. You'd only need a
running bot process (Python/aiogram, same as Eles Cargo) if you want the
bot to also respond to text commands — not required just to open the app.

## 4. What's still local-only right now

The app currently keeps all its data in memory (products, sales, sellers) —
it resets every time it's reopened. The backend from `optic-hub-backend`
is ready and tested, but this frontend isn't wired to it yet. That's the
next pass: replacing the mock state with real requests to your deployed
Railway API, so data actually persists between sessions and between
different people opening the Mini App.
