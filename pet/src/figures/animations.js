/**
 * Returns joint offset deltas for the idle (breathing) animation.
 * Only mutates joints that need to move.
 */
export function idleOffsets(tick) {
  const t = tick * 0.04;
  const bob = Math.sin(t) * 2;
  return {
    head:      { x: 0, y: bob },
    neck:      { x: 0, y: bob },
    lShoulder: { x: 0, y: bob },
    rShoulder: { x: 0, y: bob },
    lElbow:    { x: 0, y: bob },
    rElbow:    { x: 0, y: bob },
    lHand:     { x: 0, y: bob },
    rHand:     { x: 0, y: bob },
  };
}

/**
 * Returns joint offset deltas for the walk cycle animation.
 */
export function walkOffsets(tick) {
  const t = tick * 0.08;
  return {
    lKnee:  { x: 0, y: Math.sin(t)           * 12 },
    rKnee:  { x: 0, y: Math.sin(t + Math.PI) * 12 },
    lFoot:  { x: 0, y: Math.sin(t)           * 18 },
    rFoot:  { x: 0, y: Math.sin(t + Math.PI) * 18 },
    lElbow: { x: Math.sin(t + Math.PI) * 8,  y: 0 },
    rElbow: { x: Math.sin(t)           * 8,  y: 0 },
    lHand:  { x: Math.sin(t + Math.PI) * 10, y: 0 },
    rHand:  { x: Math.sin(t)           * 10, y: 0 },
  };
}
