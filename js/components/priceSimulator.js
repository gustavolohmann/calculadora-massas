import { store } from "../state.js";
import { formatCurrency, formatMarkup, formatPercent } from "../utils/format.js";

let dragging = false;

export function initPriceSimulator() {
  const slider = document.getElementById("price-slider");
  const resetBtn = document.getElementById("btn-reset-price");

  slider.addEventListener("input", () => {
    dragging = true;
    store.update((state) => {
      state.customPrice = parseFloat(slider.value);
    });
    dragging = false;
  });

  resetBtn.addEventListener("click", () => {
    store.update((state) => {
      state.customPrice = null;
    });
  });

  store.subscribe(render);
  render(store.state, store.results);
}

function render(_state, r) {
  const slider = document.getElementById("price-slider");

  // Faixa do slider: do custo unitário até 4× o custo (mínimo R$ 1 para receita vazia).
  const min = Math.max(0, r.unitCost);
  const max = Math.max(1, r.unitCost * 4, r.sellingPrice * 1.2);

  if (!dragging) {
    slider.min = min.toFixed(2);
    slider.max = max.toFixed(2);
    slider.value = r.sellingPrice.toFixed(2);
  }

  const fill = max > min ? ((r.sellingPrice - min) / (max - min)) * 100 : 0;
  slider.style.setProperty("--fill", `${Math.min(100, Math.max(0, fill))}%`);

  document.getElementById("slider-min").textContent = formatCurrency(min);
  document.getElementById("slider-max").textContent = formatCurrency(max);
  document.getElementById("slider-current").textContent = formatCurrency(r.sellingPrice);

  document.getElementById("sim-price").textContent = formatCurrency(r.sellingPrice);
  setValue("sim-profit", formatCurrency(r.unitProfit), r.unitProfit < 0);
  setValue("sim-margin", formatPercent(Math.round(r.marginPercent * 10) / 10), r.marginPercent < 0);
  document.getElementById("sim-markup").textContent = formatMarkup(r.markup);

  document.getElementById("btn-reset-price").style.visibility =
    _state.customPrice === null ? "hidden" : "visible";
}

function setValue(id, text, negative) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.classList.toggle("value-negative", negative);
}
