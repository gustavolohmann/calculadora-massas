import { store, createEmptyRecipe } from "../state.js";
import { exportPdf, exportExcel } from "../utils/export.js";

export function initToolbar() {
  document.getElementById("btn-new").addEventListener("click", () => {
    if (!confirm("Começar uma nova receita? Os dados atuais serão substituídos.")) return;
    store.update((state) => Object.assign(state, createEmptyRecipe()));
    syncFormInputs();
  });

  document.getElementById("btn-duplicate").addEventListener("click", () => {
    store.update((state) => {
      state.name = state.name.trim() ? `${state.name.trim()} (cópia)` : "Receita (cópia)";
      state.ingredients = state.ingredients.map((ing) => ({ ...ing, id: crypto.randomUUID() }));
    });
    syncFormInputs();
  });

  document.getElementById("btn-pdf").addEventListener("click", () => {
    exportPdf(store.state, store.results);
  });

  document.getElementById("btn-excel").addEventListener("click", () => {
    exportExcel(store.state, store.results);
  });

  document.getElementById("btn-print").addEventListener("click", () => window.print());
}

/** Reposiciona os campos controlados após trocar a receita inteira. */
function syncFormInputs() {
  const state = store.state;
  document.getElementById("recipe-name").value = state.name;
  document.getElementById("units-produced").value = state.unitsProduced;
  document.getElementById("desired-margin").value = state.margin;
  document.getElementById("qty-custom").value = "";
  document.querySelectorAll("[data-cost]").forEach((input) => {
    const value = state.extraCosts[input.dataset.cost];
    input.value = value > 0 ? value : "";
  });
}
