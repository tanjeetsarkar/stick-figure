export const FLOOR_OFFSET = 10; // px from bottom of viewport
const STEP_FOOT_DROP = 4; // max downward foot offset from walk animation

function getFigureBottomOffset(figure) {
  const joints = figure.baseJoints ?? {};
  let maxY = 0;
  for (const joint of Object.values(joints)) {
    if (typeof joint?.y === 'number' && joint.y > maxY) {
      maxY = joint.y;
    }
  }
  return maxY + STEP_FOOT_DROP;
}

/**
 * Keeps figure on the floor and reverses direction at left/right edges.
 */
export function checkBoundaries(figure, viewport) {
  // Pin the lowest body point (feet), not the hip, to the floor.
  figure.y = viewport.h - FLOOR_OFFSET - getFigureBottomOffset(figure);

  // Left edge
  if (figure.x <= 0) {
    figure.x = 0;
    figure.vx = Math.abs(figure.vx);
    figure.facing = 1;
  }

  // Right edge
  if (figure.x >= viewport.w) {
    figure.x = viewport.w;
    figure.vx = -Math.abs(figure.vx);
    figure.facing = -1;
  }
}
