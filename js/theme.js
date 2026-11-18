(function () {
  var KEY = 'krish-theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  var COLORS = { light: '#f2f2f7', dark: '#0b0c10' };
  document.documentElement.classList.add('js');

  function apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', COLORS[mode]);
  }

  if (saved === 'light' || saved === 'dark') {
    apply(saved);
  } else {
    var m = window.matchMedia('(prefers-color-scheme: dark)');
    apply(m.matches ? 'dark' : 'light');
    m.addEventListener('change', function () {
      var current = null;
      try { current = localStorage.getItem(KEY); } catch (e) {}
      if (!current) apply(m.matches ? 'dark' : 'light');
    });
  }

  window.krishToggleTheme = function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  };
})();
