import { EXTRA_COST_FIELDS } from "../state.js";
import { ingredientCost } from "./calculations.js";
import { formatCurrency, formatMarkup, formatPercent, formatQuantity } from "./format.js";

function recipeTitle(state) {
  return state.name.trim() || "Receita sem nome";
}

function summaryRows(results) {
  return [
    ["Custo da receita", formatCurrency(results.recipeCost)],
    ["Quantidade produzida", `${results.units} unidades`],
    ["Custo por unidade", formatCurrency(results.unitCost)],
    ["Preço de venda", formatCurrency(results.sellingPrice)],
    ["Lucro por unidade", formatCurrency(results.unitProfit)],
    ["Lucro total", formatCurrency(results.totalProfit)],
    ["Receita esperada", formatCurrency(results.revenue)],
    ["Margem de lucro", formatPercent(Math.round(results.marginPercent * 10) / 10)],
    ["Markup", formatMarkup(results.markup)],
  ];
}

export function exportPdf(state, results) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const title = recipeTitle(state);

  doc.setFontSize(18);
  doc.setTextColor(232, 93, 61);
  doc.text("MassaLucro — Relatório de Precificação", 14, 18);

  doc.setFontSize(13);
  doc.setTextColor(31, 36, 55);
  doc.text(title, 14, 28);
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, 14, 34);

  doc.autoTable({
    startY: 40,
    head: [["Ingrediente", "Comprado", "Preço pago", "Usado", "Custo"]],
    body: state.ingredients.map((ing) => [
      ing.name,
      formatQuantity(ing.purchasedQty, ing.purchasedUnit),
      formatCurrency(ing.price),
      formatQuantity(ing.usedQty, ing.usedUnit),
      formatCurrency(ingredientCost(ing)),
    ]),
    headStyles: { fillColor: [232, 93, 61] },
    styles: { fontSize: 9 },
  });

  const extras = EXTRA_COST_FIELDS
    .filter(({ key }) => state.extraCosts[key] > 0)
    .map(({ key, label }) => [label, formatCurrency(state.extraCosts[key])]);

  if (extras.length) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Custo adicional", "Valor"]],
      body: extras,
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 },
    });
  }

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 8,
    head: [["Indicador", "Valor"]],
    body: summaryRows(results),
    headStyles: { fillColor: [22, 163, 74] },
    styles: { fontSize: 9 },
  });

  doc.save(`massalucro-${slugify(title)}.pdf`);
}

export function exportExcel(state, results) {
  const wb = XLSX.utils.book_new();

  const ingredientRows = state.ingredients.map((ing) => ({
    Ingrediente: ing.name,
    "Qtd. comprada": `${ing.purchasedQty} ${ing.purchasedUnit}`,
    "Preço pago (R$)": ing.price,
    "Qtd. usada": `${ing.usedQty} ${ing.usedUnit}`,
    "Custo (R$)": Number(ingredientCost(ing).toFixed(2)),
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ingredientRows), "Ingredientes");

  const extraRows = EXTRA_COST_FIELDS.map(({ key, label }) => ({
    "Custo adicional": label,
    "Valor (R$)": state.extraCosts[key] || 0,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(extraRows), "Custos adicionais");

  const resumoRows = summaryRows(results).map(([Indicador, Valor]) => ({ Indicador, Valor }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumoRows), "Resumo");

  XLSX.writeFile(wb, `massalucro-${slugify(recipeTitle(state))}.xlsx`);
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "receita";
}
