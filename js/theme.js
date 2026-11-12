(function () {
  var m = window.matchMedia('(prefers-color-scheme: dark)');
  function set() { document.documentElement.setAttribute('data-theme', m.matches ? 'dark' : 'light'); }
  set();
  m.addEventListener('change', set);
})();
