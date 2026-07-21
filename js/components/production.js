import { store } from "../state.js";
import { parsePositive } from "../utils/format.js";

export function initProduction() {
  const unitsInput = document.getElementById("units-produced");
  const marginInput = document.getElementById("desired-margin");
  const presets = document.getElementById("margin-presets");
  const nameInput = document.getElementById("recipe-name");

  unitsInput.value = store.state.unitsProduced;
  marginInput.value = store.state.margin;
  nameInput.value = store.state.name;

  unitsInput.addEventListener("input", () => {
    const units = Math.max(1, Math.floor(parsePositive(unitsInput.value)) || 1);
    store.update((state) => {
      state.unitsProduced = units;
    });
  });

  marginInput.addEventListener("input", () => {
    const margin = Math.max(0, parseFloat(String(marginInput.value).replace(",", ".")) || 0);
    store.update((state) => {
      state.margin = margin;
      state.customPrice = null; // nova margem redefine o preço simulado
    });
  });

  presets.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-margin]");
    if (!chip) return;
    marginInput.value = chip.dataset.margin;
    store.update((state) => {
      state.margin = Number(chip.dataset.margin);
      state.customPrice = null;
    });
  });

  nameInput.addEventListener("input", () => {
    store.update((state) => {
      state.name = nameInput.value;
    });
  });

  store.subscribe(renderChips);
  renderChips(store.state);
}

function renderChips(state) {
  document.querySelectorAll("#margin-presets .chip").forEach((chip) => {
    chip.classList.toggle("active", Number(chip.dataset.margin) === state.margin);
  });
}
