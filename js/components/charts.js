import { store } from "../state.js";
import { formatCurrency } from "../utils/format.js";

let pieChart = null;
let barChart = null;

const PIE_COLORS = ["#e85d3d", "#2563eb", "#d97706", "#7c3aed", "#0891b2", "#db2777"];

export function initCharts() {
  const pieCtx = document.getElementById("chart-pie");
  const barCtx = document.getElementById("chart-bar");

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = "#6b7280";

  pieChart = new Chart(pieCtx, {
    type: "doughnut",
    data: { labels: [], datasets: [{ data: [], backgroundColor: PIE_COLORS, borderWidth: 2, borderColor: "#fff" }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 14, padding: 14 } },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed)}`,
          },
        },
      },
    },
  });

  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Custo", "Receita", "Lucro"],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ["#d97706", "#2563eb", "#16a34a"],
        borderRadius: 8,
        maxBarThickness: 90,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${formatCurrency(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => formatCurrency(value) },
          grid: { color: "#eef0f5" },
        },
        x: { grid: { display: false } },
      },
    },
  });

  store.subscribe(render);
  render(store.state, store.results);
}

function render(state, results) {
  const pieEntries = buildPieEntries(state, results);
  pieChart.data.labels = pieEntries.map(([label]) => label);
  pieChart.data.datasets[0].data = pieEntries.map(([, value]) => value);
  pieChart.update();

  barChart.data.datasets[0].data = [results.recipeCost, results.revenue, results.totalProfit];
  barChart.update();
}

function buildPieEntries(state, results) {
  const extras = state.extraCosts;
  const otherExtras =
    (extras.etiqueta || 0) + (extras.gas || 0) + (extras.agua || 0) +
    (extras.entrega || 0) + (extras.comissao || 0) + (extras.outros || 0);

  return [
    ["Ingredientes", results.ingredientsCost],
    ["Embalagem", extras.embalagem || 0],
    ["Energia", extras.energia || 0],
    ["Outros", otherExtras],
  ].filter(([, value]) => value > 0);
}
