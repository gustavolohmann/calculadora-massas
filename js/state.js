import { loadState, saveState } from "./utils/storage.js";
import { computeResults } from "./utils/calculations.js";

export const EXTRA_COST_FIELDS = [
  { key: "embalagem", label: "Embalagem" },
  { key: "etiqueta", label: "Etiqueta" },
  { key: "gas", label: "Gás" },
  { key: "energia", label: "Energia" },
  { key: "agua", label: "Água" },
  { key: "entrega", label: "Taxa de entrega" },
  { key: "comissao", label: "Comissão" },
  { key: "outros", label: "Outros custos" },
];

export function createEmptyRecipe() {
  return {
    name: "",
    ingredients: [],
    extraCosts: Object.fromEntries(EXTRA_COST_FIELDS.map((f) => [f.key, 0])),
    unitsProduced: 20,
    margin: 50,
    customPrice: null,
    simQty: 20,
  };
}

const listeners = new Set();

export const store = {
  state: normalize(loadState()) ?? createEmptyRecipe(),

  get results() {
    return computeResults(this.state);
  },

  subscribe(fn) {
    listeners.add(fn);
  },

  /** Aplica mudanças, recalcula tudo e notifica os componentes. */
  update(mutator) {
    mutator(this.state);
    const results = this.results;
    listeners.forEach((fn) => fn(this.state, results));
    saveState(this.state, showSavedHint);
  },

  notify() {
    const results = this.results;
    listeners.forEach((fn) => fn(this.state, results));
  },
};

/** Garante que dados antigos do LocalStorage tenham todos os campos atuais. */
function normalize(saved) {
  if (!saved) return null;
  const base = createEmptyRecipe();
  return {
    ...base,
    ...saved,
    extraCosts: { ...base.extraCosts, ...(saved.extraCosts ?? {}) },
    ingredients: Array.isArray(saved.ingredients) ? saved.ingredients : [],
  };
}

let hintTimer = null;

function showSavedHint() {
  const hint = document.getElementById("autosave-hint");
  if (!hint) return;
  hint.classList.add("visible");
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => hint.classList.remove("visible"), 1800);
}
