/* Accessible modal sheets built on the native <dialog> element (focus trap,
   Escape to close and inert background come from the browser).
   API:
     krishDialog.prompt({ title, message, label, placeholder, confirmLabel }) -> Promise<string|null>
     krishDialog.choose({ title, message, options:[{id,label}], newLabel, newPlaceholder, confirmLabel })
                                                         -> Promise<{id}|{name}|null>
   Falls back to window.prompt where <dialog> is unavailable. */
(function () {
  'use strict';
  var supported = typeof HTMLDialogElement === 'function' && typeof document.createElement('dialog').showModal === 'function';
  var uid = 0;

  var CHECK = '<svg class="choice-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // build(ctx) fills the body and returns function read() -> result | undefined (undefined = invalid)
  function sheet(opts, build) {
    return new Promise(function (resolve) {
      var id = 'sheet-' + (++uid);
      var dlg = h('dialog', 'sheet glass-strong');
      dlg.setAttribute('aria-labelledby', id + '-t');
      var form = h('form'); form.noValidate = true;
      var title = h('h2', '', opts.title); title.id = id + '-t';
      form.appendChild(title);
      if (opts.message) { var m = h('p', 'sheet-desc', opts.message); m.id = id + '-d'; form.appendChild(m); dlg.setAttribute('aria-describedby', m.id); }
      var body = h('div', 'sheet-body'); form.appendChild(body);
      var read = build(body, id);
      var actions = h('div', 'sheet-actions');
      var cancel = h('button', 'btn', opts.cancelLabel || 'Cancel'); cancel.type = 'button';
      var ok = h('button', 'btn btn-primary', opts.confirmLabel || 'Done'); ok.type = 'submit';
      actions.appendChild(cancel); actions.appendChild(ok); form.appendChild(actions);
      dlg.appendChild(form);

      var result = null;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = read();
        if (v === undefined) return;      // invalid: the builder shows the error
        result = v; dlg.close();
      });
      cancel.addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) {   // click on the dimmed backdrop
        if (e.target !== dlg) return;
        var r = dlg.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
      });
      dlg.addEventListener('close', function () { dlg.remove(); resolve(result); });
      document.body.appendChild(dlg);
      dlg.showModal();
    });
  }

  function textField(body, id, label, placeholder) {
    var field = h('div', 'field');
    var lab = h('label', '', label); lab.setAttribute('for', id + '-in');
    var input = h('input', 'input'); input.id = id + '-in'; input.type = 'text';
    input.maxLength = 80; input.autocomplete = 'off'; input.placeholder = placeholder || '';
    var err = h('p', 'field-error'); err.id = id + '-err'; err.hidden = true;
    field.appendChild(lab); field.appendChild(input); field.appendChild(err);
    body.appendChild(field);
    return {
      input: input,
      fail: function (msg) { err.textContent = msg; err.hidden = false; input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', err.id); input.focus(); },
      clear: function () { err.hidden = true; input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    };
  }

  function prompt(opts) {
    opts = opts || {};
    if (!supported) { var v = window.prompt(opts.message || opts.title); return Promise.resolve(v && v.trim() ? v.trim() : null); }
    return sheet(opts, function (body, id) {
      var f = textField(body, id, opts.label || 'Name', opts.placeholder);
      f.input.addEventListener('input', f.clear);
      setTimeout(function () { f.input.focus(); }, 0);
      return function () {
        var val = f.input.value.trim();
        if (!val) { f.fail('Enter a name.'); return undefined; }
        return val;
      };
    });
  }

  function choose(opts) {
    opts = opts || {};
    var options = opts.options || [];
    if (!supported) {
      var names = options.map(function (o) { return o.label; });
      var v = window.prompt((opts.message || opts.title) + '\nExisting: ' + (names.join(', ') || 'none yet'));
      v = v && v.trim();
      if (!v) return Promise.resolve(null);
      var hit = options.filter(function (o) { return o.label.toLowerCase() === v.toLowerCase(); })[0];
      return Promise.resolve(hit ? { id: hit.id } : { name: v });
    }
    return sheet(opts, function (body, id) {
      var radios = [];
      if (options.length) {
        var list = h('div', 'choices'); list.setAttribute('role', 'radiogroup'); list.setAttribute('aria-label', opts.groupLabel || 'Existing collections');
        options.forEach(function (o) {
          var lab = h('label', 'choice');
          var r = h('input', 'choice-input'); r.type = 'radio'; r.name = id + '-c'; r.value = o.id;
          lab.appendChild(r); lab.appendChild(h('span', 'choice-body', o.label));
          lab.insertAdjacentHTML('beforeend', CHECK);
          list.appendChild(lab); radios.push(r);
        });
        body.appendChild(list);
      }
      var f = textField(body, id, options.length ? (opts.newLabel || 'Or create a new one') : (opts.newLabel || 'Name'), opts.newPlaceholder);
      // choosing an existing item and typing a new name are mutually exclusive
      radios.forEach(function (r) { r.addEventListener('change', function () { f.input.value = ''; f.clear(); }); });
      f.input.addEventListener('input', function () { f.clear(); if (f.input.value) radios.forEach(function (r) { r.checked = false; }); });
      setTimeout(function () { (radios[0] || f.input).focus(); }, 0);
      return function () {
        var picked = radios.filter(function (r) { return r.checked; })[0];
        if (picked) return { id: picked.value };
        var val = f.input.value.trim();
        if (!val) { f.fail(options.length ? 'Choose a collection or enter a new name.' : 'Enter a name.'); return undefined; }
        var existing = options.filter(function (o) { return o.label.toLowerCase() === val.toLowerCase(); })[0];
        return existing ? { id: existing.id } : { name: val };
      };
    });
  }

  window.krishDialog = { prompt: prompt, choose: choose };
})();
