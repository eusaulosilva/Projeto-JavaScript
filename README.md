# Projeto JavaScript — Central de Ferramentas

Coleção de **15 calculadoras e utilitários interativos** desenvolvidos com **HTML5 semântico**, **CSS3 moderno (tema claro/escuro minimalista harmonizado com o fundo degradê animado original)** e **JavaScript puro (Vanilla JS)**, sem dependências externas.

## Estrutura do Projeto

```text
Projeto-JavaScript/
├── index.html                  # Página inicial com busca (atalho /) e filtro por categoria
├── README.md                   # Documentação do projeto
├── assets/
│   ├── css/
│   │   ├── styles.css          # Design system (claro/escuro), fundo animado e botões minimalistas
│   │   └── calculator.css      # Estilos dedicados à calculadora e histórico
│   ├── img/
│   │   └── favicon.svg         # Favicon vetorial SVG
│   └── js/
│       ├── core/
│       │   ├── ui.js           # Tema claro/escuro, storage, clipboard, toasts e formatação BRL
│       │   └── validators.js   # Validação padronizada de números, inteiros e datas UTC
│       └── pages/
│           ├── hub.js          # Busca instantânea (atalhos / e Esc) e filtros de categoria
│           ├── antecessor.js   # Antecessor e sucessor de um número inteiro
│           ├── calculadora.js  # Parser seguro (+, −, ×, ÷, %, parênteses), histórico e teclado
│           ├── comissao.js     # Acúmulo de comissão de 5% por carro vendido (com localStorage)
│           ├── custo-carro.js  # Custo final de veículo (fábrica + distribuidor + impostos)
│           ├── dobro.js        # Dobro de qualquer número real
│           ├── eleicao.js      # Apuração percentual e barras visuais de votos
│           ├── gorjeta.js      # Taxa de serviço configurável (10% padrão), divisão e cópia
│           ├── idade.js        # Idade em anos, dias, horas, semanas e próximo aniversário
│           ├── imc.js          # Índice de Massa Corporal com tabela oficial da OMS
│           ├── media.js        # Média aritmética dinâmica com remoção individual e localStorage
│           ├── par-impar.js    # Verificação de paridade para números inteiros
│           ├── peso-ideal.js   # Estimativa de peso ideal por altura e sexo biológico
│           ├── reajuste.js     # Simulador de reajuste salarial
│           └── tabuada.js      # Gerador de tabuada (+, −, ×, ÷) de 0 a 10
├── pages/                      # 15 páginas HTML5 semânticas
└── tests/
    └── project.test.js         # Suíte de testes automatizados com node:test (zero dependências)
```

## Ferramentas Incluídas

| Categoria | Ferramentas |
| :--- | :--- |
| **Matemática** | Calculadora (parênteses, `%`, `±`, histórico), Tabuada, Média de Notas, Dobro, Par ou Ímpar, Antecessor |
| **Finanças** | Custo do Carro, Reajuste Salarial, Comissão de Vendas (5%), 10% do Garçom (taxa editável + divisão por pessoa) |
| **Saúde** | Calculadora de IMC (OMS), Peso Ideal |
| **Datas & Utilidades** | Apuração de Votos, Idade em Dias, Idade em Horas (com semanas e contagem para o próximo aniversário) |

## Como Executar

O projeto não requer build nem instalação de pacotes:

1. Clone ou baixe este repositório.
2. Abra o arquivo `index.html` diretamente no navegador (ou execute `npx serve .` na pasta do projeto).

## Como Rodar os Testes

Requer apenas Node.js 18+ (usa o runner nativo `node:test`):

```bash
node --test
```

## Boas Práticas Aplicadas

- **Zero dependências externas:** notificações *toast* acessíveis (`role="alert"`), alternância de tema Claro/Escuro e persistência com `localStorage` implementados em Vanilla JS.
- **Segurança:** calculadora baseada em *parser* aritmético recursivo próprio, sem uso de `eval()`.
- **Precisão numérica e temporal:** correção de truncamentos monetários, validação de divisão por zero e cálculos de data em UTC com tratamento de anos bissextos.
- **Acessibilidade e semântica:** `lang="pt-BR"`, favicon SVG, formulários com `<label>`, `aria-live="polite"`, atalhos de teclado e suporte a `prefers-reduced-motion`.
