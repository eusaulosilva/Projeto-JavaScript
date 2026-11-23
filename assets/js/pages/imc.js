(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function calculateImc(peso, altura) {
        const value = peso / (altura * altura);
        let classification;
        let variant;

        if (value < 18.5) {
            classification = 'Abaixo do peso';
            variant = 'info';
        } else if (value < 25) {
            classification = 'Peso normal';
            variant = 'success';
        } else if (value < 30) {
            classification = 'Sobrepeso';
            variant = 'warning';
        } else if (value < 35) {
            classification = 'Obesidade Grau I';
            variant = 'danger';
        } else if (value < 40) {
            classification = 'Obesidade Grau II';
            variant = 'danger';
        } else {
            classification = 'Obesidade Grau III';
            variant = 'danger';
        }

        return { imc: value, classification, variant };
    }

    App.calculators.imc = calculateImc;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const pesoInput = document.getElementById('peso');
        const alturaInput = document.getElementById('altura');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const pesoCheck = validators.validateNumber(pesoInput, {
                label: 'Peso (kg)',
                positive: true,
                max: 600
            });
            if (!pesoCheck.ok) {
                ui.notify(pesoCheck.message);
                return;
            }

            const alturaCheck = validators.validateNumber(alturaInput, {
                label: 'Altura (m)',
                positive: true
            });
            if (!alturaCheck.ok) {
                ui.notify(alturaCheck.message);
                return;
            }

            if (alturaCheck.value > 3) {
                ui.setFieldError(alturaInput, true);
                alturaInput.focus();
                ui.notify('Informe a altura em metros (ex.: 1,75 em vez de 175).');
                return;
            }

            if (alturaCheck.value < 0.4) {
                ui.setFieldError(alturaInput, true);
                alturaInput.focus();
                ui.notify('Informe uma altura válida em metros (mínimo 0,40 m).');
                return;
            }

            const { imc, classification, variant } = calculateImc(
                pesoCheck.value,
                alturaCheck.value
            );

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Peso</span>
                        <span class="metric-value">${ui.formatNumber(pesoCheck.value, 1)} kg</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Altura</span>
                        <span class="metric-value">${ui.formatNumber(alturaCheck.value, 2)} m</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">IMC</span>
                        <span class="metric-value is-highlight">${ui.formatNumber(imc, 1)}</span>
                    </div>
                </div>
                <span class="status-badge status-badge--${variant}">
                    Classificação (OMS): ${classification}
                </span>
                `
            );
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            pesoInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
