(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function calculateCarCost(factoryCost, distributorPct, taxPct) {
        const distributorValue = (distributorPct / 100) * factoryCost;
        const taxValue = (taxPct / 100) * factoryCost;
        const finalCost = factoryCost + distributorValue + taxValue;

        return {
            factoryCost,
            distributorValue,
            taxValue,
            finalCost
        };
    }

    App.calculators.custoCarro = calculateCarCost;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const fabricaInput = document.getElementById('custo-fabrica');
        const distribuidorInput = document.getElementById('percentual-distribuidor');
        const impostosInput = document.getElementById('percentual-impostos');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const fabrica = validators.validateNumber(fabricaInput, {
                label: 'Valor de Fábrica',
                positive: true
            });
            if (!fabrica.ok) {
                ui.notify(fabrica.message);
                return;
            }

            const distribuidor = validators.validateNumber(distribuidorInput, {
                label: 'Porcentagem do Distribuidor',
                min: 0,
                max: 1000
            });
            if (!distribuidor.ok) {
                ui.notify(distribuidor.message);
                return;
            }

            const impostos = validators.validateNumber(impostosInput, {
                label: 'Impostos',
                min: 0,
                max: 1000
            });
            if (!impostos.ok) {
                ui.notify(impostos.message);
                return;
            }

            const res = calculateCarCost(fabrica.value, distribuidor.value, impostos.value);

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Distribuidor (${ui.formatCompactNumber(distribuidor.value, 2)}%)</span>
                        <span class="metric-value">${ui.formatCurrency(res.distributorValue)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Impostos (${ui.formatCompactNumber(impostos.value, 2)}%)</span>
                        <span class="metric-value">${ui.formatCurrency(res.taxValue)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Custo Final</span>
                        <span class="metric-value is-highlight">${ui.formatCurrency(res.finalCost)}</span>
                    </div>
                </div>
                `
            );
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            fabricaInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
