const THEME_KEY = "theme";
type Theme = "light" | "dark";

function readTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

let theme: Theme = readTheme();

function reflect(): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  const button = document.querySelector<HTMLButtonElement>("#theme-btn");
  button?.setAttribute(
    "aria-label",
    theme === "dark" ? "밝은 모드로 전환" : "어두운 모드로 전환"
  );
  button?.setAttribute(
    "title",
    theme === "dark" ? "밝은 모드로 전환" : "어두운 모드로 전환"
  );
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", getComputedStyle(document.body).backgroundColor);
}

function setup(): void {
  reflect();
  const button = document.querySelector<HTMLButtonElement>("#theme-btn");
  if (!button || button.dataset.bound === "true") return;
  button.dataset.bound = "true";
  button.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* Keep session choice. */
    }
    reflect();
  });
}

setup();
document.addEventListener("astro:after-swap", setup);
window.addEventListener("storage", event => {
  if (event.key === THEME_KEY) {
    theme = event.newValue === "light" ? "light" : "dark";
    reflect();
  }
});
