(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function calculateNeighbors(number) {
        if (!Number.isInteger(number)) {
            throw new Error('O número deve ser inteiro.');
        }
        return {
            number,
            predecessor: number - 1,
            successor: number + 1
        };
    }

    App.calculators.antecessor = calculateNeighbors;

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

            const res = calculateNeighbors(num.value);

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Antecessor</span>
                        <span class="metric-value is-highlight">${ui.formatInteger(res.predecessor)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Número</span>
                        <span class="metric-value">${ui.formatInteger(res.number)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Sucessor</span>
                        <span class="metric-value">${ui.formatInteger(res.successor)}</span>
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
