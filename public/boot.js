// Runs before first paint, so nothing flashes in the wrong state.
// - data-theme: dark unless the visitor chose light (src/lib/theme.ts). The system
//   light/dark setting is deliberately ignored: the site defaults to dark.
// - data-motion: switches on the CSS-only motion (the hero fan, the reveal transitions).
//   Same logic as src/lib/motion.tsx.
// If this fails, the page stays dark and in its reduced, fully visible state.
(function () {
  var root = document.documentElement;
  var read = function (key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  };
  try {
    var theme = read('tsr-theme') === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F5F3EE' : '#0B0B0B');
  } catch (e) {}
  try {
    var stored = read('tsr-motion');
    var systemReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var full = stored === 'full' || (stored !== 'reduced' && !systemReduced);
    root.setAttribute('data-motion', full ? 'full' : 'reduced');
  } catch (e) {}
})();
