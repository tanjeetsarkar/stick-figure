export const FLOOR_OFFSET = 10; // px from bottom of viewport

/**
 * Keeps figure on the floor and reverses direction at left/right edges.
 */
export function checkBoundaries(figure, viewport) {
  // Pin to floor
  figure.y = viewport.h - FLOOR_OFFSET;

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
