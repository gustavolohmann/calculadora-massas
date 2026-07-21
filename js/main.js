import { initIngredients } from "./components/ingredients.js";
import { initExtraCosts } from "./components/extraCosts.js";
import { initProduction } from "./components/production.js";
import { initDashboard } from "./components/dashboard.js";
import { initPriceSimulator } from "./components/priceSimulator.js";
import { initQuantitySimulator } from "./components/quantitySimulator.js";
import { initCharts } from "./components/charts.js";
import { initToolbar } from "./components/toolbar.js";

initProduction();
initIngredients();
initExtraCosts();
initDashboard();
initPriceSimulator();
initQuantitySimulator();
initCharts();
initToolbar();
