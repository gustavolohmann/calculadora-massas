import { store } from "../state.js";
import { ingredientCost, sameUnitGroup } from "../utils/calculations.js";
import { formatCurrency, formatQuantity, parsePositive } from "../utils/format.js";

export function initIngredients() {
  const form = document.getElementById("ingredient-form");
  const tbody = document.getElementById("ingredient-tbody");
  const errorEl = document.getElementById("ingredient-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const ingredient = {
      id: crypto.randomUUID(),
      name: document.getElementById("ing-name").value.trim(),
      purchasedQty: parsePositive(document.getElementById("ing-purchased-qty").value),
      purchasedUnit: document.getElementById("ing-purchased-unit").value,
      price: parsePositive(document.getElementById("ing-price").value),
      usedQty: parsePositive(document.getElementById("ing-used-qty").value),
      usedUnit: document.getElementById("ing-used-unit").value,
    };

    const error = validate(ingredient);
    if (error) {
      errorEl.textContent = error;
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;
    store.update((state) => state.ingredients.push(ingredient));
    form.reset();
    document.getElementById("ing-name").focus();
  });

  tbody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    store.update((state) => {
      state.ingredients = state.ingredients.filter((ing) => ing.id !== button.dataset.remove);
    });
  });

  store.subscribe(render);
  render(store.state, store.results);
}

function validate(ing) {
  if (!ing.name) return "Informe o nome do ingrediente.";
  if (ing.purchasedQty <= 0) return "A quantidade comprada deve ser maior que zero.";
  if (ing.price <= 0) return "O preço pago deve ser maior que zero.";
  if (ing.usedQty <= 0) return "A quantidade usada deve ser maior que zero.";
  if (!sameUnitGroup(ing.purchasedUnit, ing.usedUnit)) {
    return "As unidades precisam ser compatíveis (ex.: kg com g, litro com ml).";
  }
  return null;
}

function render(state, results) {
  const tbody = document.getElementById("ingredient-tbody");
  const empty = document.getElementById("ingredient-empty");
  const table = document.getElementById("ingredient-table");
  const total = document.getElementById("ingredient-total");

  tbody.innerHTML = state.ingredients
    .map((ing) => {
      const cost = ingredientCost(ing);
      return `
        <tr>
          <td>
            ${escapeHtml(ing.name)}
            <span class="cell-detail">Comprou ${formatQuantity(ing.purchasedQty, ing.purchasedUnit)} por ${formatCurrency(ing.price)}</span>
          </td>
          <td>${formatQuantity(ing.usedQty, ing.usedUnit)}</td>
          <td><strong>${formatCurrency(cost)}</strong></td>
          <td class="no-print">
            <button class="btn-remove" data-remove="${ing.id}" title="Remover ${escapeHtml(ing.name)}" aria-label="Remover ${escapeHtml(ing.name)}">✕</button>
          </td>
        </tr>`;
    })
    .join("");

  const hasItems = state.ingredients.length > 0;
  empty.hidden = hasItems;
  table.style.display = hasItems ? "" : "none";
  total.textContent = formatCurrency(results.ingredientsCost);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);
}
