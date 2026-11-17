/* Art gallery engine — reads window.GALLERY (js/gallery-data.js). */
(function () {
  'use strict';

  var DATA = window.GALLERY || { collections: [], items: [] };
  var ITEMS = DATA.items.slice();
  var BUILTIN_COLLECTIONS = DATA.collections.slice();

  var LS_FAV = 'krish-gallery-favorites';
  var LS_CUSTOM = 'krish-gallery-custom-collections';

  function lsGet(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var favorites = new Set(lsGet(LS_FAV, []));
  var customCollections = lsGet(LS_CUSTOM, []); // [{id,name,itemIds:[]}]

  function saveFavorites() { lsSet(LS_FAV, Array.from(favorites)); }
  function saveCustom() { lsSet(LS_CUSTOM, customCollections); }

  // ---------------------------------------------------------------- state
  var state = {
    mode: 'library',       // 'library' | 'collections'
    scopeId: 'all',        // 'all' | 'favorites' | collection id | custom id
    dateScope: 'all',      // 'all' | 'years' | 'months'
    search: '',
    selecting: false,
    selected: new Set()
  };

  // ---------------------------------------------------------------- dom
  var root = document.getElementById('gallery-root');
  if (!root) return;

  var els = {
    page: document.querySelector('.gallery-page'),
    segLibrary: document.getElementById('seg-library'),
    segCollections: document.getElementById('seg-collections'),
    title: document.getElementById('g-title'),
    count: document.getElementById('g-count'),
    backBtn: document.getElementById('g-back-btn'),
    search: document.getElementById('g-search-input'),
    selectBtn: document.getElementById('g-select-btn'),
    body: document.getElementById('g-body'),
    bottomBar: document.getElementById('g-bottom-bar'),
    bulkBar: document.getElementById('g-bulk-bar'),
    bulkCount: document.getElementById('g-bulk-count'),
    bulkFav: document.getElementById('g-bulk-fav'),
    bulkAdd: document.getElementById('g-bulk-add'),
    bulkCancel: document.getElementById('g-bulk-cancel'),
    viewer: document.getElementById('g-viewer'),
    viewerImg: document.getElementById('g-viewer-img'),
    viewerClose: document.getElementById('g-viewer-close'),
    viewerFav: document.getElementById('g-viewer-fav'),
    viewerPrev: document.getElementById('g-viewer-prev'),
    viewerNext: document.getElementById('g-viewer-next'),
    viewerTitle: document.getElementById('g-viewer-title'),
    viewerSub: document.getElementById('g-viewer-sub'),
    viewerDesc: document.getElementById('g-viewer-desc')
  };

  function esc(s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---------------------------------------------------------------- data helpers
  function allCollections() {
    return BUILTIN_COLLECTIONS.concat(customCollections.map(function (c) { return { id: c.id, name: c.name, custom: true }; }));
  }
  function collectionById(id) {
    return allCollections().filter(function (c) { return c.id === id; })[0];
  }
  function itemsInScope(scopeId) {
    if (scopeId === 'all') return ITEMS.slice();
    if (scopeId === 'favorites') return ITEMS.filter(function (i) { return favorites.has(i.id); });
    var custom = customCollections.filter(function (c) { return c.id === scopeId; })[0];
    if (custom) return ITEMS.filter(function (i) { return custom.itemIds.indexOf(i.id) !== -1; });
    return ITEMS.filter(function (i) { return i.collection === scopeId; });
  }
  function matchesSearch(item, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var coll = collectionById(item.collection);
    var hay = [item.title, item.description, item.medium, coll && coll.name].filter(Boolean).join(' ').toLowerCase();
    return hay.indexOf(q) !== -1;
  }
  function currentList() {
    return itemsInScope(state.scopeId)
      .filter(function (i) { return matchesSearch(i, state.search); })
      .slice()
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  }
  function labelForScope(scopeId) {
    if (scopeId === 'all') return 'Library';
    if (scopeId === 'favorites') return 'Favorites';
    var c = collectionById(scopeId);
    return c ? c.name : 'Library';
  }

  // ---------------------------------------------------------------- grouping
  function groupLabel(dateStr, scope) {
    if (!dateStr) return 'Undated';
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return 'Undated';
    if (scope === 'years') return String(d.getFullYear());
    return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }
  function groupItems(list) {
    if (state.dateScope === 'all') return [{ label: null, items: list }];
    var map = {}; var order = [];
    list.forEach(function (item) {
      var label = groupLabel(item.date, state.dateScope);
      if (!map[label]) { map[label] = []; order.push(label); }
      map[label].push(item);
    });
    return order.map(function (label) { return { label: label, items: map[label] }; });
  }

  // ---------------------------------------------------------------- render: toolbar / header
  function renderHeader() {
    els.segLibrary.setAttribute('aria-selected', String(state.mode === 'library'));
    els.segCollections.setAttribute('aria-selected', String(state.mode === 'collections'));
    els.backBtn.style.display = (state.mode === 'library' && state.scopeId !== 'all') ? '' : 'none';

    if (state.mode === 'collections') {
      els.title.textContent = 'Collections';
      els.count.textContent = '';
    } else {
      els.title.textContent = labelForScope(state.scopeId);
      var n = currentList().length;
      els.count.textContent = n + (n === 1 ? ' item' : ' items');
    }
    els.bottomBar.style.display = state.mode === 'library' ? '' : 'none';
    els.bottomBar.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.dataset.scope === state.dateScope));
    });
  }

  // ---------------------------------------------------------------- render: library grid
  function favSvg(filled) {
    return filled
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.2-4.6-10-9.1C.4 8.6 1.8 5 5.4 4.1 7.7 3.5 10 4.5 12 7c2-2.5 4.3-3.5 6.6-2.9 3.6.9 5 4.5 3.4 7.8C19.2 16.4 12 21 12 21Z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.2-4.6-10-9.1C.4 8.6 1.8 5 5.4 4.1 7.7 3.5 10 4.5 12 7c2-2.5 4.3-3.5 6.6-2.9 3.6.9 5 4.5 3.4 7.8C19.2 16.4 12 21 12 21Z"/></svg>';
  }
  function checkSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  }

  function thumbAlt(item) {
    if (item.title) return item.title;
    return item.medium ? 'Untitled artwork, ' + item.medium : 'Untitled artwork';
  }
  function thumbHTML(item) {
    var isFav = favorites.has(item.id);
    var isSel = state.selected.has(item.id);
    return (
      '<button type="button" class="g-thumb" data-id="' + esc(item.id) + '" aria-pressed="' + isSel + '" aria-label="' + esc(thumbAlt(item)) + '">' +
        '<img src="' + esc(item.src) + '" alt="' + esc(thumbAlt(item)) + '" loading="lazy" decoding="async">' +
        '<span class="g-check">' + checkSvg() + '</span>' +
        (isFav ? '<span class="g-fav">' + favSvg(true) + '</span>' : '') +
      '</button>'
    );
  }

  function renderLibrary() {
    var list = currentList();
    if (list.length === 0) { renderEmpty(); return; }
    var groups = groupItems(list);
    var html = groups.map(function (g) {
      return (
        (g.label ? '<div class="g-group-head">' + esc(g.label) + '</div>' : '') +
        '<div class="g-grid">' + g.items.map(thumbHTML).join('') + '</div>'
      );
    }).join('<div class="g-group"></div>');
    els.body.innerHTML = '<div class="g-group">' + html + '</div>';

    els.body.querySelectorAll('.g-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        if (state.selecting) { toggleSelect(id); return; }
        var idx = list.findIndex(function (i) { return i.id === id; });
        openViewer(list, idx);
      });
    });
  }

  function renderEmpty() {
    var isAll = state.scopeId === 'all';
    els.body.innerHTML =
      '<div class="g-empty">' +
        '<svg class="g-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L3 20"/></svg>' +
        '<h3>' + (isAll ? 'No artwork yet' : 'Nothing here yet') + '</h3>' +
        (isAll
          ? '<p>Add entries to <code>js/gallery-data.js</code> and drop the image files into <code>/art/images/</code> — this gallery will fill itself in automatically.</p>'
          : '<p>Nothing in “' + esc(labelForScope(state.scopeId)) + '” matches' + (state.search ? ' your search' : ' yet') + '.</p>') +
      '</div>';
  }

  // ---------------------------------------------------------------- render: collections grid
  function collectionCoverHTML(items) {
    if (items.length === 0) return '<div class="g-coll-cover is-empty">No items</div>';
    var pick = items.slice(0, 4);
    return '<div class="g-coll-cover">' + pick.map(function (i) { return '<img src="' + esc(i.src) + '" alt="" loading="lazy">'; }).join('') + '</div>';
  }

  function renderCollections() {
    var cards = [];

    BUILTIN_COLLECTIONS.forEach(function (c) {
      var items = itemsInScope(c.id);
      cards.push({ id: c.id, name: c.name, count: items.length, items: items });
    });

    cards.push({ id: 'favorites', name: 'Favorites', count: favorites.size, items: itemsInScope('favorites') });

    customCollections.forEach(function (c) {
      var items = itemsInScope(c.id);
      cards.push({ id: c.id, name: c.name, count: items.length, items: items, custom: true });
    });

    var html = cards.map(function (c) {
      return (
        '<button type="button" class="g-coll-card" data-scope="' + esc(c.id) + '">' +
          collectionCoverHTML(c.items) +
          '<div class="g-coll-info"><div class="name">' + esc(c.name) + '</div><div class="count">' + c.count + (c.count === 1 ? ' item' : ' items') + '</div></div>' +
        '</button>'
      );
    }).join('') + '<button type="button" class="g-new-collection" id="g-new-collection-btn">+ New collection</button>';

    els.body.innerHTML = '<div class="g-collections">' + html + '</div>';

    els.body.querySelectorAll('.g-coll-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.scopeId = btn.dataset.scope;
        state.mode = 'library';
        state.search = '';
        els.search.value = '';
        render();
      });
    });
    var newBtn = document.getElementById('g-new-collection-btn');
    if (newBtn) newBtn.addEventListener('click', createCollectionPrompt);
  }

  function createCollectionPrompt(presetIds) {
    var name = window.prompt('Name this collection:');
    if (!name) return;
    var id = 'c_' + Date.now().toString(36);
    customCollections.push({ id: id, name: name.trim(), itemIds: presetIds || [] });
    saveCustom();
    render();
  }

  // ---------------------------------------------------------------- select mode / bulk actions
  function toggleSelect(id) {
    if (state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
    render();
  }
  function setSelecting(on) {
    state.selecting = on;
    if (!on) state.selected.clear();
    els.page.classList.toggle('is-selecting', on);
    els.selectBtn.setAttribute('aria-pressed', String(on));
    els.selectBtn.textContent = on ? 'Done' : 'Select';
    render();
  }
  function renderBulkBar() {
    els.bulkCount.textContent = state.selected.size + ' selected';
  }

  // ---------------------------------------------------------------- viewer
  var viewerState = { list: [], index: 0, scale: 1 };

  function openViewer(list, index) {
    viewerState.list = list; viewerState.index = index; viewerState.scale = 1;
    renderViewerItem();
    els.viewer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeViewer() {
    els.viewer.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function renderViewerItem() {
    var item = viewerState.list[viewerState.index];
    if (!item) return;
    els.viewerImg.src = item.src;
    els.viewerImg.alt = item.title || 'Artwork';
    els.viewerImg.style.transform = 'scale(1)';
    els.viewerImg.classList.remove('is-zoomed');
    viewerState.scale = 1;
    els.viewerTitle.textContent = item.title || 'Untitled';
    var coll = collectionById(item.collection);
    var sub = [coll && coll.name, item.medium, item.date].filter(Boolean).join(' · ');
    els.viewerSub.textContent = sub;
    els.viewerDesc.textContent = item.description || '';
    els.viewerDesc.style.display = item.description ? '' : 'none';
    var isFav = favorites.has(item.id);
    els.viewerFav.innerHTML = favSvg(isFav);
    els.viewerFav.setAttribute('aria-pressed', String(isFav));
    els.viewerPrev.style.visibility = viewerState.index > 0 ? 'visible' : 'hidden';
    els.viewerNext.style.visibility = viewerState.index < viewerState.list.length - 1 ? 'visible' : 'hidden';
  }
  function viewerNav(dir) {
    var next = viewerState.index + dir;
    if (next < 0 || next >= viewerState.list.length) return;
    viewerState.index = next;
    renderViewerItem();
  }
  function toggleViewerFavorite() {
    var item = viewerState.list[viewerState.index];
    if (!item) return;
    if (favorites.has(item.id)) favorites.delete(item.id); else favorites.add(item.id);
    saveFavorites();
    renderViewerItem();
  }
  function toggleZoom(e) {
    var img = els.viewerImg;
    if (viewerState.scale > 1) {
      viewerState.scale = 1;
      img.style.transform = 'scale(1)';
      img.classList.remove('is-zoomed');
    } else {
      viewerState.scale = 2.2;
      img.style.transform = 'scale(' + viewerState.scale + ')';
      img.classList.add('is-zoomed');
    }
  }

  // swipe (touch) on the stage, only when not zoomed
  (function wireSwipe() {
    var stage = els.viewer.querySelector('.g-viewer-stage');
    var startX = null, startY = null;
    stage.addEventListener('touchstart', function (e) {
      if (viewerState.scale > 1) return;
      var t = e.changedTouches[0]; startX = t.clientX; startY = t.clientY;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (startX === null || viewerState.scale > 1) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        viewerNav(dx < 0 ? 1 : -1);
      }
      startX = null; startY = null;
    }, { passive: true });
  })();

  // ---------------------------------------------------------------- main render
  function render() {
    renderHeader();
    if (state.mode === 'collections') renderCollections();
    else renderLibrary();
    renderBulkBar();
  }

  // ---------------------------------------------------------------- wiring
  els.segLibrary.addEventListener('click', function () { state.mode = 'library'; render(); });
  els.segCollections.addEventListener('click', function () { state.mode = 'collections'; render(); });
  els.backBtn.addEventListener('click', function () { state.scopeId = 'all'; state.search = ''; els.search.value = ''; render(); });
  els.search.addEventListener('input', function () { state.search = els.search.value.trim(); render(); });
  els.selectBtn.addEventListener('click', function () { setSelecting(!state.selecting); });
  els.bulkCancel.addEventListener('click', function () { setSelecting(false); });
  els.bulkFav.addEventListener('click', function () {
    state.selected.forEach(function (id) { favorites.add(id); });
    saveFavorites();
    setSelecting(false);
  });
  els.bulkAdd.addEventListener('click', function () {
    var ids = Array.from(state.selected);
    if (ids.length === 0) return;
    var names = customCollections.map(function (c) { return c.name; });
    var choice = window.prompt('Add ' + ids.length + ' item(s) to a collection.\nType an existing name (' + (names.join(', ') || 'none yet') + ') or a new one:');
    if (!choice) return;
    choice = choice.trim();
    var existing = customCollections.filter(function (c) { return c.name.toLowerCase() === choice.toLowerCase(); })[0];
    if (existing) {
      ids.forEach(function (id) { if (existing.itemIds.indexOf(id) === -1) existing.itemIds.push(id); });
    } else {
      customCollections.push({ id: 'c_' + Date.now().toString(36), name: choice, itemIds: ids });
    }
    saveCustom();
    setSelecting(false);
  });

  els.bottomBar.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () { state.dateScope = b.dataset.scope; render(); });
  });

  els.viewerClose.addEventListener('click', closeViewer);
  els.viewerPrev.addEventListener('click', function () { viewerNav(-1); });
  els.viewerNext.addEventListener('click', function () { viewerNav(1); });
  els.viewerFav.addEventListener('click', toggleViewerFavorite);
  els.viewerImg.addEventListener('dblclick', toggleZoom);
  (function wireTapZoomMobile() {
    var last = 0;
    els.viewerImg.addEventListener('touchend', function () {
      var now = Date.now();
      if (now - last < 300) toggleZoom();
      last = now;
    });
  })();
  els.viewer.addEventListener('click', function (e) { if (e.target === els.viewer) closeViewer(); });

  document.addEventListener('keydown', function (e) {
    if (!els.viewer.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowLeft') viewerNav(-1);
    else if (e.key === 'ArrowRight') viewerNav(1);
  });

  render();
})();
