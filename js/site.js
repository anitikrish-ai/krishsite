/* Renders socials + projects from js/config.js, and wires the theme toggle. */
(function () {
  var ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55v-2.15c-3.17.69-3.84-1.36-3.84-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.05-.12-.29-.5-1.46.11-3.04 0 0 .96-.31 3.15 1.16a10.9 10.9 0 0 1 5.74 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.58.23 2.75.11 3.04.73.79 1.17 1.81 1.17 3.05 0 4.37-2.67 5.33-5.21 5.62.41.36.77 1.07.77 2.15v3.19c0 .3.2.66.79.55 4.52-1.5 7.77-5.76 7.77-10.78C23.02 5.24 18.27.5 12 .5Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2s-.21-1.5-.86-2.16c-.82-.86-1.74-.87-2.16-.92C15.6 4 12 4 12 4h-.01s-3.6 0-6.58.12c-.42.05-1.34.06-2.16.92C2.6 5.7 2.4 7.2 2.4 7.2S2.18 9 2.18 10.73v1.54c0 1.73.22 3.53.22 3.53s.2 1.5.85 2.16c.82.86 1.9.83 2.38.92 1.73.17 7.37.22 7.37.22s3.6-.01 6.58-.13c.42-.05 1.34-.06 2.16-.92.65-.66.86-2.16.86-2.16s.22-1.8.22-3.53v-1.54c0-1.73-.22-3.53-.22-3.53ZM9.95 14.63V8.9l5.5 2.87-5.5 2.86Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.2 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.98c-3.14 0-3.5.01-4.73.07-.96.04-1.48.2-1.82.34-.46.18-.78.39-1.13.74-.34.34-.56.67-.73 1.13-.14.34-.3.86-.35 1.82-.06 1.23-.07 1.59-.07 4.72s.01 3.5.07 4.73c.04.96.2 1.48.35 1.82.17.46.39.78.73 1.13.35.34.67.56 1.13.73.34.14.86.3 1.82.35 1.23.06 1.59.07 4.73.07s3.5-.01 4.72-.07c.96-.04 1.48-.2 1.82-.35.46-.17.79-.39 1.13-.73.34-.35.56-.67.73-1.13.14-.34.3-.86.35-1.82.06-1.23.07-1.59.07-4.73s-.01-3.5-.07-4.72c-.04-.96-.2-1.48-.35-1.82a3.05 3.05 0 0 0-.73-1.13 3.05 3.05 0 0 0-1.13-.73c-.34-.14-.86-.3-1.82-.35-1.23-.06-1.59-.07-4.72-.07ZM12 7.27A4.73 4.73 0 1 1 12 16.73 4.73 4.73 0 0 1 12 7.27Zm0 1.98a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5Zm5.15-2.19a1.11 1.11 0 1 1 0 2.22 1.11 1.11 0 0 1 0-2.22Z"/></svg>',
    pinterest: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.64 19.3c-.05-.78-.1-1.98.02-2.83.11-.77.73-3.9.73-3.9s-.19-.37-.19-.92c0-.86.5-1.5 1.12-1.5.53 0 .78.4.78.87 0 .53-.34 1.33-.51 2.07-.15.62.31 1.12.92 1.12 1.1 0 1.95-1.17 1.95-2.85 0-1.49-1.07-2.53-2.6-2.53-1.77 0-2.81 1.33-2.81 2.7 0 .53.2 1.11.46 1.42a.19.19 0 0 1 .04.18c-.05.2-.16.63-.18.72-.03.11-.1.14-.22.08-.84-.39-1.36-1.6-1.36-2.58 0-2.1 1.53-4.03 4.4-4.03 2.31 0 4.1 1.65 4.1 3.85 0 2.3-1.45 4.15-3.46 4.15-.68 0-1.32-.35-1.53-.77l-.42 1.59c-.15.58-.56 1.3-.84 1.75A10 10 0 1 0 12 2Z"/></svg>'
  };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function renderSocials() {
    document.querySelectorAll('[data-render="socials"]').forEach(function (el) {
      var limit = parseInt(el.getAttribute('data-limit') || '0', 10);
      var list = window.SITE.socials.slice();
      if (limit) list = list.slice(0, limit);
      el.innerHTML = list.map(function (s) {
        var icon = ICONS[s.platform] || '';
        return (
          '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" class="row">' +
            '<span class="social-icon" aria-hidden="true">' + icon + '</span>' +
            '<span class="row-main">' +
              '<span class="row-title">' + esc(s.name) + '<span class="handle">' + esc(s.handle) + '</span></span>' +
              '<span class="row-note">' + esc(s.note) + '</span>' +
            '</span>' +
            '<span class="chip">' + esc(s.tag) + '</span>' +
            '<span class="row-go" aria-hidden="true">↗</span>' +
            '<span class="sr-only"> (opens in a new tab)</span>' +
          '</a></li>'
        );
      }).join('');
    });
  }

  var STATUS_LABEL = { live: 'Working project', development: 'In development', collaborative: 'Collaborative project' };

  function renderProjects() {
    document.querySelectorAll('[data-render="projects"]').forEach(function (el) {
      var filter = el.getAttribute('data-filter'); // e.g. "live,collaborative"
      var limit = parseInt(el.getAttribute('data-limit') || '0', 10);
      var list = window.SITE.projects.slice();
      if (filter) {
        var allow = filter.split(',');
        list = list.filter(function (p) { return allow.indexOf(p.status) !== -1; });
      }
      if (limit) list = list.slice(0, limit);
      el.innerHTML = list.map(function (p) {
        var links = p.links.map(function (l) {
          return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer" class="btn">' + esc(l.label) + ' <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>';
        }).join('');
        return (
          '<div class="card">' +
            '<p class="meta">' + esc(p.category) + ' · ' + esc(STATUS_LABEL[p.status] || '') + '</p>' +
            '<h3>' + esc(p.name) + '</h3>' +
            '<p>' + esc(p.desc) + '</p>' +
            '<div class="card-foot">' + links + '</div>' +
          '</div>'
        );
      }).join('');
    });
  }

  function wireThemeToggle() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window.krishToggleTheme) window.krishToggleTheme();
      });
    });
  }

  function renderYear() {
    var el = document.getElementById('y');
    if (el && window.SITE) el.textContent = window.SITE.identity.year;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.SITE) { renderSocials(); renderProjects(); renderYear(); }
    wireThemeToggle();
  });
})();
