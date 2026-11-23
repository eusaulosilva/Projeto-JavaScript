(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    function calculateTip(billAmount, tipPercent, people) {
        const rate = typeof tipPercent === 'number' ? tipPercent : 10;
        const count = typeof people === 'number' && people >= 1 ? Math.trunc(people) : 1;
        const tip = billAmount * (rate / 100);
        const total = billAmount + tip;
        const perPerson = total / count;

        return {
            billAmount,
            tipPercent: rate,
            tip,
            total,
            people: count,
            perPerson
        };
    }

    App.calculators.gorjeta = calculateTip;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const contaInput = document.getElementById('valor-conta');
        const taxaInput = document.getElementById('taxa-gorjeta');
        const pessoasInput = document.getElementById('pessoas');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        ui.bindClearOnInput(form);

        let lastSummaryText = '';

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const conta = validators.validateNumber(contaInput, {
                label: 'Valor da Conta',
                positive: true
            });
            if (!conta.ok) {
                ui.notify(conta.message);
                return;
            }

            const taxa = validators.validateNumber(taxaInput, {
                label: 'Taxa do Garçom (%)',
                min: 0,
                max: 100
            });
            if (!taxa.ok) {
                ui.notify(taxa.message);
                return;
            }

            const pessoas = validators.validateNumber(pessoasInput, {
                label: 'Número de Pessoas',
                integer: true,
                min: 1,
                max: 200
            });
            if (!pessoas.ok) {
                ui.notify(pessoas.message);
                return;
            }

            const res = calculateTip(conta.value, taxa.value, pessoas.value);
            const perPersonBlock =
                res.people > 1
                    ? `
                    <div class="metric-box">
                        <span class="metric-label">Por Pessoa (${res.people}x)</span>
                        <span class="metric-value is-highlight">${ui.formatCurrency(res.perPerson)}</span>
                    </div>`
                    : '';

            lastSummaryText =
                res.people > 1
                    ? `Conta: ${ui.formatCurrency(res.billAmount)} | Gorjeta (${ui.formatCompactNumber(res.tipPercent, 1)}%): ${ui.formatCurrency(res.tip)} | Total: ${ui.formatCurrency(res.total)} (${res.people}x de ${ui.formatCurrency(res.perPerson)})`
                    : `Conta: ${ui.formatCurrency(res.billAmount)} | Gorjeta (${ui.formatCompactNumber(res.tipPercent, 1)}%): ${ui.formatCurrency(res.tip)} | Total: ${ui.formatCurrency(res.total)}`;

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Consumo</span>
                        <span class="metric-value">${ui.formatCurrency(res.billAmount)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Gorjeta (${ui.formatCompactNumber(res.tipPercent, 1)}%)</span>
                        <span class="metric-value">${ui.formatCurrency(res.tip)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Total a Pagar</span>
                        <span class="metric-value is-highlight">${ui.formatCurrency(res.total)}</span>
                    </div>
                    ${perPersonBlock}
                </div>
                <div class="result-footer">
                    <button type="button" class="btn-copy" data-copy-result>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copiar resumo
                    </button>
                </div>
                `
            );
        });

        resultEl.addEventListener('click', async (event) => {
            if (!event.target.closest('[data-copy-result]') || !lastSummaryText) return;
            const copied = await ui.copyText(lastSummaryText);
            if (copied) {
                ui.notify('Resumo da conta copiado.', {
                    type: 'success',
                    title: 'Copiado',
                    duration: 2400
                });
            }
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            lastSummaryText = '';
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            contaInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
