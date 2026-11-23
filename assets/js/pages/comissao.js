(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    const COMMISSION_RATE = 0.05;
    const STORAGE_KEY = 'projeto-js:comissao-state';

    function calculateCommissionSummary(baseSalary, carValues) {
        const count = carValues.length;
        const totalSales = carValues.reduce((acc, value) => acc + value, 0);
        const totalCommission = totalSales * COMMISSION_RATE;
        const finalSalary = baseSalary + totalCommission;

        return {
            count,
            totalSales,
            totalCommission,
            finalSalary
        };
    }

    App.calculators.comissao = calculateCommissionSummary;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const salarioInput = document.getElementById('salario');
        const valorCarroInput = document.getElementById('valor-carro');
        const clearCarBtn = document.getElementById('btn-clear-car');
        const resetBtn = document.getElementById('btn-reset');
        const resultEl = document.getElementById('result');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        const saved = ui.storage.get(STORAGE_KEY, null);
        let sales =
            saved && Array.isArray(saved.sales)
                ? saved.sales.filter((n) => typeof n === 'number' && Number.isFinite(n) && n > 0)
                : [];
        let lastSalary =
            saved && typeof saved.salary === 'number' && Number.isFinite(saved.salary) && saved.salary >= 0
                ? saved.salary
                : 0;

        if (sales.length > 0 && salarioInput) {
            salarioInput.value = String(lastSalary);
        }

        function persist() {
            if (sales.length === 0) {
                ui.storage.remove(STORAGE_KEY);
            } else {
                ui.storage.set(STORAGE_KEY, { salary: lastSalary, sales });
            }
        }

        function renderSummary() {
            if (sales.length === 0) {
                ui.resetResult(resultEl, 'Informe o salário fixo e adicione o valor dos carros vendidos.');
                return;
            }

            const summary = calculateCommissionSummary(lastSalary, sales);
            const chipsHtml = sales
                .map(
                    (value, index) => `
                    <span class="chip">
                        #${index + 1}: ${ui.formatCurrency(value)}
                        <button type="button" data-remove-index="${index}" aria-label="Remover venda ${index + 1}">×</button>
                    </span>
                `
                )
                .join('');

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Carros Vendidos</span>
                        <span class="metric-value">${summary.count}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Comissão (5%)</span>
                        <span class="metric-value">${ui.formatCurrency(summary.totalCommission)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Salário Final</span>
                        <span class="metric-value is-highlight">${ui.formatCurrency(summary.finalSalary)}</span>
                    </div>
                </div>
                <div class="chip-list" aria-label="Vendas registradas">${chipsHtml}</div>
                `
            );
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const salario = validators.validateNumber(salarioInput, {
                label: 'Salário Fixo',
                min: 0
            });
            if (!salario.ok) {
                ui.notify(salario.message);
                return;
            }

            const valorCarro = validators.validateNumber(valorCarroInput, {
                label: 'Valor do Carro',
                positive: true
            });
            if (!valorCarro.ok) {
                ui.notify(valorCarro.message);
                return;
            }

            lastSalary = salario.value;
            sales.push(valorCarro.value);
            persist();
            valorCarroInput.value = '';
            valorCarroInput.focus();
            renderSummary();
        });

        resultEl.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-remove-index]');
            if (!btn) return;
            const index = Number(btn.dataset.removeIndex);
            if (Number.isInteger(index) && index >= 0 && index < sales.length) {
                sales.splice(index, 1);
                persist();
                renderSummary();
            }
        });

        clearCarBtn.addEventListener('click', () => {
            valorCarroInput.value = '';
            ui.setFieldError(valorCarroInput, false);
            valorCarroInput.focus();
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            sales = [];
            lastSalary = 0;
            persist();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl, 'Informe o salário fixo e adicione o valor dos carros vendidos.');
            salarioInput.focus();
        });

        if (sales.length > 0) {
            renderSummary();
        }
    });
})(typeof window !== 'undefined' ? window : globalThis);
