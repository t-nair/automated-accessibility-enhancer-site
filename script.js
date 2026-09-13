/* Progressive enhancement only. Without JavaScript, every update is shown
   and the theme follows the system setting. */

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Dark mode toggle ---------- */

  var toggle = document.getElementById("theme-toggle");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function isDark() {
    if (root.dataset.theme) return root.dataset.theme === "dark";
    return systemDark.matches;
  }

  function syncToggle() {
    toggle.setAttribute("aria-pressed", isDark() ? "true" : "false");
  }

  if (toggle) {
    syncToggle();
    toggle.hidden = false;

    toggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggle();
    });

    // Keep the button state right if the system setting changes and the
    // visitor has not picked a theme themselves.
    if (systemDark.addEventListener) {
      systemDark.addEventListener("change", syncToggle);
    }
  }

  /* ---------- Updates: show three, expand for the rest ---------- */

  var VISIBLE = 3;
  var feed = document.getElementById("feed");
  var more = document.getElementById("feed-toggle");

  if (feed && more) {
    var items = feed.querySelectorAll(".feed-item");
    var extra = Array.prototype.slice.call(items, VISIBLE);

    if (extra.length) {
      var expanded = false;

      function render() {
        extra.forEach(function (item) { item.hidden = !expanded; });
        more.setAttribute("aria-expanded", expanded ? "true" : "false");
        more.textContent = expanded
          ? "Show fewer updates"
          : "View more updates (" + extra.length + ")";
      }

      more.addEventListener("click", function () {
        expanded = !expanded;
        render();
        if (expanded) {
          // Move focus to the first update that just appeared, so keyboard
          // and screen reader users land on the new content.
          extra[0].setAttribute("tabindex", "-1");
          extra[0].focus();
        }
      });

      render();
      more.hidden = false;
    }
  }
})();
