import { store } from "../state.js";
import { simulateQuantity } from "../utils/calculations.js";
import { formatCurrency, formatNumber, parsePositive } from "../utils/format.js";

export function initQuantitySimulator() {
  const chips = document.getElementById("qty-chips");
  const custom = document.getElementById("qty-custom");

  chips.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-qty]");
    if (!chip) return;
    custom.value = "";
    store.update((state) => {
      state.simQty = Number(chip.dataset.qty);
    });
  });

  custom.addEventListener("input", () => {
    const qty = Math.floor(parsePositive(custom.value));
    if (qty > 0) {
      store.update((state) => {
        state.simQty = qty;
      });
    }
  });

  store.subscribe(render);
  render(store.state, store.results);
}

function render(state, results) {
  const sim = simulateQuantity(results, state.simQty);

  document.getElementById("qty-revenue").textContent = formatCurrency(sim.revenue);
  document.getElementById("qty-cost").textContent = formatCurrency(sim.cost);

  const profitEl = document.getElementById("qty-profit");
  profitEl.textContent = formatCurrency(sim.profit);
  profitEl.classList.toggle("value-negative", sim.profit < 0);

  document.getElementById("qty-label").textContent = formatNumber(sim.units);

  document.querySelectorAll("#qty-chips .chip").forEach((chip) => {
    chip.classList.toggle("active", Number(chip.dataset.qty) === state.simQty);
  });
}
