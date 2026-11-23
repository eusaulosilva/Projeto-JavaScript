(function (global) {
    'use strict';

    const App = (global.App = global.App || {});

    function parseNumber(raw) {
        if (raw === null || raw === undefined) return null;
        const normalized = String(raw).trim().replace(',', '.');
        if (normalized === '') return null;
        const num = Number(normalized);
        return Number.isFinite(num) ? num : NaN;
    }

    function validateNumber(input, options) {
        const opts = Object.assign(
            {
                label: 'Campo',
                required: true,
                min: null,
                max: null,
                positive: false,
                integer: false
            },
            options
        );

        const raw = typeof input === 'object' && input !== null ? input.value : input;
        const parsed = parseNumber(raw);

        const fail = (message) => {
            if (typeof input === 'object' && input !== null && App.ui) {
                App.ui.setFieldError(input, true);
                input.focus();
            }
            return { ok: false, value: null, message };
        };

        if (parsed === null) {
            if (opts.required) {
                return fail(`Preencha o campo "${opts.label}".`);
            }
            return { ok: true, value: null, message: '' };
        }

        if (Number.isNaN(parsed)) {
            return fail(`Informe um valor numérico válido em "${opts.label}".`);
        }

        if (opts.integer && !Number.isInteger(parsed)) {
            return fail(`O campo "${opts.label}" deve ser um número inteiro.`);
        }

        if (opts.positive && parsed <= 0) {
            return fail(`O campo "${opts.label}" deve ser maior que zero.`);
        }

        if (opts.min !== null && parsed < opts.min) {
            return fail(`O campo "${opts.label}" não pode ser menor que ${opts.min}.`);
        }

        if (opts.max !== null && parsed > opts.max) {
            return fail(`O campo "${opts.label}" não pode ser maior que ${opts.max}.`);
        }

        if (typeof input === 'object' && input !== null && App.ui) {
            App.ui.setFieldError(input, false);
        }

        return { ok: true, value: parsed, message: '' };
    }

    function parseISODateUTC(raw) {
        if (!raw || typeof raw !== 'string') return null;
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
        if (!match) return null;

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const timestamp = Date.UTC(year, month - 1, day);
        const date = new Date(timestamp);

        if (
            date.getUTCFullYear() !== year ||
            date.getUTCMonth() !== month - 1 ||
            date.getUTCDate() !== day
        ) {
            return null;
        }

        return date;
    }

    function todayISO() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    App.validators = {
        parseNumber,
        validateNumber,
        parseISODateUTC,
        todayISO
    };
})(typeof window !== 'undefined' ? window : globalThis);
