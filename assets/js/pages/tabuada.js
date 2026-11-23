(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function generateTabuada(base, operator) {
        if (operator === '/' && base === 0) {
            throw new Error('Não é possível gerar tabuada de divisão por zero.');
        }

        const rows = [];
        for (let i = 0; i <= 10; i += 1) {
            let expression;
            let answer;

            switch (operator) {
                case '+':
                    answer = base + i;
                    expression = `${base} + ${i}`;
                    break;
                case '-':
                    answer = i;
                    expression = `${base + i} − ${base}`;
                    break;
                case '*':
                    answer = base * i;
                    expression = `${base} × ${i}`;
                    break;
                case '/':
                    answer = i;
                    expression = `${base * i} ÷ ${base}`;
                    break;
                default:
                    throw new Error('Operador inválido.');
            }

            rows.push({ expression, answer });
        }

        return rows;
    }

    App.calculators.tabuada = generateTabuada;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const numeroInput = document.getElementById('numero');
        const operadorSelect = document.getElementById('operador');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const numCheck = validators.validateNumber(numeroInput, {
                label: 'Número',
                integer: true,
                min: -100000,
                max: 100000
            });
            if (!numCheck.ok) {
                ui.notify(numCheck.message);
                return;
            }

            const operador = operadorSelect.value;
            if (!operador) {
                ui.setFieldError(operadorSelect, true);
                operadorSelect.focus();
                ui.notify('Selecione um operador matemático.');
                return;
            }

            if (operador === '/' && numCheck.value === 0) {
                ui.setFieldError(numeroInput, true);
                numeroInput.focus();
                ui.notify('Não é possível dividir por zero. Informe outro número.');
                return;
            }

            const rows = generateTabuada(numCheck.value, operador);
            const itemsHtml = rows
                .map((row) => `<li>${ui.escapeHtml(row.expression)} = <strong>${row.answer}</strong></li>`)
                .join('');

            ui.renderResult(resultEl, `<ul class="tabuada-list">${itemsHtml}</ul>`);
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            numeroInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
