(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    const STORAGE_KEY = 'projeto-js:media-grades';

    function calculateAverage(grades) {
        if (!Array.isArray(grades) || grades.length === 0) {
            return { count: 0, sum: 0, average: 0 };
        }
        const sum = grades.reduce((acc, grade) => acc + grade, 0);
        return {
            count: grades.length,
            sum,
            average: sum / grades.length
        };
    }

    App.calculators.media = calculateAverage;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const notaInput = document.getElementById('nota');
        const clearNoteBtn = document.getElementById('btn-clear-note');
        const resetBtn = document.getElementById('btn-reset');
        const resultEl = document.getElementById('result');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        const saved = ui.storage.get(STORAGE_KEY, []);
        let grades = Array.isArray(saved) ? saved.filter((n) => typeof n === 'number' && Number.isFinite(n)) : [];

        function persist() {
            if (grades.length === 0) {
                ui.storage.remove(STORAGE_KEY);
            } else {
                ui.storage.set(STORAGE_KEY, grades);
            }
        }

        function renderSummary() {
            if (grades.length === 0) {
                ui.resetResult(resultEl, 'Adicione uma ou mais notas para calcular a média.');
                return;
            }

            const res = calculateAverage(grades);
            const chipsHtml = grades
                .map(
                    (grade, index) => `
                    <span class="chip">
                        Nota ${index + 1}: ${ui.formatCompactNumber(grade, 2)}
                        <button type="button" data-remove-index="${index}" aria-label="Remover nota ${index + 1}">×</button>
                    </span>
                `
                )
                .join('');

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Quantidade</span>
                        <span class="metric-value">${res.count}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Soma</span>
                        <span class="metric-value">${ui.formatCompactNumber(res.sum, 2)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Média</span>
                        <span class="metric-value is-highlight">${ui.formatNumber(res.average, 2)}</span>
                    </div>
                </div>
                <div class="chip-list" aria-label="Notas adicionadas">${chipsHtml}</div>
                `
            );
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const nota = validators.validateNumber(notaInput, {
                label: 'Nota',
                min: 0,
                max: 100
            });
            if (!nota.ok) {
                ui.notify(nota.message);
                return;
            }

            grades.push(nota.value);
            persist();
            notaInput.value = '';
            notaInput.focus();
            renderSummary();
        });

        resultEl.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-remove-index]');
            if (!btn) return;
            const index = Number(btn.dataset.removeIndex);
            if (Number.isInteger(index) && index >= 0 && index < grades.length) {
                grades.splice(index, 1);
                persist();
                renderSummary();
            }
        });

        clearNoteBtn.addEventListener('click', () => {
            notaInput.value = '';
            ui.setFieldError(notaInput, false);
            notaInput.focus();
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            grades = [];
            persist();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl, 'Adicione uma ou mais notas para calcular a média.');
            notaInput.focus();
        });

        if (grades.length > 0) {
            renderSummary();
        }
    });
})(typeof window !== 'undefined' ? window : globalThis);
