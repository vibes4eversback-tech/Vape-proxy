(() => {
  const trigger = document.getElementById("proxy-trigger");
  const menu = document.getElementById("proxy-menu");
  if (!trigger || !menu) return;

  const options = [...menu.querySelectorAll("[data-proxy-choice]")];

  function currentMode() {
    return store.get("proxy") === "iv" ? "invisiproxy" : "normal";
  }

  function sync(mode = currentMode()) {
    const alt = mode === "invisiproxy";
    trigger.dataset.proxy = alt ? "invisiproxy" : "normal";
    document.getElementById("proxy-current-label").textContent = alt ? "InvisiProxy (alt)" : "Normal proxy";
    options.forEach(option => option.setAttribute("aria-checked", String(option.dataset.proxyChoice === mode)));
  }

  function setMenu(open) {
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  }

  trigger.addEventListener("click", () => setMenu(menu.hidden));

  options.forEach(option => {
    option.addEventListener("click", () => {
      const mode = option.dataset.proxyChoice;
      store.set("proxy", mode === "invisiproxy" ? "iv" : "sj");
      sync(mode);
      setMenu(false);
      trigger.focus();
    });
  });

  document.addEventListener("click", event => {
    if (!menu.hidden && !event.target.closest(".proxy-picker")) setMenu(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !menu.hidden) {
      setMenu(false);
      trigger.focus();
    }
  });

  window.addEventListener("storage", event => {
    if (event.key === "cfg" || event.key === null) sync();
  });

  sync();
})();
