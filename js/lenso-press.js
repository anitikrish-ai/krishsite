/*!
 * lenso-press.js — the real Lenso UI press/spring engine, ported to plain JS.
 *
 * This is a faithful adaptation (not a reinterpretation) of the analytical
 * spring solver and pointer-driven "rubber band" press model from
 * @lenso/glass (packages/glass/src/motion/{spring-state,spring,press-model,press}.ts),
 * https://github.com/LioRael/lenso-ui — MIT. Original copyright notices below
 * are kept per THIRD_PARTY_NOTICES.md's rule for retained adaptations.
 *
 * Lenso's own files pull in React, a GPU/WebGL backdrop pipeline and worker
 * threads for the full "liquid" refraction; none of that is needed for the
 * press feel itself; this file contains only the physics, which has no
 * framework dependency, so it drops in on plain elements unchanged in
 * substance: same stiffness/damping coefficients, same rubber-band stretch
 * formula, same closed-form spring integration.
 *
 * Usage:
 *   const stop = lensoPress(el);                 // pointer feel (mouse+touch)
 *   const stop = lensoPress(el, { light: true }); // + radial press-highlight
 *   stop();                                        // tear down listeners
 *
 * Consumes/produces these custom properties on the element (see glass.css):
 *   --lg-press-scale      "<sx> <sy>"   e.g. "1.015 0.992"
 *   --lg-press-translate  "<tx>px <ty>px"
 *   --lg-x / --lg-y       pointer position within the element, as a percent
 */
