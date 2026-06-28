import { LIMBS } from '../figures/stickFigure.js';

const HEAD_RADIUS = 12;

export function drawFigure(ctx, figure) {
  const { x, y, facing, joints, color, strokeWidth } = figure;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw limbs
  for (const [a, b] of LIMBS) {
    // Skip head — drawn as circle separately
    if (a === 'neck' && b === 'head') continue;
    const ja = joints[a];
    const jb = joints[b];
    if (!ja || !jb) continue;

    ctx.beginPath();
    ctx.moveTo(ja.x, ja.y);
    ctx.lineTo(jb.x, jb.y);
    ctx.stroke();
  }

  // Draw head as circle
  const head = joints.head;
  if (head) {
    ctx.beginPath();
    ctx.arc(head.x, head.y, HEAD_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}
