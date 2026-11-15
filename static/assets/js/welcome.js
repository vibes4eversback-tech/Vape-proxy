(() => {
  const onboarding = document.getElementById("onboarding");
  const home = document.getElementById("home-content");
  const nameStep = document.getElementById("name-step");
  const themeStep = document.getElementById("theme-step");
  const nameForm = document.getElementById("name-form");
  const nameInput = document.getElementById("welcome-name");
  const greeting = document.getElementById("home-greeting");
  const setupGreeting = document.getElementById("setup-greeting");
  const finishButton = document.getElementById("finish-setup");
  const choices = [...document.querySelectorAll("[data-theme-choice]")];

  let name = (store.get("welcomeName") || "").trim();
  let theme = store.get("welcomeTheme");
  if (theme !== "landscape" && theme !== "purple") theme = "";

  function setTheme(value) {
    theme = value;
    document.body.dataset.visualTheme = value;
    choices.forEach(choice => {
      choice.setAttribute("aria-pressed", String(choice.dataset.themeChoice === value));
    });
    finishButton.disabled = !theme;
  }

  function showHome() {
    onboarding.hidden = true;
    home.hidden = false;
    document.body.dataset.onboarding = "false";
    greeting.textContent = `Hey ${name}, let’s get started.`;
    document.getElementById("input")?.focus({ preventScroll: true });
  }

  function showNameStep() {
    home.hidden = true;
    onboarding.hidden = false;
    nameStep.hidden = false;
    themeStep.hidden = true;
    nameInput.value = name;
    nameInput.focus({ preventScroll: true });
  }

  function showThemeStep() {
    nameStep.hidden = true;
    themeStep.hidden = false;
    setupGreeting.textContent = `Hey ${name}, let’s get started.`;
    setTheme(theme || "purple");
  }

  choices.forEach(choice => choice.addEventListener("click", () => setTheme(choice.dataset.themeChoice)));

  nameForm.addEventListener("submit", event => {
    event.preventDefault();
    const value = nameInput.value.trim().replace(/\s+/g, " ").slice(0, 24);
    if (!value) {
      nameInput.focus();
      return;
    }
    name = value;
    store.set("welcomeName", name);
    showThemeStep();
  });

  document.getElementById("back-to-name").addEventListener("click", showNameStep);

  finishButton.addEventListener("click", () => {
    if (!theme || !name) return;
    store.set("welcomeTheme", theme);
    store.set("welcomeComplete", "true");
    setTheme(theme);
    showHome();
  });

  document.getElementById("personalize").addEventListener("click", () => {
    onboarding.hidden = false;
    home.hidden = true;
    nameStep.hidden = true;
    themeStep.hidden = false;
    nameInput.value = name;
    showThemeStep();
  });

  if (store.get("welcomeComplete") === "true" && name && theme) {
    setTheme(theme);
    showHome();
  } else {
    onboarding.hidden = false;
    home.hidden = true;
    document.body.dataset.onboarding = "true";
    if (name) showThemeStep();
    else showNameStep();
  }
})();