(function (global) {
  "use strict";

  // ---------------------------------------------------------------------
  // spring-state.ts — closed-form (non-iterative) damped spring integrator.
  // Copyright (c) 2026 Kelvin Zhang. SPDX-License-Identifier: MIT.
  function advanceSpring(s, dt) {
    var x = s.value - s.target;
    var v = s.velocity;
    var half = s.damping / 2;
    var discriminant = half * half - s.stiffness;
    if (Math.abs(discriminant) < 1e-4) {
      var decay = Math.exp(-half * dt);
      var b = v + half * x;
      s.value = s.target + decay * (x + b * dt);
      s.velocity = decay * (v - half * b * dt);
    } else if (discriminant > 0) {
      var root = Math.sqrt(discriminant);
      var r1 = -half + root;
      var r2 = -half - root;
      var a = (v - r2 * x) / (r1 - r2);
      var b2 = x - a;
      s.value = s.target + a * Math.exp(r1 * dt) + b2 * Math.exp(r2 * dt);
      s.velocity = a * r1 * Math.exp(r1 * dt) + b2 * r2 * Math.exp(r2 * dt);
    } else {
      var omega = Math.sqrt(-discriminant);
      var decay2 = Math.exp(-half * dt);
      var cos = Math.cos(omega * dt);
      var sin = Math.sin(omega * dt);
      s.value = s.target + decay2 * (x * cos + ((v + half * x) / omega) * sin);
      s.velocity = decay2 * (v * cos - ((half * v + s.stiffness * x) / omega) * sin);
    }
  }

  // ---------------------------------------------------------------------
  // spring.ts — single shared rAF scheduler driving every live spring.
  // Copyright (c) 2026 Kelvin Zhang. SPDX-License-Identifier: MIT.
  var moving = new Set();
  var frame = 0;
  var last = 0;

  function rest(s) {
    moving.delete(s);
    if (moving.size || !frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function tick(time) {
    var dt = Math.min(0.1, Math.max(0, (time - last) / 1000));
    last = time;
    Array.from(moving).forEach(function (s) {
      if (!moving.has(s)) return;
      advanceSpring(s, dt);
      if (Math.abs(s.value - s.target) < 1e-4 && Math.abs(s.velocity) < 1e-3) {
        s.value = s.target;
        s.velocity = 0;
        moving.delete(s);
      }
      s.paint(s.value);
    });
    frame = moving.size ? requestAnimationFrame(tick) : 0;
  }

  function prefersReducedMotion() {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function createSpring(value, stiffness, damping, paint) {
    var s = { value: value, target: value, velocity: 0, stiffness: stiffness, damping: damping, paint: paint };
    return {
      paint: function () { paint(s.value); },
      set: function (target, instant) {
        s.target = target;
        if (instant || document.hidden || prefersReducedMotion()) {
          s.value = target;
          s.velocity = 0;
          rest(s);
          paint(target);
          return;
        }
        moving.add(s);
        if (!frame) {
          last = Number((document.timeline && document.timeline.currentTime) || performance.now());
          frame = requestAnimationFrame(tick);
        }
      },
      tune: function (nextStiffness, nextDamping) {
        s.stiffness = nextStiffness;
        s.damping = nextDamping;
      },
      stop: function () { rest(s); }
    };
  }

  // ---------------------------------------------------------------------
  // press-model.ts — shared press coefficients (stiffness, damping in N/m,
  // Ns/m terms used by the spring above).
  // Copyright (c) 2026 Kelvin Zhang and Moein Saharkhiz. SPDX-License-Identifier: MIT.
  var POINTER = { grow: 6, press: [417.6, 29.2], release: [230, 23.7] };
  var TOUCH = { grow: 16, press: [795, 38], release: [342, 13.5] };

  // ---------------------------------------------------------------------
  // press.ts — pointer tracking + rubber-band stretch, adapted from
  // onlymoein/liquidglass 89f8b736 by way of Lenso UI.
  // Copyright (c) 2026 Kelvin Zhang and Moein Saharkhiz. SPDX-License-Identifier: MIT.
  // Adapted here: propertyPrefix/light options and a radial press-highlight
  // overlay are new; the physics is otherwise unchanged.
  function press(element, options) {
    options = options || {};
    var propertyPrefix = options.propertyPrefix || "--lg-press";
    var value = [1, 1, 0, 0];
    var motion = matchMedia("(prefers-reduced-motion: reduce)");
    var highlight = null;
    if (options.light) {
      highlight = doc_createHighlight(element);
    }

    function paint() {
      element.style.setProperty(propertyPrefix + "-scale", value[0] + " " + value[1]);
      element.style.setProperty(propertyPrefix + "-translate", value[2] + "px " + value[3] + "px");
    }

    var springs = value.map(function (initial, index) {
      return createSpring(initial, POINTER.release[0], POINTER.release[1], function (next) {
        value[index] = next;
        paint();
      });
    });

    var pointer = null;

    function target(next, coeffs) {
      var reduced = prefersReducedMotion();
      springs.forEach(function (spring, index) {
        spring.tune(coeffs[0], coeffs[1]);
        spring.set(reduced ? (index < 2 ? 1 : 0) : (next[index] || 0), reduced);
      });
    }

    function track(event) {
      if (!pointer) return;
      var box = pointer.box, feel = pointer.feel;
      var px = ((event.clientX - box.left) / box.width) * 100;
      var py = ((event.clientY - box.top) / box.height) * 100;
      element.style.setProperty("--lg-x", px + "%");
      element.style.setProperty("--lg-y", py + "%");
      var base = 1 + (options.grow != null ? options.grow : feel.grow) / Math.max(box.width, box.height);
      var aspect = box.width / box.height;
      var dx = (event.clientX - pointer.x) / aspect;
      var dy = event.clientY - pointer.y;
      var length = Math.hypot(dx, dy);
      if (!length) { target([base, base, 0, 0], feel.press); return; }
      var nx = dx / length;
      var ny = dy / length;
      var rubber = 1 - 1 / (1 + length / box.height / (5 * aspect));
      var stretch = 1 + (6 / box.height) * rubber * Math.abs(Math.abs(nx) - Math.abs(ny));
      var horizontal = Math.abs(nx) > Math.abs(ny);
      target(
        [
          base * (horizontal ? stretch : 1 / stretch),
          base * (horizontal ? 1 / stretch : stretch),
          nx * 8 * rubber,
          ny * 8 * rubber
        ],
        feel.press
      );
    }

    function move(event) {
      if (!pointer || event.pointerId !== pointer.id) return;
      if (pointer.mouse && event.buttons === 0) { end(event); return; }
      if (!pointer.editing) track(event);
    }

    function end(event) {
      if (event && pointer && event.pointerId !== pointer.id) return;
      var feel = (pointer && pointer.feel) || POINTER;
      pointer = null;
      element.removeAttribute("data-lenso-pressed");
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", end, true);
      target([1, 1, 0, 0], (feel === TOUCH ? options.touchRelease : null) || options.release || feel.release);
    }

    function down(event) {
      if (
        (options.shouldStart && !options.shouldStart(event)) ||
        !event.isPrimary ||
        event.button !== 0 ||
        pointer ||
        element.matches(':disabled, [data-disabled], [aria-disabled="true"], [data-pending]')
      )
        return;
      var box = element.getBoundingClientRect();
      var width = box.width / value[0];
      var height = box.height / value[1];
      var unitX = element.offsetWidth ? width / element.offsetWidth : 1;
      var unitY = element.offsetHeight ? height / element.offsetHeight : 1;
      pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        box: new DOMRect(
          box.left + (box.width - width) / 2 - value[2] * unitX,
          box.top + (box.height - height) / 2 - value[3] * unitY,
          width,
          height
        ),
        feel: event.pointerType === "mouse" ? POINTER : TOUCH,
        mouse: event.pointerType === "mouse",
        editing:
          event.target instanceof HTMLElement &&
          (event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement ||
            event.target.isContentEditable)
      };
      element.setAttribute("data-lenso-pressed", "");
      window.addEventListener("pointermove", move, true);
      window.addEventListener("pointerup", end, true);
      window.addEventListener("pointercancel", end, true);
      track(event);
    }

    function reset() { end(); }
    function visibility() { if (document.hidden) reset(); }
    function motionChanged() { if (motion.matches) target([1, 1, 0, 0], POINTER.release); }

    element.addEventListener("pointerdown", down);
    element.addEventListener("lostpointercapture", end);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", reset);
    if (motion.addEventListener) motion.addEventListener("change", motionChanged);

    return function teardown() {
      end();
      springs.forEach(function (spring) { spring.stop(); });
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("lostpointercapture", end);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", reset);
      if (motion.removeEventListener) motion.removeEventListener("change", motionChanged);
      [propertyPrefix + "-scale", propertyPrefix + "-translate", "--lg-x", "--lg-y"].forEach(function (name) {
        element.style.removeProperty(name);
      });
      if (highlight && highlight.parentNode) highlight.parentNode.removeChild(highlight);
    };
  }

  // Radial press-highlight overlay: mirrors the shape of Lenso's
  // pressHighlight material (material.styles.ts) — a soft light that follows
  // the pointer and fades in only while pressed. Pure CSS/DOM, no GPU needed.
  function doc_createHighlight(element) {
    var cs = getComputedStyle(element);
    if (cs.position === "static") element.style.position = "relative";
    var span = document.createElement("span");
    span.className = "lg-press-highlight";
    span.setAttribute("aria-hidden", "true");
    element.appendChild(span);
    return span;
  }

  function matches(q) { return window.matchMedia(q).matches; }
  function reducedMotionOrTransparency() {
    return matches("(prefers-reduced-motion: reduce)") || matches("(forced-colors: active)");
  }

  global.lensoPress = press;
  global.lensoPressReduced = reducedMotionOrTransparency;
})(window);
