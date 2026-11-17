(function () {
  var KEY = 'krish-theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  function apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
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
