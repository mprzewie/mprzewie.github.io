// Hero background: a faint grid of image patches that light up near the cursor like an
// attention map. Purely decorative; disabled on touch devices and with reduced motion.
// Easter egg: once a visitor has "attended" to enough patches, a caption points them to
// Beyond [CLS]. It shows once per visitor.
// Turn it off with `hero_patches: false` in _config.yml.
(function () {
  var canvas = document.querySelector(".hero__patches");
  if (!canvas) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var hero = canvas.parentElement;
  var ctx = canvas.getContext("2d");
  var CELL = 30;       // patch size in CSS pixels
  var GAP = 3;         // gap between patches
  var RADIUS = 150;    // reach of the cursor's "attention"
  var DECAY = 0.95;    // per-frame fade
  var BASE = 0.014;    // resting opacity of every patch
  var PEAK = 0.42;     // opacity of a fully attended patch

  var cols = 0, rows = 0, values = null, noise = null;
  var EGG_SHARE = 0.3;  // share of patches to touch before the easter egg appears
  var EGG_KEY = "patches-egg-seen";

  var color = "26, 93, 138";
  var pointer = null, running = false, visible = true;
  var touched = null, touchedCount = 0, eggDone = false;
  try { eggDone = localStorage.getItem(EGG_KEY) === "1"; } catch (e) {}

  function readColor() {
    var hex = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (m) color = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)].join(", ");
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    var w = hero.clientWidth, h = hero.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL);
    rows = Math.ceil(h / CELL);
    values = new Float32Array(cols * rows);
    touched = new Uint8Array(cols * rows);
    touchedCount = 0;
    noise = new Float32Array(cols * rows);
    for (var i = 0; i < noise.length; i++) noise[i] = Math.random();
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var size = CELL - GAP;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var a = BASE + values[r * cols + c] * PEAK;
        ctx.fillStyle = "rgba(" + color + ", " + a.toFixed(3) + ")";
        ctx.fillRect(c * CELL + GAP / 2, r * CELL + GAP / 2, size, size);
      }
    }
  }

  function step() {
    var active = false;
    if (pointer) {
      var reach = Math.ceil(RADIUS / CELL);
      var pc = Math.floor(pointer.x / CELL), pr = Math.floor(pointer.y / CELL);
      for (var r = Math.max(0, pr - reach); r <= Math.min(rows - 1, pr + reach); r++) {
        for (var c = Math.max(0, pc - reach); c <= Math.min(cols - 1, pc + reach); c++) {
          var dx = (c + 0.5) * CELL - pointer.x, dy = (r + 0.5) * CELL - pointer.y;
          var g = Math.exp(-(dx * dx + dy * dy) / (2 * (RADIUS / 2.2) * (RADIUS / 2.2)));
          var i = r * cols + c;
          var target = g * (0.35 + 0.65 * noise[i]);
          if (target > values[i]) values[i] = target;
          if (target > 0.3 && !touched[i]) { touched[i] = 1; touchedCount++; }
        }
      }
      if (!eggDone && touchedCount > EGG_SHARE * touched.length) showEgg();
    }
    for (var i = 0; i < values.length; i++) {
      values[i] *= DECAY;
      if (values[i] > 0.004) active = true; else values[i] = 0;
    }
    draw();
    if ((active || pointer) && visible) requestAnimationFrame(step);
    else running = false;
  }

  function showEgg() {
    eggDone = true;
    try { localStorage.setItem(EGG_KEY, "1"); } catch (e) {}
    var wrap = document.createElement("div");
    wrap.className = "hero__egg";
    wrap.innerHTML = '<a href="#beyond-cls">You\u2019ve attended to almost every patch, just like a [CLS] token. ' +
      '<span>There\u2019s a better way \u2192</span></a>';
    hero.appendChild(wrap);
    var link = wrap.firstChild, hovered = false;
    link.addEventListener("mouseenter", function () { hovered = true; });
    link.addEventListener("mouseleave", function () { hovered = false; setTimeout(hide, 2500); });
    link.addEventListener("click", function () { setTimeout(hide, 600); });
    function hide() {
      if (hovered) return;
      wrap.classList.remove("is-visible");
      setTimeout(function () { wrap.remove(); }, 600);
    }
    requestAnimationFrame(function () { wrap.classList.add("is-visible"); });
    setTimeout(hide, 9000);
  }

  function start() {
    if (!running && visible) { running = true; requestAnimationFrame(step); }
  }

  hero.addEventListener("pointermove", function (e) {
    var rect = hero.getBoundingClientRect();
    pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    start();
  });
  hero.addEventListener("pointerleave", function () { pointer = null; start(); });

  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) start();
  }).observe(hero);

  // Follow theme changes (toggle or system).
  function recolor() { readColor(); draw(); }
  new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", recolor);

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener("resize", resize);

  readColor();
  resize();
  canvas.classList.add("is-ready");
})();
