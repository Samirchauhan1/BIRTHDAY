# Happy Birthday, Amisha 🌹

A small birthday website — built as a plain React app (no build step needed).

## Structure
- `index.html` — page shell, loads React/ReactDOM/Babel from `vendor/` and `app.js`
- `style.css` — all styling
- `app.js` — the React components (JSX, transformed in-browser by Babel)
- `vendor/` — local copies of React, ReactDOM, and Babel Standalone (so it works fully offline, no CDN dependency)
- `video.mp4`, `voicenote.mp3` — the personal media

## Running it
No build step, no npm install needed. Just open `index.html` in a browser,
or serve the folder with any static file server, e.g.:

```
npx serve .
```

or if hosting on GitHub Pages / Netlify / Vercel, just deploy this folder as-is —
`index.html` is the entry point.

## Notes
- Fonts (Fraunces, Karla, Special Elite, Caveat, Abril Fatface, Playfair Display) load from Google Fonts — an internet connection is needed for those, everything else works offline.
- Tested responsive from 320px (small mobile) up through 1440px (laptop/desktop).
