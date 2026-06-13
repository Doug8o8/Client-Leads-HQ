// =====================================================================
// Safe localStorage access. Never throws — gracefully degrades to
// in-memory only when storage is unavailable (SSR, private mode, quota).
// =====================================================================

let availabilityCache: boolean | null = null;

export function isStorageAvailable(): boolean {
  if (availabilityCache !== null) return availabilityCache;
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      availabilityCache = false;
      return false;
    }
    const probe = "__clhq_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    availabilityCache = true;
  } catch {
    availabilityCache = false;
  }
  return availabilityCache;
}

export function readRaw(key: string): string | null {
  if (!isStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: string, value: string): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeRaw(key: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
