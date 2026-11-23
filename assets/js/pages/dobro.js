(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function calculateDouble(value) {
        return value * 2;
    }

    App.calculators.dobro = calculateDouble;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const numeroInput = document.getElementById('numero');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const num = validators.validateNumber(numeroInput, {
                label: 'Número'
            });
            if (!num.ok) {
                ui.notify(num.message);
                return;
            }

            const result = calculateDouble(num.value);

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Número Informado</span>
                        <span class="metric-value">${ui.formatCompactNumber(num.value, 6)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Dobro</span>
                        <span class="metric-value is-highlight">${ui.formatCompactNumber(result, 6)}</span>
                    </div>
                </div>
                `
            );
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            numeroInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
