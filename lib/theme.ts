// =====================================================================
// Theme: "dark" (command-center, default) and "light" (executive).
// Applied as a class on <html> so styles can be CSS-variable driven.
// The report is always ivory and is unaffected by this toggle.
// =====================================================================
export type Theme = "dark" | "light";

export const THEME_KEY = "clhq.theme";
export const DEFAULT_THEME: Theme = "dark";

/** Inline script (runs before paint) that applies the saved theme with no flash. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_KEY}')||'${DEFAULT_THEME}';var e=document.documentElement;e.classList.remove('theme-dark','theme-light');e.classList.add('theme-'+(t==='light'?'light':'dark'));}catch(e){document.documentElement.classList.add('theme-${DEFAULT_THEME}');}})();`;

export function getStoredTheme(): Theme {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" ? "light" : "dark";
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme: Theme): void {
  const el = document.documentElement;
  el.classList.remove("theme-dark", "theme-light");
  el.classList.add(`theme-${theme}`);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------
// Minimal external store so components can read/toggle the theme with
// useSyncExternalStore (no setState-in-effect hydration dance).
// ---------------------------------------------------------------------
let themeCache: Theme | null = null;
const themeListeners = new Set<() => void>();

export function getTheme(): Theme {
  if (themeCache === null) themeCache = getStoredTheme();
  return themeCache;
}

export function getServerTheme(): Theme {
  return DEFAULT_THEME;
}

export function subscribeTheme(listener: () => void): () => void {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
}

export function setTheme(theme: Theme): void {
  themeCache = theme;
  applyTheme(theme);
  themeListeners.forEach((l) => l());
}
