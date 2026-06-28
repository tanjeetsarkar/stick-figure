export const LIMBS = [
  ['neck', 'head'],
  ['neck', 'lShoulder'],
  ['neck', 'rShoulder'],
  ['lShoulder', 'lElbow'],
  ['lElbow', 'lHand'],
  ['rShoulder', 'rElbow'],
  ['rElbow', 'rHand'],
  ['neck', 'hip'],
  ['hip', 'lKnee'],
  ['lKnee', 'lFoot'],
  ['hip', 'rKnee'],
  ['rKnee', 'rFoot'],
];

const BASE_JOINTS = {
  head:      { x:   0, y: -70 },
  neck:      { x:   0, y: -52 },
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
};

let nextId = 1;

export function createFigure(overrides = {}) {
  // Deep-copy joints so each figure has its own mutable joint objects
  const baseJoints = {};
  const joints = {};
  for (const [name, pos] of Object.entries(BASE_JOINTS)) {
    baseJoints[name] = { ...pos };
    joints[name] = { ...pos };
  }

  return {
    id: `figure-${nextId++}`,
    x: overrides.x ?? 300,
    y: overrides.y ?? 400,
    facing: overrides.facing ?? 1,
    state: overrides.state ?? 'idle',
    tick: 0,
    vx: 0,
    vy: 0,
    wanderTimer: 0,
    pauseTimer: 0,
    color: overrides.color ?? '#334155',
    strokeWidth: overrides.strokeWidth ?? 3,
    baseJoints,
    joints,
    ...overrides,
    // Don't let overrides stomp joints — always use the deep copies above
    baseJoints,
    joints,
  };
}
