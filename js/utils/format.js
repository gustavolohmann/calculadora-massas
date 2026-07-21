const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export function formatCurrency(value) {
  return brl.format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value) {
  return number.format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${number.format(value)}%`;
}

export function formatMarkup(value) {
  if (!Number.isFinite(value)) return "0,00×";
  return `${value.toFixed(2).replace(".", ",")}×`;
}

/** Converte entrada do usuário em número >= 0 (aceita vírgula decimal). */
export function parsePositive(raw) {
  if (typeof raw === "number") return Number.isFinite(raw) && raw > 0 ? raw : 0;
  const value = parseFloat(String(raw).replace(",", "."));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

const UNIT_LABELS = { kg: "kg", g: "g", l: "L", ml: "ml", un: "un." };

export function formatQuantity(qty, unit) {
  return `${formatNumber(qty)} ${UNIT_LABELS[unit] ?? unit}`;
}
