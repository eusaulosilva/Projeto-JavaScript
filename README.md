# Projeto JavaScript — Central de Ferramentas

Coleção de **15 calculadoras e utilitários interativos** desenvolvidos com **HTML5 semântico**, **CSS3 moderno (Glassmorphism responsivo)** e **JavaScript puro (Vanilla JS)**, sem dependências externas.

## Estrutura do Projeto

```text
Projeto-JavaScript/
├── index.html                  # Página inicial com busca e filtro por categoria
├── README.md                   # Documentação do projeto
├── assets/
│   ├── css/
│   │   ├── styles.css          # Design system, layout responsivo e botões minimalistas
│   │   └── calculator.css      # Estilos dedicados à calculadora
│   └── js/
│       ├── core/
│       │   ├── ui.js           # Notificações toast acessíveis, formatação BRL/números e DOM
│       │   └── validators.js   # Validação padronizada de números, inteiros e datas UTC
│       └── pages/
│           ├── hub.js          # Busca instantânea e filtro de categorias do hub
│           ├── antecessor.js   # Antecessor e sucessor de um número inteiro
│           ├── calculadora.js  # Parser aritmético seguro (sem eval) + atalhos de teclado
│           ├── comissao.js     # Acúmulo de comissão de 5% por carro vendido
│           ├── custo-carro.js  # Custo final de veículo (fábrica + distribuidor + impostos)
│           ├── dobro.js        # Dobro de qualquer número real
│           ├── eleicao.js      # Apuração percentual e barras visuais de votos
│           ├── gorjeta.js      # Taxa de serviço de 10% do garçom
│           ├── idade.js        # Cálculo de idade em anos, dias e horas (UTC)
│           ├── imc.js          # Índice de Massa Corporal com tabela oficial da OMS
│           ├── media.js        # Média aritmética dinâmica com remoção individual de notas
│           ├── par-impar.js    # Verificação de paridade para números inteiros
│           ├── peso-ideal.js   # Estimativa de peso ideal por altura e sexo biológico
│           ├── reajuste.js     # Simulador de reajuste salarial
│           └── tabuada.js      # Gerador de tabuada (+, −, ×, ÷) de 0 a 10
└── pages/
    ├── antecessor.html
    ├── calculadora.html
    ├── comissao.html
    ├── custo-carro.html
    ├── dias-vividos.html
    ├── dobro.html
    ├── eleicao.html
    ├── garcom.html
    ├── horas-vividas.html
    ├── imc.html
    ├── media.html
    ├── par-impar.html
    ├── peso-ideal.html
    ├── reajuste.html
    └── tabuada.html
```

## Ferramentas Incluídas

| Categoria | Ferramentas |
| :--- | :--- |
| **Matemática** | Calculadora, Tabuada, Média de Notas, Dobro de um Número, Par ou Ímpar, Antecessor |
| **Finanças** | Custo do Carro, Reajuste Salarial, Comissão de Vendas (5%), 10% do Garçom |
| **Saúde** | Calculadora de IMC (OMS), Peso Ideal |
| **Datas & Utilidades** | Apuração de Votos, Idade em Dias, Idade em Horas |

## Como Executar

O projeto não requer servidor nem instalação de pacotes:

1. Clone ou baixe este repositório.
2. Abra o arquivo `index.html` diretamente no navegador (ou sirva com uma extensão como Live Server).

## Boas Práticas Aplicadas

- **Zero dependências quebradas:** sistema próprio de notificações *toast* acessíveis (`role="alert"`) substituindo referências ausentes ao Bootstrap/SweetAlert2/jQuery.
- **Segurança:** calculadora implementada com *parser* aritmético recursivo próprio, eliminando o uso inseguro de `eval()`.
- **Precisão numérica:** correção de truncamentos indevidos (`parseInt` em valores monetários), validação de divisão por zero e cálculo de datas em UTC sem distorções de fuso horário.
- **Acessibilidade e semântica:** `lang="pt-BR"`, formulários nativos com `<label>`, `aria-live="polite"`, contraste adequado e suporte a `prefers-reduced-motion`.
