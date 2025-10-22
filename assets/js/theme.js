// Minimal, robust theme toggle for a static site.
//
// - respects saved user choice (localStorage)
// - otherwise follows system preference (prefers-color-scheme)
// - toggles by setting html[data-theme="light"|"dark"]
// - updates button icon to reflect current state

(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const storageKey = 'theme'; // 'light' or 'dark'

  // determine initial theme
  const saved = localStorage.getItem(storageKey);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // initial apply
  const initial = saved || (systemPrefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
  updateButton(initial);

  // toggle handler
  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(storageKey, next);
    updateButton(next);
  });

  // Update button text/icon (simple)
  function updateButton(theme) {
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-pressed', theme === 'dark');
  }

  // Optional: If user hasn't chosen and system changes, follow the system change
  // only when localStorage has no explicit value.
  if (!saved && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem(storageKey)) return; // user override exists
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateButton(e.matches ? 'dark' : 'light');
    });
  }
})();
