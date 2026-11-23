(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function calculateIdealWeight(heightMeters, gender) {
        if (gender === 'masculino') {
            return 72.7 * heightMeters - 58;
        }
        if (gender === 'feminino') {
            return 62.1 * heightMeters - 44.7;
        }
        throw new Error('Gênero inválido.');
    }

    App.calculators.pesoIdeal = calculateIdealWeight;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const alturaInput = document.getElementById('altura');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const alturaCheck = validators.validateNumber(alturaInput, {
                label: 'Altura (m)',
                positive: true
            });
            if (!alturaCheck.ok) {
                ui.notify(alturaCheck.message);
                return;
            }

            if (alturaCheck.value > 2.8) {
                ui.setFieldError(alturaInput, true);
                alturaInput.focus();
                ui.notify('Informe a altura em metros (ex.: 1,70 em vez de 170).');
                return;
            }

            if (alturaCheck.value < 0.9) {
                ui.setFieldError(alturaInput, true);
                alturaInput.focus();
                ui.notify('Esta fórmula é válida para alturas a partir de 0,90 m.');
                return;
            }

            const selectedGender = form.querySelector('input[name="genero"]:checked');
            if (!selectedGender) {
                ui.notify('Selecione o sexo biológico (Masculino ou Feminino).');
                return;
            }

            const gender = selectedGender.value;
            const idealWeight = calculateIdealWeight(alturaCheck.value, gender);
            const label = gender === 'masculino' ? 'Homem' : 'Mulher';

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Altura</span>
                        <span class="metric-value">${ui.formatNumber(alturaCheck.value, 2)} m</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Referência</span>
                        <span class="metric-value">${label}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Peso Ideal</span>
                        <span class="metric-value is-highlight">${ui.formatNumber(idealWeight, 2)} kg</span>
                    </div>
                </div>
                `
            );
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            alturaInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
