const THEME_KEY = "theme";
type Theme = "light" | "dark";
type ThemePreference = Theme | "system";
const systemTheme = matchMedia("(prefers-color-scheme: dark)");

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

let preference: ThemePreference = readPreference();

function reflect(): void {
  const theme: Theme =
    preference === "system"
      ? systemTheme.matches
        ? "dark"
        : "light"
      : preference;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.themePreference = preference;
  root.classList.toggle("dark", theme === "dark");
  document
    .querySelectorAll<HTMLSelectElement>("[data-theme-select]")
    .forEach(select => {
      select.value = preference;
    });
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", getComputedStyle(document.body).backgroundColor);
  window.dispatchEvent(new CustomEvent("nodus:theme", { detail: { theme } }));
}

function setup(): void {
  reflect();
  document
    .querySelectorAll<HTMLSelectElement>("[data-theme-select]")
    .forEach(select => {
      if (select.dataset.bound === "true") return;
      select.dataset.bound = "true";
      select.addEventListener("change", () => {
        preference = select.value as ThemePreference;
        try {
          localStorage.setItem(THEME_KEY, preference);
        } catch {
          /* Keep the session choice. */
        }
        reflect();
      });
    });
}

setup();
document.addEventListener("astro:after-swap", setup);
systemTheme.addEventListener("change", () => {
  if (preference === "system") reflect();
});
window.addEventListener("storage", event => {
  if (event.key === THEME_KEY || event.key === null) {
    preference = readPreference();
    reflect();
  }
});
