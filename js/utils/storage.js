const STORAGE_KEY = "massalucro:recipe";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let saveTimer = null;

export function saveState(state, onSaved) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      onSaved?.();
    } catch {
      /* armazenamento indisponível (modo privado etc.) */
    }
  }, 300);
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
