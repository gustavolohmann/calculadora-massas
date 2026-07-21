# 🍝 MassaLucro — Calculadora de Precificação para Massas Caseiras

Aplicação web completa para quem vende massas caseiras e precisa saber **exatamente por quanto vender cada produto para ter lucro**.

**🔗 Acesse:** https://gustavolohmann.github.io/calculadora-massas/

## Funcionalidades

- **Cadastro de ingredientes** com cálculo automático do custo proporcional (ex.: comprou 5 kg de farinha por R$ 30 e usou 700 g → o sistema calcula quanto custaram os 700 g).
- **Custos adicionais** opcionais: embalagem, etiqueta, gás, energia, água, taxa de entrega, comissão e outros.
- **Cálculo automático** de custo da receita, custo por unidade, preço sugerido, lucro por unidade, lucro total, margem de lucro e markup.
- **Simulador de preços** com slider em tempo real.
- **Simulador de quantidade** (se eu vender 10, 20, 50, 100, 200, 500 unidades…).
- **Dashboard** com cartões de receita esperada, lucro, custo, preço ideal e margem.
- **Gráficos** (Chart.js): pizza com a composição dos custos e barras com custo × receita × lucro.
- **Salvamento automático** no LocalStorage.
- Botões de **Nova Receita**, **Duplicar Receita**, **Exportar PDF**, **Exportar Excel** e **Imprimir**.
- Interface moderna, tema claro, responsiva (desktop, tablet e celular).

## Como funciona o cálculo

- **Custo proporcional do ingrediente** = preço pago × (quantidade usada ÷ quantidade comprada), com conversão automática de unidades (kg ↔ g, litro ↔ ml).
- **Custo da receita** = soma dos ingredientes + custos adicionais.
- **Custo por unidade** = custo da receita ÷ unidades produzidas.
- **Preço sugerido** = custo por unidade × (1 + margem desejada ÷ 100).
- **Margem de lucro** = lucro ÷ preço de venda.
- **Markup** = preço de venda ÷ custo por unidade.

## Tecnologias

- HTML5, CSS3 e JavaScript (ES Modules) — sem build, sem dependências para instalar.
- [Chart.js](https://www.chartjs.org/) — gráficos.
- [jsPDF](https://github.com/parallax/jsPDF) + autoTable — exportação em PDF.
- [SheetJS](https://sheetjs.com/) — exportação em Excel.

## Estrutura do projeto

```
calculadora-massas/
├── index.html
├── assets/            # ícones e imagens
├── styles/            # main.css, components.css, print.css
└── js/
    ├── main.js        # inicialização da aplicação
    ├── state.js       # estado central + persistência
    ├── components/    # ingredientes, custos, dashboard, simuladores, gráficos, toolbar
    └── utils/         # cálculos, formatação, storage, exportação
```

## Rodando localmente

Basta servir a pasta com qualquer servidor estático:

```bash
npx serve .
# ou
python -m http.server 8000
```

E abrir `http://localhost:8000` no navegador.
