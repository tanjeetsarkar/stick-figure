# Roadmap

## Project: Desktop Pet Figure System

Figures that roam freely over any web page or standalone canvas. Built in strict phases — no phase begins until the previous one is complete and stable.

---

## Phase 1 — Canvas Foundation

**Goal:** A working render loop with a static stick figure on screen.

**Deliverables:**
- Vite + React project scaffolded
- Full-viewport `<canvas>` element mounted by React
- `requestAnimationFrame` loop running continuously
- `drawFigure(ctx, figure)` renders a static stick figure using Canvas 2D API
- Figure visible on a white background at a fixed position

**Constraints:**
- No movement yet
- No animation yet
- Canvas is the only renderer — no SVG, no DOM figure elements

**Done when:** A stick figure appears on screen and the loop runs at 60fps without errors.

---

## Phase 2 — Figure Model & Animation

**Goal:** A proper data model for the figure and basic procedural animations.

**Deliverables:**
- Joint-based figure data structure (named joints with x/y offsets from origin)
- Limb connection list driving the renderer
- `idle` animation: subtle breathing bob using sine on the torso
- `walk` animation: leg and arm swing cycle using sine, keyed to `tick`
- State machine switching between `idle` and `walk`
- Figure can be manually toggled between states for testing

**Constraints:**
- All motion is pure math — `sin(tick * speed) * amplitude`
- No animation library
- Figure does not move position yet — animation only affects joint offsets

**Done when:** The figure visibly idles and walks in place, limbs moving naturally.

---

## Phase 3 — Autonomous Roaming

**Goal:** The figure moves around the canvas on its own.

**Deliverables:**
- Velocity vector on the figure (`vx`, `vy`)
- Wander behaviour: picks a random direction, walks toward it, then picks a new one
- Boundary detection: figure stops at canvas edges and turns around
- `facing` direction flips the figure horizontally on direction change
- Idle pause: figure randomly stops for a few seconds before resuming
- Figure walks "on the floor" — constrained to the bottom edge of the canvas

**Constraints:**
- No pathfinding, no physics engine
- Boundary math is bespoke — a few lines of arithmetic

**Done when:** The figure wanders back and forth across the canvas indefinitely without escaping the viewport.

---

## Phase 4 — Overlay System

**Goal:** The figure runs on top of any web page without interfering with it.

**Deliverables:**
- Canvas set to `position: fixed`, full viewport, `z-index: 9999`, `pointer-events: none`
- Clicks and scrolls pass through to the page underneath
- Figure walks along the bottom of the browser window (viewport floor)
- App works deployed to a static host (Vercel, Netlify, or similar)
- Optional: minimal HUD (spawn button, pause toggle) that is itself pointer-events-enabled

**Constraints:**
- Host page must not be affected in any way
- No iframe — the canvas is injected directly

**Done when:** The standalone app can be opened alongside any website (e.g. in a split view or as the active tab) and the figure roams over it without breaking anything.

---

## Phase 5 — Multiplayer

**Goal:** Multiple users on the same page see each other's figures.

**Deliverables:**
- Minimal Node.js WebSocket server using the `ws` package
- Client connects on load, receives a unique session ID
- Client broadcasts figure position, state, and tick on each frame (throttled to ~20/s)
- Remote figures appear on the local canvas as additional figures
- Remote figures are rendered identically to the local one — same `drawFigure()` function
- Remote figures removed when their connection drops

**Message format:**
```json
{ "type": "state", "id": "abc123", "x": 340, "y": 400, "facing": 1, "state": "walk", "tick": 1042, "color": "#334155" }
```

**Architecture note:** The server is a dumb broadcast relay. No authoritative simulation. Each client owns its own figure; others are rendered as read-only ghosts. Joint positions are not transmitted — the receiver re-runs animation math locally using received `tick` and `state`.

**Constraints:**
- One third-party package allowed: `ws` (Node.js WebSocket)
- No game server framework
- No conflict resolution needed at this stage

**Done when:** Two browser tabs open to the same URL show both figures roaming independently, with each visible to the other in real time.

---

## Phase 6 — Chrome Extension

**Goal:** The figure runs on top of any website the user visits, not just the standalone app.

**Deliverables:**
- Vite build configured to output a Chrome extension manifest v3 bundle
- Content script injects the canvas into `document.body` on any tab
- Popup UI for enable/disable toggle and colour picker
- Figure persists across page navigations (content script re-injects on navigation)
- Connects to the Phase 5 WebSocket server for cross-tab multiplayer

**Constraints:**
- Content Security Policy on host pages may block inline scripts — canvas injection must be CSP-safe
- Must not break pages that use `pointer-events` or `z-index` heavily

**Done when:** Installing the unpacked extension and navigating to any website shows the figure roaming over it.

---

## Phase 7 — Embeddable Script Tag

**Goal:** Any website can add the figure by including a single `<script>` tag.

**Deliverables:**
- Self-contained IIFE bundle output from Vite
- Script injects canvas on `DOMContentLoaded`
- Config via `data-` attributes on the script tag (colour, count, server URL)
- Documentation for embedding

```html
<script src="https://yourcdn.com/figure.js" data-color="#334155" data-count="1"></script>
```

**Done when:** Dropping the script tag into a plain HTML file produces a roaming figure with no other setup.

---

## Phase 8 — Custom Figures

**Goal:** Users can bring their own figures.

**Scope (to be designed):**
- Figure definition format (JSON schema for joints + limb connections + animation hints)
- Upload UI in the HUD
- Renderer handles arbitrary joint/limb topologies
- Validation so malformed figures don't crash the loop

**Done when:** A user can define a custom figure (e.g. a spider, a robot) in the figure format and see it roam the canvas.

---

## Decisions deferred until later

| Decision | Deferred to |
|---|---|
| Sound effects | Phase 3+ (optional) |
| Figure–figure collision / interaction | Phase 5 |
| Mobile / touch support | Phase 4 |
| Figure customisation UI | Phase 7–8 |
| Persistence (remember figure colour across sessions) | Phase 6 (localStorage in extension) |
| Safari / Firefox extension | Phase 6+ |