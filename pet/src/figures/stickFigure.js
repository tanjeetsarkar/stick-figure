export const LIMBS = [
  ['neck', 'head'],
  ['neck', 'hip'],
  ['neck', 'lshoulder'],
  ['neck', 'rshoulder'],
  ['lshoulder', 'rshoulder'],
  ['hip', 'lhip'],
  ['hip', 'rhip'],
  ['lhip', 'rhip'],
  ['lshoulder', 'lelbow'],
  ['lelbow', 'lhand'],
  ['rshoulder', 'relbow'],
  ['relbow', 'rhand'],
  ['lhip', 'lknee'],
  ['lknee', 'lfoot'],
  ['rhip', 'rknee'],
  ['rknee', 'rfoot'],
];

const BASE_JOINTS = {
  "head": { "x": 0, "y": -135 },
  "neck": { "x": 0, "y": -100 },
  "lshoulder": { "x": -45, "y": -70 },
  "rshoulder": { "x": 45, "y": -70 },
  "lelbow": { "x": -75, "y": -20 },
  "relbow": { "x": 75, "y": -20 },
  "lhand": { "x": -95, "y": 30 },
  "rhand": { "x": 95, "y": 30 },
  "hip": { "x": 0, "y": 0 },
  "lhip": { "x": -25, "y": 25 },
  "rhip": { "x": 25, "y": 25 },
  "lknee": { "x": -35, "y": 90 },
  "rknee": { "x": 35, "y": 90 },
  "lfoot": { "x": -45, "y": 155 },
  "rfoot": { "x": 45, "y": 155 }
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
    y: overrides.y ?? 260,
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
