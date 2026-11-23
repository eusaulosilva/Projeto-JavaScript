'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');

function walkFiles(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'tests') {
            continue;
        }
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walkFiles(full));
        } else {
            results.push(full);
        }
    }
    return results;
}

const allFiles = walkFiles(ROOT);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const jsFiles = allFiles.filter((f) => f.endsWith('.js'));
const cssFiles = allFiles.filter((f) => f.endsWith('.css'));

function loadAppSandbox() {
    const sandbox = {
        globalThis: null,
        console,
        Intl,
        Math,
        Number,
        String,
        Array,
        Object,
        Date,
        Set,
        Error,
        Boolean,
        RegExp,
        JSON
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);

    for (const jsFile of jsFiles) {
        const src = fs.readFileSync(jsFile, 'utf8');
        new vm.Script(src, { filename: jsFile }).runInContext(sandbox);
    }

    return sandbox.App;
}

describe('Estrutura, HTML e integridade de arquivos', () => {
    it('contém todos os arquivos esperados do projeto', () => {
        assert.equal(htmlFiles.length, 16);
        assert.equal(jsFiles.length, 17);
        assert.equal(cssFiles.length, 2);
        assert.ok(fs.existsSync(path.join(ROOT, 'assets', 'img', 'favicon.svg')));
    });

    it('valida HTML5 semântico, favicon, links locais e IDs usados nos scripts', () => {
        for (const htmlFile of htmlFiles) {
            const content = fs.readFileSync(htmlFile, 'utf8');
            const rel = path.relative(ROOT, htmlFile);

            assert.match(content, /<html lang="pt-BR">/, `${rel}: falta lang="pt-BR"`);
            assert.match(content, /rel="icon"/, `${rel}: falta favicon`);
            assert.doesNotMatch(content, /<center\b/i, `${rel}: contém tag obsoleta <center>`);
            assert.doesNotMatch(content, /\bonclick=/i, `${rel}: contém onclick inline`);
            assert.doesNotMatch(content, /sweetalert2|bootstrap|jquery/i, `${rel}: contém dependência obsoleta`);
            assert.doesNotMatch(content, /<a\b[^>]*>\s*<button\b/i, `${rel}: contém <button> dentro de <a>`);

            const refRegex = /\b(?:href|src)="([^"]+)"/g;
            const loadedScripts = [];
            let match;
            while ((match = refRegex.exec(content)) !== null) {
                const target = match[1];
                if (target.startsWith('http') || target.startsWith('#')) continue;
                const resolved = path.resolve(path.dirname(htmlFile), target);
                assert.ok(fs.existsSync(resolved), `${rel}: referência quebrada "${target}"`);
                if (target.endsWith('.js')) {
                    loadedScripts.push(resolved);
                }
            }

            const ids = new Set();
            const idRegex = /\bid="([^"]+)"/g;
            while ((match = idRegex.exec(content)) !== null) {
                ids.add(match[1]);
            }

            for (const scriptPath of loadedScripts) {
                if (!scriptPath.includes(`${path.sep}pages${path.sep}`)) continue;
                const jsSrc = fs.readFileSync(scriptPath, 'utf8');
                const getByIdRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
                let idMatch;
                while ((idMatch = getByIdRegex.exec(jsSrc)) !== null) {
                    assert.ok(
                        ids.has(idMatch[1]),
                        `${rel}: ${path.basename(scriptPath)} espera #${idMatch[1]}`
                    );
                }
            }
        }
    });

    it('não utiliza eval() em nenhum módulo JavaScript', () => {
        for (const jsFile of jsFiles) {
            const src = fs.readFileSync(jsFile, 'utf8');
            const codeOnly = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
            assert.doesNotMatch(codeOnly, /\beval\s*\(/, `${path.relative(ROOT, jsFile)} usa eval()`);
        }
    });
});

