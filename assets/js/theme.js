// Light/dark toggle. The initial theme is set by an inline script in <head> to avoid a flash;
// without a stored choice the page follows the system setting.
(function () {
  var button = document.querySelector(".theme-toggle");
  if (!button) return;
  var root = document.documentElement;
  var system = window.matchMedia("(prefers-color-scheme: dark)");

  function current() {
    return root.dataset.theme || (system.matches ? "dark" : "light");
  }
  function label() {
    button.setAttribute("aria-label", current() === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }

  button.hidden = false;
  label();
  button.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });
  system.addEventListener("change", label);
})();
