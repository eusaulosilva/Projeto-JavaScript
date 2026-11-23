(function (global) {
    'use strict';

    const App = (global.App = global.App || {});

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    const integerFormatter = new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 0
    });

    function getToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.setAttribute('aria-live', 'assertive');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        }
        return container;
    }

    function notify(message, options) {
        const opts = Object.assign(
            {
                type: 'error',
                title: 'Atenção',
                duration: 4200
            },
            options
        );

        const container = getToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast--${opts.type}`;
        toast.setAttribute('role', 'alert');

        const body = document.createElement('div');
        body.className = 'toast-body';

        if (opts.title) {
            const titleEl = document.createElement('span');
            titleEl.className = 'toast-title';
            titleEl.textContent = opts.title;
            body.appendChild(titleEl);
        }

        const textEl = document.createElement('span');
        textEl.textContent = message;
        body.appendChild(textEl);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'toast-close';
        closeBtn.setAttribute('aria-label', 'Fechar notificação');
        closeBtn.textContent = '×';

        const dismiss = () => {
            if (toast.classList.contains('is-leaving')) return;
            toast.classList.add('is-leaving');
            global.setTimeout(() => toast.remove(), 200);
        };

        closeBtn.addEventListener('click', dismiss);

        toast.appendChild(body);
        toast.appendChild(closeBtn);
        container.appendChild(toast);

        if (opts.duration > 0) {
            global.setTimeout(dismiss, opts.duration);
        }
    }

    function formatCurrency(value) {
        return currencyFormatter.format(Number(value) || 0);
    }

    function formatNumber(value, decimals) {
        const digits = typeof decimals === 'number' ? decimals : 2;
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        }).format(Number(value));
    }

    function formatCompactNumber(value, maxDecimals) {
        const digits = typeof maxDecimals === 'number' ? maxDecimals : 4;
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: digits
        }).format(Number(value));
    }

    function formatInteger(value) {
        return integerFormatter.format(Math.trunc(Number(value) || 0));
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderResult(container, html) {
        if (!container) return;
        container.innerHTML = html;
        container.classList.add('has-result');
    }

    function resetResult(container, placeholder) {
        if (!container) return;
        const text = placeholder || 'Preencha os dados acima para ver o resultado.';
        container.innerHTML = `<p class="result-placeholder">${escapeHtml(text)}</p>`;
        container.classList.remove('has-result');
    }

    function setFieldError(input, isInvalid) {
        if (!input) return;
        input.classList.toggle('is-invalid', Boolean(isInvalid));
        if (isInvalid) {
            input.setAttribute('aria-invalid', 'true');
        } else {
            input.removeAttribute('aria-invalid');
        }
    }

    function clearFormErrors(form) {
        if (!form) return;
        form.querySelectorAll('.is-invalid').forEach((el) => {
            el.classList.remove('is-invalid');
            el.removeAttribute('aria-invalid');
        });
    }

    function bindClearOnInput(form) {
        if (!form) return;
        form.addEventListener('input', (event) => {
            if (event.target.classList.contains('is-invalid')) {
                setFieldError(event.target, false);
            }
        });
        form.addEventListener('change', (event) => {
            if (event.target.classList.contains('is-invalid')) {
                setFieldError(event.target, false);
            }
        });
    }

    App.ui = {
        notify,
        formatCurrency,
        formatNumber,
        formatCompactNumber,
        formatInteger,
        escapeHtml,
        renderResult,
        resetResult,
        setFieldError,
        clearFormErrors,
        bindClearOnInput
    };
})(typeof window !== 'undefined' ? window : globalThis);
