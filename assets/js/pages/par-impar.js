(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function checkParity(number) {
        if (!Number.isInteger(number)) {
            throw new Error('O número deve ser inteiro.');
        }
        const isEven = number % 2 === 0;
        return {
            number,
            isEven,
            label: isEven ? 'PAR' : 'ÍMPAR'
        };
    }

    App.calculators.parImpar = checkParity;

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
                label: 'Número Inteiro',
                integer: true
            });
            if (!num.ok) {
                ui.notify(num.message);
                return;
            }

            const res = checkParity(num.value);
            const variant = res.isEven ? 'success' : 'info';

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Número</span>
                        <span class="metric-value">${ui.formatInteger(res.number)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Classificação</span>
                        <span class="metric-value is-highlight">${res.label}</span>
                    </div>
                </div>
                <span class="status-badge status-badge--${variant}">
                    O número ${ui.formatInteger(res.number)} é ${res.label}.
                </span>
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
