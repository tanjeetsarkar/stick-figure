# Proposed Architecture

## Overview

A "desktop pet" system where small animated figures roam freely over any web page or a standalone white canvas. Built with Vite + React, using the Canvas 2D API for rendering and native browser APIs throughout. No animation libraries, no physics engines, no heavy state management packages.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Bundler | Vite | Fast dev server, first-class React support |
| UI shell | React | Component model for controls/HUD only |
| Rendering | Canvas 2D API | Full control, no library overhead |
| Motion | `requestAnimationFrame` + sine math | No animation library needed |
| Multiplayer (Phase 5) | Native WebSocket + `ws` (Node.js) | One justified third-party dependency |

---

## Core Principles

**Figure as pure data.** A figure is a plain JS object — joints, velocities, animation state. The canvas loop reads it and draws it. React never touches the canvas directly. This separation means a remote user's figure received over WebSocket is drawn exactly the same way as the local one.

**Single canvas, multiple figures.** One `<canvas>` element covers the viewport. The draw loop iterates over an array of figures (local + remote) and calls `drawFigure()` for each. Adding multiplayer does not change the rendering architecture.

**Pointer-events passthrough.** The canvas is `position: fixed`, full-viewport, `pointer-events: none`. Clicks pass through to whatever page is underneath. This is how the overlay works without breaking the host site.

**No animation library.** All motion is `sin(tick * speed) * amplitude`. Fully controllable, zero dependencies.

---

## Directory Structure

```
project-root/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Root component, mounts canvas + HUD
│   │
│   ├── canvas/
│   │   ├── loop.js           # requestAnimationFrame game loop
│   │   ├── renderer.js       # drawFigure(ctx, figure) — pure draw functions
│   │   └── viewport.js       # Viewport size, resize handling
│   │
│   ├── figures/
│   │   ├── stickFigure.js    # Default figure joint/limb definition
│   │   ├── figureState.js    # State machine: idle, walk, sit, etc.
│   │   └── animations.js     # Pose math — sin-based joint offsets per state
│   │
│   ├── behaviour/
│   │   ├── wander.js         # Autonomous movement, direction picking
│   │   └── boundaries.js     # Edge detection, turn logic
│   │
│   ├── network/              # Phase 5 only
│   │   ├── socket.js         # WebSocket client connection
│   │   └── sync.js           # Broadcast local state, receive remote figures
│   │
│   └── components/
│       └── HUD.jsx           # Optional controls overlay (spawn, pause, etc.)
│
└── server/                   # Phase 5 only
    └── index.js              # Node.js WebSocket server (ws package)
```

---

## Data Model

### Figure object

```js
{
  id: 'local',               // unique per user in multiplayer
  x: 340,                    // canvas x position (centre of mass)
  y: 400,                    // canvas y position (feet level)
  facing: 1,                 // 1 = right, -1 = left
  state: 'walk',             // 'idle' | 'walk' | 'sit' | 'wave'
  tick: 0,                   // frame counter, drives sine animations
  vx: 1.2,                   // current velocity x
  vy: 0,                     // current velocity y (for future jumping)
  color: '#334155',          // stroke color
  strokeWidth: 3,

  joints: {
    head:      { x: 0, y: -80 },   // relative to figure origin
    neck:      { x: 0, y: -52 },
    lShoulder: { x: -18, y: -42 },
    rShoulder: { x:  18, y: -42 },
    lElbow:    { x: -28, y: -18 },
    rElbow:    { x:  28, y: -18 },
    lHand:     { x: -32, y:   8 },
    rHand:     { x:  32, y:   8 },
    hip:       { x:   0, y:   0 },
    lKnee:     { x: -12, y:  28 },
    rKnee:     { x:  12, y:  28 },
    lFoot:     { x: -14, y:  58 },
    rFoot:     { x:  14, y:  58 },
  }
}
```

