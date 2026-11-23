(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function calculateElection(validVotes, nullVotes, blankVotes) {
        const total = validVotes + nullVotes + blankVotes;
        if (total === 0) {
            return {
                total: 0,
                validPct: 0,
                nullPct: 0,
                blankPct: 0
            };
        }

        return {
            total,
            validPct: (validVotes / total) * 100,
            nullPct: (nullVotes / total) * 100,
            blankPct: (blankVotes / total) * 100
        };
    }

    App.calculators.eleicao = calculateElection;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const validosInput = document.getElementById('votos-validos');
        const nulosInput = document.getElementById('votos-nulos');
        const brancosInput = document.getElementById('votos-brancos');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const validos = validators.validateNumber(validosInput, {
                label: 'Votos Válidos',
                min: 0,
                integer: true
            });
            if (!validos.ok) {
                ui.notify(validos.message);
                return;
            }

            const nulos = validators.validateNumber(nulosInput, {
                label: 'Votos Nulos',
                min: 0,
                integer: true
            });
            if (!nulos.ok) {
                ui.notify(nulos.message);
                return;
            }

            const brancos = validators.validateNumber(brancosInput, {
                label: 'Votos Brancos',
                min: 0,
                integer: true
            });
            if (!brancos.ok) {
                ui.notify(brancos.message);
                return;
            }

            const res = calculateElection(validos.value, nulos.value, brancos.value);
            if (res.total === 0) {
                ui.notify('O total de votos precisa ser maior que zero para calcular os percentuais.');
                return;
            }

            ui.renderResult(
                resultEl,
                `
                <div class="metric-box">
                    <span class="metric-label">Total de Eleitores</span>
                    <span class="metric-value is-highlight">${ui.formatInteger(res.total)} votos</span>
                </div>
                <div class="bar-list">
                    <div>
                        <div class="bar-item-header">
                            <span>Votos Válidos (${ui.formatInteger(validos.value)})</span>
                            <strong>${ui.formatNumber(res.validPct, 1)}%</strong>
                        </div>
                        <div class="bar-track">
                            <div class="bar-fill bar-fill--valid" style="width: ${res.validPct.toFixed(1)}%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="bar-item-header">
                            <span>Votos Nulos (${ui.formatInteger(nulos.value)})</span>
                            <strong>${ui.formatNumber(res.nullPct, 1)}%</strong>
                        </div>
                        <div class="bar-track">
                            <div class="bar-fill bar-fill--null" style="width: ${res.nullPct.toFixed(1)}%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="bar-item-header">
                            <span>Votos Brancos (${ui.formatInteger(brancos.value)})</span>
                            <strong>${ui.formatNumber(res.blankPct, 1)}%</strong>
                        </div>
                        <div class="bar-track">
                            <div class="bar-fill bar-fill--blank" style="width: ${res.blankPct.toFixed(1)}%"></div>
                        </div>
                    </div>
                </div>
                `
            );
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            validosInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
