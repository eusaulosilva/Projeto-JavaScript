(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    const MS_PER_HOUR = 1000 * 60 * 60;
    const MS_PER_DAY = MS_PER_HOUR * 24;

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function getBirthdayUTC(year, birthMonth, birthDay) {
        const day = birthMonth === 1 && birthDay === 29 && !isLeapYear(year) ? 28 : birthDay;
        return Date.UTC(year, birthMonth, day);
    }

    function calculateAgeBreakdown(birthDateUTC, targetDateUTC) {
        const diffMs = targetDateUTC.getTime() - birthDateUTC.getTime();
        if (diffMs < 0) {
            throw new Error('A data final deve ser igual ou posterior à data de nascimento.');
        }

        const birthMonth = birthDateUTC.getUTCMonth();
        const birthDay = birthDateUTC.getUTCDate();
        const targetYear = targetDateUTC.getUTCFullYear();

        let years = targetYear - birthDateUTC.getUTCFullYear();
        const monthDiff = targetDateUTC.getUTCMonth() - birthMonth;
        const dayDiff = targetDateUTC.getUTCDate() - birthDay;

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            years -= 1;
        }

        const totalDays = Math.floor(diffMs / MS_PER_DAY);
        const totalHours = Math.floor(diffMs / MS_PER_HOUR);
        const totalWeeks = Math.floor(totalDays / 7);

        let nextBirthdayMs = getBirthdayUTC(targetYear, birthMonth, birthDay);
        if (nextBirthdayMs < targetDateUTC.getTime()) {
            nextBirthdayMs = getBirthdayUTC(targetYear + 1, birthMonth, birthDay);
        }
        const daysUntilNextBirthday = Math.round((nextBirthdayMs - targetDateUTC.getTime()) / MS_PER_DAY);

        return { years, totalDays, totalHours, totalWeeks, daysUntilNextBirthday };
    }

    App.calculators.idade = calculateAgeBreakdown;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('tool-form');
        const inicioInput = document.getElementById('data-nascimento');
        const fimInput = document.getElementById('data-atual');
        const resultEl = document.getElementById('result');
        const resetBtn = document.getElementById('btn-reset');

        if (!form) return;
        const { ui, validators } = App;
        const mode = form.dataset.mode === 'hours' ? 'hours' : 'days';

        ui.bindClearOnInput(form);
        if (fimInput && !fimInput.value) {
            fimInput.value = validators.todayISO();
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            ui.clearFormErrors(form);

            const birthDate = validators.parseISODateUTC(inicioInput.value);
            if (!birthDate) {
                ui.setFieldError(inicioInput, true);
                inicioInput.focus();
                ui.notify('Informe uma data de nascimento válida.');
                return;
            }

            const endDate = validators.parseISODateUTC(fimInput.value);
            if (!endDate) {
                ui.setFieldError(fimInput, true);
                fimInput.focus();
                ui.notify('Informe uma data atual/referência válida.');
                return;
            }

            if (endDate.getTime() < birthDate.getTime()) {
                ui.setFieldError(fimInput, true);
                fimInput.focus();
                ui.notify('A data atual não pode ser anterior à data de nascimento.');
                return;
            }

            const res = calculateAgeBreakdown(birthDate, endDate);
            const yearWord = res.years === 1 ? 'ano' : 'anos';

            const primaryMetric =
                mode === 'hours'
                    ? {
                          label: 'Total em Horas',
                          value: `${ui.formatInteger(res.totalHours)} horas`
                      }
                    : {
                          label: 'Total em Dias',
                          value: `${ui.formatInteger(res.totalDays)} dias`
                      };

            const nextBdayText =
                res.daysUntilNextBirthday === 0
                    ? 'Hoje!'
                    : `${ui.formatInteger(res.daysUntilNextBirthday)} ${res.daysUntilNextBirthday === 1 ? 'dia' : 'dias'}`;

            const birthdayBanner =
                res.daysUntilNextBirthday === 0
                    ? '<span class="status-badge status-badge--success">Feliz aniversário!</span>'
                    : '';

            ui.renderResult(
                resultEl,
                `
                <div class="result-grid">
                    <div class="metric-box">
                        <span class="metric-label">Idade Completa</span>
                        <span class="metric-value">${ui.formatInteger(res.years)} ${yearWord}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">${primaryMetric.label}</span>
                        <span class="metric-value is-highlight">${primaryMetric.value}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Semanas Vividas</span>
                        <span class="metric-value">${ui.formatInteger(res.totalWeeks)}</span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Próximo Aniversário</span>
                        <span class="metric-value">${nextBdayText}</span>
                    </div>
                </div>
                ${birthdayBanner}
                `
            );
        });

        resetBtn.addEventListener('click', () => {
            form.reset();
            if (fimInput) {
                fimInput.value = validators.todayISO();
            }
            ui.clearFormErrors(form);
            ui.resetResult(resultEl);
            inicioInput.focus();
        });
    });
})(typeof window !== 'undefined' ? window : globalThis);