Joints are stored as offsets from the figure's origin (`x`, `y`). The renderer translates and scales them per draw call. Animation functions mutate the offsets each frame based on `tick` and `state`.

### Limb connections

```js
const LIMBS = [
  ['neck', 'head'],          // neck to head (head drawn as circle separately)
  ['neck', 'lShoulder'],
  ['neck', 'rShoulder'],
  ['lShoulder', 'lElbow'],
  ['lElbow', 'lHand'],
  ['rShoulder', 'rElbow'],
  ['rElbow', 'rHand'],
  ['neck', 'hip'],           // torso
  ['hip', 'lKnee'],
  ['lKnee', 'lFoot'],
  ['hip', 'rKnee'],
  ['rKnee', 'rFoot'],
];
```

---

## Rendering Pipeline

```
requestAnimationFrame loop
  │
  ├── update(figures, delta)
  │     ├── advance tick
  │     ├── apply behaviour (wander, boundary check)
  │     ├── update state machine
  │     └── apply animation offsets to joints
  │
  └── draw(ctx, figures)
        ├── ctx.clearRect(0, 0, w, h)
        └── for each figure:
              drawFigure(ctx, figure)
                ├── translate to figure.x, figure.y
                ├── scale by figure.facing
                ├── draw limbs (lines between joint pairs)
                └── draw head (circle at head joint)
```

---

## Animation System

All poses are procedural — no keyframe data files. Each animation function receives the figure's `tick` and returns joint offset deltas:

```js
// Example: walk cycle
function walkOffsets(tick) {
  const t = tick * 0.08;
  return {
    lKnee:  { y: Math.sin(t)       * 12 },
    rKnee:  { y: Math.sin(t + Math.PI) * 12 },
    lFoot:  { y: Math.sin(t)       * 18 },
    rFoot:  { y: Math.sin(t + Math.PI) * 18 },
    lElbow: { x: Math.sin(t + Math.PI) * 8 },
    rElbow: { x: Math.sin(t)       * 8 },
  };
}
```

The base joint positions plus animation offsets produce the final drawn pose each frame.

---

## Behaviour System

The wander behaviour runs as a simple state machine independent of the animation state:

```
WANDERING → picks target direction → walks toward it
         → on reaching boundary   → picks new direction (turns around)
         → randomly               → pauses (idle for N frames) → resumes
```

In Phase 3, the figure walks along the bottom of the viewport as if the screen edge is a floor. In Phase 4 (overlay mode), the "floor" becomes the bottom of the browser window, and the figure walks over the host page's content.

---

## Overlay Mode (Phase 4)

The canvas element CSS:

```css
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;   /* clicks pass through */
  z-index: 9999;
}
```

The React app is mounted into a `<div>` injected into `document.body`. In standalone mode this is just `index.html`. In extension mode (Phase 6+), a content script does the injection.

---

## Multiplayer Architecture (Phase 5)

### Server

A minimal Node.js WebSocket server. No framework. Clients connect, broadcast their figure state as JSON, and the server fans it out to all other connected clients.

```
Client A ──position update──▶ Server ──▶ Client B
                                     ──▶ Client C
```

No authoritative simulation on the server. Each client owns its own figure; others are rendered as read-only ghosts.

### Message format

```json
{
  "type": "state",
  "id": "abc123",
  "x": 340,
  "y": 400,
  "facing": 1,
  "state": "walk",
  "tick": 1042,
  "color": "#334155"
}
```

The receiving client upserts this into its figures array and renders it on the next frame. Joint positions are not transmitted — the receiver re-runs the same animation functions locally using the received `tick` and `state`, keeping bandwidth low.

---

## What Stays Out (by design)

- No Redux, Zustand, or any state management library — figure state lives in a plain mutable ref
- No Three.js, Pixi.js, or canvas frameworks — raw Canvas 2D API only
- No CSS animations for the figures — canvas only
- No physics engine — velocity and boundary math is bespoke and simple
- No WebRTC — WebSocket broadcast is sufficient for this use case