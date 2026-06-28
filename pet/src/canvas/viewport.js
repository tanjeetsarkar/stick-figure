export function getViewport() {
  return { w: window.innerWidth, h: window.innerHeight };
}

export function listenResize(callback) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}
