(function (global) {
    'use strict';

    const App = (global.App = global.App || {});
    App.calculators = App.calculators || {};

    /**
     * Avaliador aritmético seguro (recursive descent), sem uso de eval().
     * Suporta +, -, *, /, números decimais e operador unário (+/-).
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
            } else if ('+-*/'.includes(ch)) {
                tokens.push({ type: 'op', value: ch });
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
            if (token.type === 'number') {
                consume();
                return token.value;
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

        if (!displayEl || !keypad) return;
        const { ui } = App;

        let currentExpr = '';
        let lastEvaluated = false;

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

        function appendValue(val) {
            if (lastEvaluated) {
                if (OPERATORS.has(val)) {
                    lastEvaluated = false;
                } else {
                    currentExpr = '';
                    expressionEl.textContent = '';
                    lastEvaluated = false;
                }
            }

            if (OPERATORS.has(val)) {
                if (!currentExpr) {
                    if (val === '-') {
                        currentExpr = '-';
                        updateDisplay();
                    }
                    return;
                }
                const lastChar = currentExpr[currentExpr.length - 1];
                if (OPERATORS.has(lastChar)) {
                    currentExpr = currentExpr.slice(0, -1) + val;
                    updateDisplay();
                    return;
                }
            }

            if (val === '.') {
                const segments = currentExpr.split(/[+\-*/]/);
                const lastSegment = segments[segments.length - 1];
                if (lastSegment.includes('.')) return;
                if (lastSegment === '') {
                    currentExpr += '0.';
                    updateDisplay();
                    return;
                }
            }

            currentExpr += val;
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
                const history = `${formatForDisplay(trimmed)} =`;
                currentExpr = String(result);
                lastEvaluated = true;
                updateDisplay(history);
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
            } else if (action === 'equals') {
                compute();
            } else if (btn.dataset.value) {
                appendValue(btn.dataset.value);
            }
        });

        document.addEventListener('keydown', (event) => {
            const { key } = event;
            if ((key >= '0' && key <= '9') || OPERATORS.has(key)) {
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
    });
})(typeof window !== 'undefined' ? window : globalThis);
