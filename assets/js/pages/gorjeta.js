(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    const TIP_RATE = 0.1;

    function calculateTip(billAmount) {
        const tip = billAmount * TIP_RATE;
        const total = billAmount + tip;
        return { billAmount, tip, total };
    }

    App.calculators.gorjeta = calculateTip;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const contaInput = document.getElementById('valor-conta');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const conta = validators.validateNumber(contaInput, {
                label: 'Valor da Conta',
                positive: true
            });
            if (!conta.ok) {
                ui.notify(conta.message);
                return;
            }

            const res = calculateTip(conta.value);

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Consumo</span>
                        <span class="metric-value">${ui.formatCurrency(res.billAmount)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">10% do Garçom</span>
                        <span class="metric-value">${ui.formatCurrency(res.tip)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Total a Pagar</span>
                        <span class="metric-value is-highlight">${ui.formatCurrency(res.total)}</span>
                    </div>
                </div>
                `
            );
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            contaInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
