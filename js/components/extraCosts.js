import { store, EXTRA_COST_FIELDS } from "../state.js";
import { formatCurrency, parsePositive } from "../utils/format.js";

export function initExtraCosts() {
  const grid = document.getElementById("extra-costs-grid");

  grid.innerHTML = EXTRA_COST_FIELDS.map(
    ({ key, label }) => `
      <label class="field">
        <span class="field__label">${label} (R$)</span>
        <input type="number" min="0" step="any" placeholder="0,00" data-cost="${key}" />
      </label>`
  ).join("");

  grid.addEventListener("input", (event) => {
    const input = event.target.closest("[data-cost]");
    if (!input) return;
    const value = parsePositive(input.value);
    store.update((state) => {
      state.extraCosts[input.dataset.cost] = value;
    });
  });

  store.subscribe(render);
  syncInputs(store.state);
  render(store.state, store.results);
}

/** Preenche os campos com valores carregados do LocalStorage. */
function syncInputs(state) {
  document.querySelectorAll("[data-cost]").forEach((input) => {
    const value = state.extraCosts[input.dataset.cost];
    input.value = value > 0 ? value : "";
  });
}

function render(_state, results) {
  document.getElementById("extra-costs-total").textContent = formatCurrency(results.extrasCost);
}
