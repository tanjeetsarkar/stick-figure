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
    lshoulder:  { x: 0, y: bob },
    rshoulder:  { x: 0, y: bob },
    lelbow:     { x: 0, y: bob },
    relbow:     { x: 0, y: bob },
    lhand:      { x: 0, y: bob },
    rhand:      { x: 0, y: bob },
  };
}

/**
 * Returns joint offset deltas for the walk cycle animation.
 */
export function walkOffsets(tick) {
  const t = tick * 0.12;
  const leftStep = Math.sin(t);
  const rightStep = Math.sin(t + Math.PI);
  const bodyBob = Math.sin(t * 2) * 1.5;
  const leftLift = Math.max(0, leftStep);
  const rightLift = Math.max(0, rightStep);
  return {
    head:      { x: 0, y: bodyBob },
    neck:      { x: 0, y: bodyBob },
    lshoulder: { x: rightStep * 4, y: bodyBob },
    rshoulder: { x: leftStep * 4, y: bodyBob },
    lhip:      { x: leftStep * 2, y: 0 },
    rhip:      { x: rightStep * 2, y: 0 },
    lelbow:    { x: rightStep * 8, y: 0 },
    relbow:    { x: leftStep * 8, y: 0 },
    lhand:     { x: rightStep * 10, y: 0 },
    rhand:     { x: leftStep * 10, y: 0 },
    lknee:     { x: leftStep * 10, y: -leftLift * 14 },
    rknee:     { x: rightStep * 10, y: -rightLift * 14 },
    lfoot:     { x: leftStep * 12, y: leftLift * 6 - 2 },
    rfoot:     { x: rightStep * 12, y: rightLift * 6 - 2 },
  };
}
