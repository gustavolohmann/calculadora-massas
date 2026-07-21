import { store } from "../state.js";
import { formatCurrency, formatMarkup, formatPercent } from "../utils/format.js";

export function initDashboard() {
  store.subscribe(render);
  render(store.state, store.results);
}

function render(_state, r) {
  setText("stat-revenue", formatCurrency(r.revenue));
  setText("stat-profit", formatCurrency(r.totalProfit), r.totalProfit < 0);
  setText("stat-cost", formatCurrency(r.recipeCost));
  setText("stat-price", formatCurrency(r.sellingPrice));
  setText("stat-margin", formatPercent(round1(r.marginPercent)), r.marginPercent < 0);

  setText("res-recipe-cost", formatCurrency(r.recipeCost));
  setText("res-unit-cost", formatCurrency(r.unitCost));
  setText("res-suggested-price", formatCurrency(r.suggestedPrice));
  setText("res-unit-profit", formatCurrency(r.unitProfit), r.unitProfit < 0);
  setText("res-total-profit", formatCurrency(r.totalProfit), r.totalProfit < 0);
  setText("res-margin", formatPercent(round1(r.marginPercent)), r.marginPercent < 0);
  setText("res-markup", formatMarkup(r.markup));
}

function setText(id, text, negative = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.classList.toggle("value-negative", negative);
}

function round1(value) {
  return Math.round(value * 10) / 10;
}
