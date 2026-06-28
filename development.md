# Development Guide

## Project structure

```
stick-figure/
├── pet/          Standalone Vite + React app (phases 1–5)
└── extension/    Chrome / Firefox extension (phase 6)
```

---

## Standalone app (`pet/`)

### Run in development

```bash
cd pet
npm install        # first time only
npm run dev
```

Open the URL printed by Vite (default: http://localhost:5173).  
Hot module reload is active — changes to any source file apply instantly.

### Build for production

```bash
cd pet
npm run build
```

Output goes to `pet/dist/`.  
Preview the production build locally:

```bash
npm run preview
```

---

## Chrome extension (`extension/`)

### Build

```bash
cd extension
npm install        # first time only
npm run build
```

Output goes to `extension/dist/`. This must be re-run after every source change.

### Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle, top-right)
3. Click **Load unpacked**
4. Select the `extension/dist/` folder
5. The extension appears in the toolbar — click its icon to open the popup

### Reload after a code change

1. Run `npm run build` again inside `extension/`
2. Go to `chrome://extensions`
3. Click the **↺ reload** button on the Stick Figure Pet card
4. Refresh any tab where you want to see the updated content script

### Uninstall

Click **Remove** on the extension card in `chrome://extensions`.

---

## Firefox extension (`extension/`)

The same `extension/dist/` build works for Firefox — no separate build step needed.

### Load as a temporary add-on

1. Open `about:debugging`
2. Click **This Firefox** in the left sidebar
3. Click **Load Temporary Add-on…**
4. Navigate to `extension/dist/` and select `manifest.json`
5. The extension is now active for this browser session

> **Note:** Temporary add-ons are removed when Firefox closes. You must reload after every restart.

### Reload after a code change

1. Run `npm run build` again inside `extension/`
2. Go to `about:debugging` → **This Firefox**
3. Click **Reload** next to Stick Figure Pet

### Install permanently (self-distributed)

Firefox requires extensions to be signed by Mozilla for permanent installation unless you use Firefox Developer Edition or Nightly with `xpinstall.signatures.required` set to `false` in `about:config`.

For development, the temporary add-on workflow above is sufficient.

---

## How the extension and the standalone app share code

The content script (`extension/src/content.js`) imports the figure logic directly from the `pet/` package using relative paths:

```
pet/src/figures/stickFigure.js   createFigure()
pet/src/canvas/loop.js           startLoop()
pet/src/canvas/renderer.js       drawFigure()        (via loop)
pet/src/behaviour/wander.js      updateWander()      (via loop)
pet/src/behaviour/boundaries.js  checkBoundaries()   (via loop)
```

Vite bundles all of these into `dist/content.js` at build time — the extension carries no runtime dependency on the `pet/` folder.

### When you change shared logic

If you edit anything in `pet/src/figures/`, `pet/src/canvas/`, or `pet/src/behaviour/`:

- The **standalone app** picks it up automatically via HMR (no action needed while `npm run dev` is running).
- The **extension** requires a manual rebuild: `cd extension && npm run build`, then reload the extension in the browser.

---

## Extension settings

User preferences are stored in `chrome.storage.sync` and survive page navigation and browser restarts.

| Key | Default | Description |
|---|---|---|
| `enabled` | `true` | Whether the figure is active on all pages |
| `color` | `#334155` | Figure stroke colour |
| `scale` | `0.5` | Figure size multiplier |
| `stroke` | `3` | Stroke width multiplier |

Changes made in the popup take effect on the active tab immediately — no reload required.

---

## Build scripts reference

| Command | What it does |
|---|---|
| `cd pet && npm run dev` | Start standalone dev server with HMR |
| `cd pet && npm run build` | Production build of the standalone app |
| `cd extension && npm run build` | Full extension build (content script + popup + manifest) |
| `cd extension && npm run build:content` | Rebuild content script only |
| `cd extension && npm run build:popup` | Rebuild popup only |
