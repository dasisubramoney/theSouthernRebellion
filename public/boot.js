// Runs before first paint. Sets data-motion, which switches on the CSS-only motion
// (the hero fan, the reveal transitions) without a flash. Same logic as
// src/lib/motion.tsx. If this fails, the page stays in its reduced, fully visible state.
(function () {
  try {
    var root = document.documentElement;
    var stored = null;
    try {
      stored = window.localStorage.getItem('tsr-motion');
    } catch (e) {}
    var systemReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var full = stored === 'full' || (stored !== 'reduced' && !systemReduced);
    root.setAttribute('data-motion', full ? 'full' : 'reduced');
  } catch (e) {}
})();
