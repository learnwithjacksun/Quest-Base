export type ThemePreference = "system" | "dark" | "light";

const STORAGE_KEY = "qb-theme";

export function getStoredTheme(): ThemePreference {
  if (typeof localStorage === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light" || stored === "system") {
    return stored;
  }
  return "system";
}

export function getSystemIsLight(): boolean {
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

export function getEffectiveIsLight(preference: ThemePreference): boolean {
  if (preference === "light") return true;
  if (preference === "dark") return false;
  return getSystemIsLight();
}

export function applyTheme(preference: ThemePreference) {
  document.body.classList.toggle("light", getEffectiveIsLight(preference));
}

export function setThemePreference(preference: ThemePreference) {
  localStorage.setItem(STORAGE_KEY, preference);
  applyTheme(preference);
}
