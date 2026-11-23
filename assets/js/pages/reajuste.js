(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function calculateSalaryAdjustment(salary, percentage) {
        const increase = (percentage / 100) * salary;
        const newSalary = salary + increase;
        return { salary, percentage, increase, newSalary };
    }

    App.calculators.reajuste = calculateSalaryAdjustment;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const salarioInput = document.getElementById('salario');
        const percentualInput = document.getElementById('percentual');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const salario = validators.validateNumber(salarioInput, {
                label: 'Salário Atual',
                positive: true
            });
            if (!salario.ok) {
                ui.notify(salario.message);
                return;
            }

            const percentual = validators.validateNumber(percentualInput, {
                label: 'Percentual de Reajuste',
                min: 0,
                max: 1000
            });
            if (!percentual.ok) {
                ui.notify(percentual.message);
                return;
            }

            const res = calculateSalaryAdjustment(salario.value, percentual.value);

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Valor do Aumento</span>
                        <span class="metric-value">${ui.formatCurrency(res.increase)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Salário Reajustado</span>
                        <span class="metric-value is-highlight">${ui.formatCurrency(res.newSalary)}</span>
                    </div>
                </div>
                `
            );
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            salarioInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