describe('Calculadoras e validadores', () => {
    const App = loadAppSandbox();
    const { calculators, validators, ui } = App;

    it('valida números e datas ISO UTC corretamente', () => {
        assert.equal(validators.parseNumber('12,5'), 12.5);
        assert.equal(validators.parseNumber('   '), null);
        assert.ok(Number.isNaN(validators.parseNumber('abc')));
        assert.equal(validators.parseISODateUTC('2024-02-29').getUTCDate(), 29);
        assert.equal(validators.parseISODateUTC('2023-02-29'), null);
    });

    it('calcula IMC conforme classificação OMS', () => {
        assert.equal(calculators.imc(50, 1.75).classification, 'Abaixo do peso');
        assert.equal(calculators.imc(70, 1.75).classification, 'Peso normal');
        assert.equal(calculators.imc(85, 1.75).classification, 'Sobrepeso');
        assert.equal(calculators.imc(100, 1.75).classification, 'Obesidade Grau I');
    });

    it('gera tabuada e bloqueia divisão por zero', () => {
        const mult = calculators.tabuada(7, '*');
        assert.equal(mult.length, 11);
        assert.equal(mult[10].answer, 70);
        assert.equal(calculators.tabuada(0, '+')[5].answer, 5);
        assert.throws(() => calculators.tabuada(0, '/'), /zero/);
    });

    it('calcula custo do carro e reajuste sem truncar centavos', () => {
        const car = calculators.custoCarro(50000.5, 28, 45);
        assert.ok(Math.abs(car.distributorValue - 14000.14) < 1e-6);
        assert.ok(Math.abs(car.taxValue - 22500.225) < 1e-6);
        assert.ok(Math.abs(car.finalCost - 86500.865) < 1e-6);

        const reaj = calculators.reajuste(1500.5, 10);
        assert.ok(Math.abs(reaj.increase - 150.05) < 1e-6);
        assert.ok(Math.abs(reaj.newSalary - 1650.55) < 1e-6);
    });

    it('calcula eleição, comissão e peso ideal', () => {
        const elec = calculators.eleicao(80, 15, 5);
        assert.equal(elec.total, 100);
        assert.equal(elec.validPct, 80);
        assert.equal(calculators.eleicao(0, 0, 0).total, 0);

        const com = calculators.comissao(2000, [40000, 60000]);
        assert.equal(com.count, 2);
        assert.equal(com.totalCommission, 5000);
        assert.equal(com.finalSalary, 7000);

        assert.ok(Math.abs(calculators.pesoIdeal(1.8, 'masculino') - 72.86) < 1e-6);
        assert.ok(Math.abs(calculators.pesoIdeal(1.65, 'feminino') - 57.765) < 1e-6);
    });

    it('calcula gorjeta padrão, personalizada e divisão por pessoa', () => {
        const tipDefault = calculators.gorjeta(120.5);
        assert.ok(Math.abs(tipDefault.tip - 12.05) < 1e-6);
        assert.ok(Math.abs(tipDefault.total - 132.55) < 1e-6);

        const split = calculators.gorjeta(200, 15, 4);
        assert.equal(split.tip, 30);
        assert.equal(split.total, 230);
        assert.equal(split.perPerson, 57.5);
    });

    it('calcula dobro, média, par/ímpar e antecessor/sucessor', () => {
        assert.equal(calculators.dobro(-12.5), -25);

        const med1 = calculators.media([8.5]);
        assert.equal(med1.sum, 8.5);
        assert.equal(med1.average, 8.5);
        assert.equal(calculators.media([7, 8, 9]).average, 8);

        assert.equal(calculators.parImpar(0).label, 'PAR');
        assert.equal(calculators.parImpar(-3).label, 'ÍMPAR');
        assert.throws(() => calculators.parImpar(2.5));

        const neigh = calculators.antecessor(0);
        assert.equal(neigh.predecessor, -1);
        assert.equal(neigh.successor, 1);
    });

    it('calcula idade em anos, dias, horas, semanas e próximo aniversário', () => {
        const birth = validators.parseISODateUTC('2000-01-01');
        const end = validators.parseISODateUTC('2001-01-01');
        const age = calculators.idade(birth, end);
        assert.equal(age.years, 1);
        assert.equal(age.totalDays, 366);
        assert.equal(age.totalHours, 366 * 24);
        assert.equal(age.totalWeeks, 52);
        assert.equal(age.daysUntilNextBirthday, 0);

        const mid = validators.parseISODateUTC('2025-12-22');
        const ageMid = calculators.idade(birth, mid);
        assert.equal(ageMid.daysUntilNextBirthday, 10);

        // Nascimento em 29/02 em ano não bissexto (comemora em 28/02)
        const leapBirth = validators.parseISODateUTC('2000-02-29');
        const nonLeapCheck = validators.parseISODateUTC('2025-02-20');
        assert.equal(calculators.idade(leapBirth, nonLeapCheck).daysUntilNextBirthday, 8);
    });

    it('avalia expressões da calculadora com parênteses, porcentagem e segurança', () => {
        assert.equal(calculators.evaluateExpression('2+3*4'), 14);
        assert.equal(calculators.evaluateExpression('(2+3)*4'), 20);
        assert.equal(calculators.evaluateExpression('((10-2)/4)+3'), 5);
        assert.equal(calculators.evaluateExpression('200*15%'), 30);
        assert.equal(calculators.evaluateExpression('50%'), 0.5);
        assert.equal(calculators.evaluateExpression('0.1+0.2'), 0.3);
        assert.equal(calculators.evaluateExpression('-5*3'), -15);
        assert.equal(calculators.evaluateExpression('10/(-2)'), -5);

        assert.throws(() => calculators.evaluateExpression('5/0'), /zero/);
        assert.throws(() => calculators.evaluateExpression('(2+3'), /Parênteses/);
        assert.throws(() => calculators.evaluateExpression('2..3+1'));
        assert.throws(() => calculators.evaluateExpression('alert(1)'));
    });

    it('formata moeda BRL e escapa HTML', () => {
        assert.ok(ui.formatCurrency(1234.56).includes('1.234,56'));
        assert.equal(ui.escapeHtml('<script>"&\''), '&lt;script&gt;&quot;&amp;&#39;');
    });
});
