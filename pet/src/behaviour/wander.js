import { checkBoundaries } from './boundaries.js';

const WALK_SPEED_MIN = 0.8;
const WALK_SPEED_MAX = 2.2;
const WANDER_TIMER_MIN = 120; // frames
const WANDER_TIMER_MAX = 300;
const PAUSE_TIMER_MIN = 60;
const PAUSE_TIMER_MAX = 180;
const PAUSE_CHANCE = 0.002; // per frame while walking

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Drives autonomous wander behaviour each frame.
 * Mutates figure position, velocity, state, and facing.
 */
export function updateWander(figure, viewport) {
  // Initialise wander timer on first call
  if (figure.wanderTimer <= 0) {
    pickNewDirection(figure);
  }

  if (figure.pauseTimer > 0) {
    // Paused — count down, stay idle
    figure.pauseTimer -= 1;
    figure.state = 'idle';
    figure.vx = 0;
    if (figure.pauseTimer <= 0) {
      pickNewDirection(figure);
    }
  } else {
    // Walking
    figure.state = 'walk';
    figure.wanderTimer -= 1;

    // Randomly pause
    if (Math.random() < PAUSE_CHANCE) {
      figure.pauseTimer = Math.round(randomBetween(PAUSE_TIMER_MIN, PAUSE_TIMER_MAX));
      figure.vx = 0;
    }

    // Pick new direction when wander timer expires
    if (figure.wanderTimer <= 0) {
      pickNewDirection(figure);
    }

    figure.x += figure.vx;
  }

  checkBoundaries(figure, viewport);
}

function pickNewDirection(figure) {
  const speed = randomBetween(WALK_SPEED_MIN, WALK_SPEED_MAX);
  const dir = Math.random() < 0.5 ? 1 : -1;
  figure.vx = speed * dir;
  figure.facing = dir;
  figure.wanderTimer = Math.round(randomBetween(WANDER_TIMER_MIN, WANDER_TIMER_MAX));
}
