# Final-Main — Original Framer Export

Serves the preserved Framer export locally so it renders exactly as the original page.

## Layout

- `site/index.html` — the original exported page with absolute URLs rewritten to local paths.
- `site/framerusercontent.com/`, `site/fonts.gstatic.com/`, `site/unpkg.com/`, `site/app.framerstatic.com/`, `site/framer.com/`, `site/events.framer.com/`, `site/ga.jspm.io/` — captured resource mirrors.
- `server.mjs` — small Node static server. Strips query strings, sets the correct MIME (including AVIF), and only serves files inside `site/`.

## Run

```bash
npm run dev
```

Then open http://127.0.0.1:3000 to view the exported page.
