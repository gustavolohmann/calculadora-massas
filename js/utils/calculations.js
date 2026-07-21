/**
 * Unidades convertidas para uma base comum por grupo:
 * massa (g), volume (ml) e unidade (un).
 */
const UNITS = {
  kg: { group: "mass", factor: 1000 },
  g: { group: "mass", factor: 1 },
  l: { group: "volume", factor: 1000 },
  ml: { group: "volume", factor: 1 },
  un: { group: "count", factor: 1 },
};

export function sameUnitGroup(unitA, unitB) {
  return UNITS[unitA]?.group === UNITS[unitB]?.group;
}

function toBase(qty, unit) {
  return qty * (UNITS[unit]?.factor ?? 1);
}

/** Custo proporcional: preço pago × (quantidade usada ÷ quantidade comprada). */
export function ingredientCost({ purchasedQty, purchasedUnit, price, usedQty, usedUnit }) {
  const purchasedBase = toBase(purchasedQty, purchasedUnit);
  if (purchasedBase <= 0) return 0;
  return (price * toBase(usedQty, usedUnit)) / purchasedBase;
}

export function ingredientsTotal(ingredients) {
  return ingredients.reduce((sum, ing) => sum + ingredientCost(ing), 0);
}

export function extraCostsTotal(extraCosts) {
  return Object.values(extraCosts).reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);
}

/**
 * Calcula todos os indicadores da receita.
 * A margem desejada é aplicada sobre o custo (preço = custo × (1 + margem/100)).
 * "customPrice" (definido pelo slider) substitui o preço sugerido quando presente.
 */
export function computeResults(state) {
  const ingredientsCost = ingredientsTotal(state.ingredients);
  const extrasCost = extraCostsTotal(state.extraCosts);
  const recipeCost = ingredientsCost + extrasCost;

  const units = Math.max(1, Math.floor(state.unitsProduced) || 1);
  const unitCost = recipeCost / units;

  const suggestedPrice = unitCost * (1 + state.margin / 100);
  const sellingPrice = state.customPrice ?? suggestedPrice;

  const unitProfit = sellingPrice - unitCost;
  const totalProfit = unitProfit * units;
  const revenue = sellingPrice * units;
  const marginPercent = sellingPrice > 0 ? (unitProfit / sellingPrice) * 100 : 0;
  const profitPercent = unitCost > 0 ? (unitProfit / unitCost) * 100 : 0;
  const markup = unitCost > 0 ? sellingPrice / unitCost : 0;

  return {
    ingredientsCost,
    extrasCost,
    recipeCost,
    units,
    unitCost,
    suggestedPrice,
    sellingPrice,
    unitProfit,
    totalProfit,
    revenue,
    marginPercent,
    profitPercent,
    markup,
  };
}

/** Projeção para uma quantidade vendida arbitrária. */
export function simulateQuantity(results, qty) {
  const units = Math.max(1, Math.floor(qty) || 1);
  return {
    units,
    revenue: results.sellingPrice * units,
    cost: results.unitCost * units,
    profit: (results.sellingPrice - results.unitCost) * units,
  };
}
