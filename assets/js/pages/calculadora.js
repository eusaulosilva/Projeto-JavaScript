(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    const HISTORY_KEY = 'projeto-js:calc-history';
    const MAX_HISTORY = 5;

    /**
     * Avaliador aritmético seguro (recursive descent), sem código dinâmico.
     * Suporta +, -, *, /, %, parênteses ( ), decimais e operador unário (+/-).
     */
    function evaluateExpression(expression) {
        const sanitized = String(expression).replace(/\s+/g, '');
        if (!sanitized) {
            throw new Error('Expressão vazia.');
        }

        const tokens = [];
        let index = 0;

        while (index < sanitized.length) {
            const ch = sanitized[index];
            if ((ch >= '0' && ch <= '9') || ch === '.') {
                let numStr = '';
                let dotCount = 0;
                while (
                    index < sanitized.length &&
                    ((sanitized[index] >= '0' && sanitized[index] <= '9') || sanitized[index] === '.')
                ) {
                    if (sanitized[index] === '.') {
                        dotCount += 1;
                        if (dotCount > 1) {
                            throw new Error('Número decimal inválido.');
                        }
                    }
                    numStr += sanitized[index];
                    index += 1;
                }
                if (numStr === '.') {
                    throw new Error('Número decimal inválido.');
                }
                tokens.push({ type: 'number', value: Number(numStr) });
            } else if ('+-*/%'.includes(ch)) {
                tokens.push({ type: 'op', value: ch });
                index += 1;
            } else if (ch === '(' || ch === ')') {
                tokens.push({ type: 'paren', value: ch });
                index += 1;
            } else {
                throw new Error('Caractere inválido na expressão.');
            }
        }

        let pos = 0;

        function peek() {
            return tokens[pos] || null;
        }

        function consume() {
            const token = tokens[pos];
            pos += 1;
            return token;
        }

        function parseExpression() {
            let value = parseTerm();
            while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
                const op = consume().value;
                const right = parseTerm();
                value = op === '+' ? value + right : value - right;
            }
            return value;
        }

        function parseTerm() {
            let value = parseUnary();
            while (peek() && peek().type === 'op' && (peek().value === '*' || peek().value === '/')) {
                const op = consume().value;
                const right = parseUnary();
                if (op === '/') {
                    if (right === 0) {
                        throw new Error('Divisão por zero não é permitida.');
                    }
                    value /= right;
                } else {
                    value *= right;
                }
            }
            return value;
        }

        function parseUnary() {
            const token = peek();
            if (!token) {
                throw new Error('Expressão incompleta.');
            }
            if (token.type === 'op' && token.value === '+') {
                consume();
                return parseUnary();
            }
            if (token.type === 'op' && token.value === '-') {
                consume();
                return -parseUnary();
            }
            return parsePostfix();
        }

        function parsePostfix() {
            let value = parsePrimary();
            while (peek() && peek().type === 'op' && peek().value === '%') {
                consume();
                value /= 100;
            }
            return value;
        }

        function parsePrimary() {
            const token = peek();
            if (!token) {
                throw new Error('Expressão incompleta.');
            }
            if (token.type === 'number') {
                consume();
                return token.value;
            }
            if (token.type === 'paren' && token.value === '(') {
                consume();
                const inner = parseExpression();
                const closing = peek();
                if (!closing || closing.type !== 'paren' || closing.value !== ')') {
                    throw new Error('Parênteses desbalanceados.');
                }
                consume();
                return inner;
            }
            throw new Error('Expressão inválida.');
        }

        const rawResult = parseExpression();
        if (pos !== tokens.length || !Number.isFinite(rawResult)) {
            throw new Error('Expressão inválida.');
        }

        // Remove ruído de ponto flutuante (ex.: 0.1 + 0.2 -> 0.3)
        return Number(rawResult.toPrecision(12));
    }

    App.calculators.evaluateExpression = evaluateExpression;

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const displayEl = document.getElementById('calc-output');
        const expressionEl = document.getElementById('calc-expression');
        const keypad = document.getElementById('calc-keypad');
        const copyBtn = document.getElementById('calc-copy');
        const backspaceTopBtn = document.getElementById('calc-backspace');
        const historySection = document.getElementById('calc-history');
        const historyList = document.getElementById('calc-history-list');
        const clearHistoryBtn = document.getElementById('calc-clear-history');

        if (!displayEl || !keypad) return;
        const { ui } = App;

        let currentExpr = '';
        let lastEvaluated = false;
        let history = ui.storage.get(HISTORY_KEY, []);
        if (!Array.isArray(history)) history = [];

        const OPERATORS = new Set(['+', '-', '*', '/']);

        function formatForDisplay(expr) {
            if (!expr) return '0';
            return expr.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
        }

        function updateDisplay(historyText) {
            displayEl.textContent = formatForDisplay(currentExpr);
            if (typeof historyText === 'string') {
                expressionEl.textContent = historyText;
            }
        }

        function renderHistory() {
            if (!historySection || !historyList) return;
            if (history.length === 0) {
                historySection.hidden = true;
                historyList.innerHTML = '';
                return;
            }
            historySection.hidden = false;
            historyList.innerHTML = history
                .map(
                    (entry, idx) => `
                    <li>
                        <button type="button" class="calc-history-item" data-history-index="${idx}" title="Reutilizar resultado">
                            <span>${ui.escapeHtml(entry.expression)}</span>
                            <strong>= ${ui.escapeHtml(entry.result)}</strong>
                        </button>
                    </li>
                `
                )
                .join('');
        }

        function pushHistory(exprDisplay, resultStr) {
            history.unshift({ expression: exprDisplay, result: resultStr });
            if (history.length > MAX_HISTORY) {
                history = history.slice(0, MAX_HISTORY);
            }
            ui.storage.set(HISTORY_KEY, history);
            renderHistory();
        }

        function appendValue(val) {
            if (lastEvaluated) {
                if (OPERATORS.has(val) || val === '%') {
                    lastEvaluated = false;
                } else {
                    currentExpr = '';
                    expressionEl.textContent = '';
                    lastEvaluated = false;
                }
            }

            const lastChar = currentExpr[currentExpr.length - 1] || '';

            if (OPERATORS.has(val)) {
                if (!currentExpr) {
                    if (val === '-') {
                        currentExpr = '-';
                        updateDisplay();
                    }
                    return;
                }
                if (lastChar === '(' && val !== '-') return;
                if (OPERATORS.has(lastChar)) {
                    currentExpr = currentExpr.slice(0, -1) + val;
                    updateDisplay();
                    return;
                }
            }

            if (val === '%') {
                if (!currentExpr || OPERATORS.has(lastChar) || lastChar === '(' || lastChar === '.') {
                    return;
                }
            }

            if (val === '.') {
                const segments = currentExpr.split(/[+\-*/()]/);
                const lastSegment = segments[segments.length - 1];
                if (lastSegment.includes('.')) return;
                if (lastSegment === '') {
                    currentExpr += '0.';
                    updateDisplay();
                    return;
                }
            }

            if (val === '(' && /[0-9)%]/.test(lastChar)) {
                currentExpr += '*(';
                updateDisplay();
                return;
            }

            if (val >= '0' && val <= '9' && (lastChar === ')' || lastChar === '%')) {
                currentExpr += '*' + val;
                updateDisplay();
                return;
            }

            currentExpr += val;
            updateDisplay();
        }

        function insertSmartParen() {
            if (lastEvaluated) {
                currentExpr = '';
                expressionEl.textContent = '';
                lastEvaluated = false;
            }
            const openCount = (currentExpr.match(/\(/g) || []).length;
            const closeCount = (currentExpr.match(/\)/g) || []).length;
            const lastChar = currentExpr[currentExpr.length - 1] || '';

            if (openCount > closeCount && /[0-9)%]/.test(lastChar)) {
                currentExpr += ')';
            } else if (/[0-9)%]/.test(lastChar)) {
                currentExpr += '*(';
            } else {
                currentExpr += '(';
            }
            updateDisplay();
        }

        function toggleSign() {
            if (!currentExpr) {
                currentExpr = '-';
                updateDisplay();
                return;
            }
            if (lastEvaluated) {
                lastEvaluated = false;
            }
            const match = /^(.*?)(\(-)?(\d*\.?\d+)(\))?$/.exec(currentExpr);
            if (!match) return;

            const [, prefix, wrappedNeg, num, wrappedClose] = match;
            if (wrappedNeg && wrappedClose) {
                currentExpr = `${prefix}${num}`;
            } else if (prefix === '' && currentExpr.startsWith('-')) {
                currentExpr = currentExpr.slice(1);
            } else if (prefix === '-') {
                currentExpr = num;
            } else {
                currentExpr = `${prefix}(-${num})`;
            }
            updateDisplay();
        }

        function clearAll() {
            currentExpr = '';
            lastEvaluated = false;
            updateDisplay('');
        }

        function backspace() {
            if (lastEvaluated) {
                clearAll();
                return;
            }
            currentExpr = currentExpr.slice(0, -1);
            updateDisplay();
        }

        function compute() {
            if (!currentExpr) {
                ui.notify('Digite uma expressão antes de calcular.', { type: 'info' });
                return;
            }

            const trimmed = OPERATORS.has(currentExpr[currentExpr.length - 1])
                ? currentExpr.slice(0, -1)
                : currentExpr;

            if (!trimmed) return;

            try {
                const result = evaluateExpression(trimmed);
                const formattedExpr = formatForDisplay(trimmed);
                const resultStr = String(result);
                currentExpr = resultStr;
                lastEvaluated = true;
                updateDisplay(`${formattedExpr} =`);
                pushHistory(formattedExpr, resultStr);
            } catch (error) {
                ui.notify(error.message || 'Expressão inválida.');
            }
        }

        keypad.addEventListener('click', (event) => {
            const btn = event.target.closest('button[data-action], button[data-value]');
            if (!btn) return;

            const action = btn.dataset.action;
            if (action === 'clear') {
                clearAll();
            } else if (action === 'backspace') {
                backspace();
            } else if (action === 'paren') {
                insertSmartParen();
            } else if (action === 'sign') {
                toggleSign();
            } else if (action === 'equals') {
                compute();
            } else if (btn.dataset.value) {
                appendValue(btn.dataset.value);
            }
        });

        if (backspaceTopBtn) {
            backspaceTopBtn.addEventListener('click', backspace);
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                const text = currentExpr || '0';
                const copied = await ui.copyText(text);
                if (copied) {
                    ui.notify(`Valor ${text} copiado para a área de transferência.`, {
                        type: 'success',
                        title: 'Copiado',
                        duration: 2400
                    });
                }
            });
        }

        if (historyList) {
            historyList.addEventListener('click', (event) => {
                const item = event.target.closest('[data-history-index]');
                if (!item) return;
                const entry = history[Number(item.dataset.historyIndex)];
                if (!entry) return;
                currentExpr = entry.result;
                lastEvaluated = true;
                updateDisplay(`${entry.expression} =`);
            });
        }

        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                history = [];
                ui.storage.remove(HISTORY_KEY);
                renderHistory();
            });
        }

        document.addEventListener('keydown', (event) => {
            const { key } = event;
            if ((key >= '0' && key <= '9') || OPERATORS.has(key) || key === '%' || key === '(' || key === ')') {
                event.preventDefault();
                appendValue(key);
            } else if (key === '.' || key === ',') {
                event.preventDefault();
                appendValue('.');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                compute();
            } else if (key === 'Backspace') {
                event.preventDefault();
                backspace();
            } else if (key === 'Escape' || key === 'Delete') {
                event.preventDefault();
                clearAll();
            }
        });

        updateDisplay('');
        renderHistory();
    });
})(typeof window !== 'undefined' ? window : globalThis);
