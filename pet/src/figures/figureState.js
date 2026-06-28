import { idleOffsets, walkOffsets } from './animations.js';

const ANIM_MAP = {
  idle: idleOffsets,
  walk: walkOffsets,
};

/**
 * Advances the figure's tick, resets joints from baseJoints,
 * then applies the animation offsets for the current state.
 */
export function updateFigureState(figure) {
  figure.tick += 1;

  // Reset joints to base pose each frame to prevent drift
  for (const name of Object.keys(figure.baseJoints)) {
    figure.joints[name].x = figure.baseJoints[name].x;
    figure.joints[name].y = figure.baseJoints[name].y;
  }

  const animFn = ANIM_MAP[figure.state] ?? idleOffsets;
  const offsets = animFn(figure.tick);

  for (const [name, delta] of Object.entries(offsets)) {
    if (!figure.joints[name]) continue;
    figure.joints[name].x += delta.x ?? 0;
    figure.joints[name].y += delta.y ?? 0;
  }
}
