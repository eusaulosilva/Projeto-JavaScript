(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    const THEME_STORAGE_KEY = 'projeto-js:theme';

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    const integerFormatter = new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 0
    });

    const storage = {
        get(key, fallback) {
            try {
                if (!global.localStorage) return fallback;
                const raw = global.localStorage.getItem(key);
                return raw === null ? fallback : JSON.parse(raw);
            } catch (_) {
                return fallback;
            }
        },
        set(key, value) {
            try {
                if (!global.localStorage) return;
                global.localStorage.setItem(key, JSON.stringify(value));
            } catch (_) {
                // Ignora indisponibilidade de storage (ex.: modo privado restrito)
            }
        },
        remove(key) {
            try {
                if (!global.localStorage) return;
                global.localStorage.removeItem(key);
            } catch (_) {
                // noop
            }
        }
    };

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

    async function copyText(text) {
        try {
            if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
                await global.navigator.clipboard.writeText(String(text));
                return true;
            }
        } catch (_) {
            // fallback abaixo
        }

        if (typeof document === 'undefined') return false;
        const textarea = document.createElement('textarea');
        textarea.value = String(text);
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (_) {
            copied = false;
        }
        textarea.remove();
        return copied;
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

    function applyTheme(theme) {
        if (typeof document === 'undefined') return;
        const normalized = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.dataset.theme = normalized;
        storage.set(THEME_STORAGE_KEY, normalized);

        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            const isDark = normalized === 'dark';
            toggleBtn.setAttribute('aria-label', isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro');
            toggleBtn.setAttribute('title', isDark ? 'Tema claro' : 'Tema escuro');
            toggleBtn.innerHTML = isDark
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
    }

    function initThemeToggle() {
        if (typeof document === 'undefined') return;
        const saved = storage.get(THEME_STORAGE_KEY, 'light');
        applyTheme(saved);

        if (document.getElementById('theme-toggle')) return;

        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.type = 'button';
        button.className = 'theme-toggle';

        button.addEventListener('click', () => {
            const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });

        const topNav = document.querySelector('.top-nav');
        if (topNav) {
            topNav.appendChild(button);
        } else {
            button.classList.add('theme-toggle--floating');
            document.body.appendChild(button);
        }

        applyTheme(saved);
    }

    if (typeof document !== 'undefined') {
        const savedTheme = storage.get(THEME_STORAGE_KEY, 'light');
        document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    }

    App.ui = {
        storage,
        notify,
        copyText,
        formatCurrency,
        formatNumber,
        formatCompactNumber,
        formatInteger,
        escapeHtml,
        renderResult,
        resetResult,
        setFieldError,
        clearFormErrors,
        bindClearOnInput,
        applyTheme
    };
})(typeof window !== 'undefined' ? window : globalThis);
