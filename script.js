
function imc() {
    let peso = Number(document.querySelector('.peso').value);
    let altura = Number(document.querySelector('.altura').value);
    var result = document.querySelector("#result");

    if (peso == "" || altura == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })

    } else {

        let imc = peso / (altura ** 2);


        if (imc < 20.7) {
            result.innerHTML = (`Seu peso é: <strong>${peso.toFixed(1)} kg</strong>  <br> Sua altura é: <strong>${altura.toFixed(2)} cm</strong> <br> Seu IMC é : <strong>${imc.toFixed(1)}</strong> <br> <strong>Você está abaixo do peso.</strong>`);
        } else if (imc >= 20.7 && imc < 26.5) {
            result.innerHTML = (`Seu peso é: <strong>${peso.toFixed(1)} kg</strong>  <br> Sua altura é: <strong>${altura.toFixed(2)} cm</strong> <br> Seu IMC é : <strong>${imc.toFixed(1)}</strong> <br> <strong>Você está com peso ideal.</strong>`);
        } else if (imc >= 26.5 && imc < 27.8) {
            result.innerHTML = (`Seu peso é: <strong>${peso.toFixed(1)} kg</strong>  <br> Sua altura é: <strong>${altura.toFixed(2)} cm</strong> <br> Seu IMC é : <strong>${imc.toFixed(1)}</strong> <br> <strong>Você está um pouco acima do peso.</strong>`);
        } else if (imc >= 27.8 && imc < 31.1) {
            result.innerHTML = (`Seu peso é: <strong>${peso.toFixed(1)} kg</strong>  <br> Sua altura é: <strong>${altura.toFixed(2)} cm</strong> <br> Seu IMC é : <strong>${imc.toFixed(1)}</strong> <br> <strong>Você está acima do peso.</strong>`);
        } else {
            result.innerHTML = (`Seu peso é: <strong>${peso.toFixed(1)} kg</strong>  <br> Sua altura é: <strong>${altura.toFixed(2)} cm</strong> <br> Seu IMC é : <strong>${imc.toFixed(1)}</strong> <br> <strong>Você está obeso.</strong>`);

        }
    }
}

function tabuada() {
    let tabuada = [5];
    tabuada[0] = Number(document.querySelector("#inicio").value);
    tabuada[3] = document.querySelector("#result");
    tabuada[2] = document.querySelector('#opera').value;


    if (tabuada[0] === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })

    } else if (tabuada[2] == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Escolha um dos operadores!',

        })
    } else {
        tabuada[3].innerHTML = ("");
        switch (tabuada[2]) {
            case "+":

                for (i = 0; i <= 10; i++) {
                    tabuada[4] = tabuada[0] + i;
                    tabuada[3].innerHTML += (`${tabuada[0]} + ${i} = ${tabuada[4]} <br> `);
                }
                break

            case "-":

                for (i = 0; i <= 10; i++) {
                    tabuada[4] = (tabuada[0] + i) - tabuada[0];
                    tabuada[3].innerHTML += (`${tabuada[0] + i} - ${tabuada[0]} = ${tabuada[4]} <br> `);
                }

                break

            case "*":
                for (i = 0; i <= 10; i++) {
                    tabuada[4] = i * tabuada[0];
                    tabuada[3].innerHTML += (`${tabuada[0]} x ${i}   = ${tabuada[4]} <br>`);
                }
                break

            case "/":

                for (i = 0; i <= 10; i++) {

                    tabuada[4] = (tabuada[0] * i) / tabuada[0];
                    tabuada[3].innerHTML += (`${tabuada[0] * i} ÷ ${tabuada[0]} =  ${tabuada[4]}<br>`);

                }

                break
        }
    }
}

function custo() {
    var custo = document.querySelector('.custo').value;
    var porcen = document.querySelector('.porcen').value;
    var impost = document.querySelector('.impos').value;
    var result = document.querySelector('#result');

    if (custo == "" || porcen == "" || impost == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',
        })
    } else {
        var porce = (porcen / 100) * custo;
        var impos = (impost / 100) * custo;
        var calc = parseFloat(custo) + parseInt(porce) + parseInt(impos);
        result.innerHTML = (porce)
        result.innerHTML = (impos)
        result.innerHTML = (`Custo Final: <b> ${calc.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>`);
    }
}

function reaju() {

    var salar = document.querySelector('.salar').value;
    var percen = document.querySelector('.percen').value;
    var result = document.querySelector('#result');

    if (salar == "" || percen == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })


    } else {
        var calcu = (percen / 100) * salar;
        var reaju = parseInt(calcu) + parseInt(salar);

        result.innerHTML = (`Aumento de: <b> ${calcu.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b> <br>Salário final: <b> ${reaju.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>`);
    }
}

function eleicao() {
    var votosN = document.querySelector('.votosN').value;
    var votosB = document.querySelector('.votosB').value;
    var votosV = document.querySelector('.votosV').value;
    var result = document.querySelector('#result');
    if (votosN == "" || votosB == "" || votosV == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })


    } else {
        var total = parseInt(votosV) + parseInt(votosN) + parseInt(votosB);
        var porceN = parseInt(votosN * 100) / total;
        var porceB = parseInt(votosB * 100) / total;
        var porceV = parseInt(votosV * 100) / total;
        result.innerHTML = (`Total: <b>${total}</b> <br> Votos válidos: <b>${porceV.toFixed(1) + '%'}</b> <br> Votos nulos: <b>${porceN.toFixed(1) + '%'}</b> <br> Votos brancos: <b>${porceB.toFixed(1) + '%'}</b>`)
    }

}

var cont = 0;
let total = 0;
function comissao() {

    let salario = Number(document.querySelector('.salario').value);
    let valor = Number(document.querySelector('.valor').value);
    let calc;
    var result = document.querySelector("#result");
    if (salario == "" || valor == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })

    } else {
        calc = valor * 0.05;
        total += calc;
        cont += 1;
        result.innerHTML = (`Carros Vendidos: <b>${cont}</b>. <br> Aumento de: <b> ${(total.toLocaleString('pt-br', {
            style: 'currency', currency:
                'BRL'
        }))}</b>. <br> Salário final: <b> ${((salario + total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }))}</b>.`);

    }

}

function pesoideal() {
    var mascul = document.querySelector('#masculino');
    var femini = document.querySelector('#femenino');
    var altura = document.querySelector('.altura').value;
    var calcu;

    var result = document.querySelector('#result');
    if (altura == 0 || mascul == "" || femini == "") {

        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })

    }
    else if (masculino.checked == true) {
        calcu = (72.7 * altura) - 58;
        result.innerHTML = (`O peso ideal para um homem é: <b>${calcu.toFixed(2)} kg</b>`);
    } else if (femenino.checked == true) {
        calcu = (62.1 * altura) - 44.7;
        result.innerHTML = (`O peso ideal para uma mulher é: <b>${calcu.toFixed(2)} kg</b>`);
    }
}

function gorjeta() {
    var conta = document.querySelector('.salarioAtual').value;
    var result = document.querySelector("#result");
    if (conta == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })

    } else{
    var taxa = 10 / 100;
    var garcom = taxa * conta;
    var total = parseFloat(garcom) + parseFloat(conta);
    result.innerHTML = (`10% do garçom: ${(garcom.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }))} <br>
    Total: ${(total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }))}`);
}
}

function dobro() {
    var num = document.querySelector('.num').value;
    var result = document.querySelector("#result");
    const dobro = 2;
    if (num == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })

    } else {
        var total = num * dobro;
        result.innerHTML = `O número é: <b>${num}</b> <br> Seu dobro é: <b>${total}</b>`;
    }
}

var notas = [];
function media() {
    var valor = document.querySelector('.notas').value;
    var result = document.querySelector("#result");


    if (valor == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })

    } else {
        notas.push(valor);
        var total = notas.reduce(function (soma, i) {
            return parseFloat(soma) + parseFloat(i);
        });
        var media = total / notas.length;
        result.innerHTML = (`Notas: <b>${notas}</b> <br> Soma: <b>${total}</b> <br> Média: <b>${media.toFixed(1)}</b>`)
    }
}

function parimpar() {
    var num = document.querySelector('.parimpar').value;
    var result = document.querySelector('#result');
    resto = num % 2
    if (num == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })
    } else if (resto == 0) {
        result.innerHTML = (`O número <b>${num}</b> é <b>PAR</b>.`)

    } else {
        result.innerHTML = (`O número <b>${num}</b> é <b>ÍMPAR</b>.`)
    }
}

const segundos = 1000;
const minutos = segundos * 60;
const horas = minutos * 60;
const dias = horas * 24;
const anos = dias * 365.241;
function contadorDias() {
    var result = document.querySelector('#result');
    let dataNasc = document.querySelector("#inicio").value;
    let dataAtual = document.querySelector("#fim").value;
    var inicio = new Date(dataNasc);
    var fim = new Date(dataAtual);
    if (dataNasc == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Campo de data de nascimento está vazio!!!',

        })
    } else if (dataAtual == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Campo de data atual está vazio!!!',

        })
    } else {
        contar = fim.getTime() - inicio.getTime();
        ano = contar / anos
        total = contar / dias;
        result.innerHTML = (`Idade: <b>${parseInt(ano)}</b> anos. <br> Idade em dias: <b>${total.toLocaleString('pt-BR')}</b> dias.`);
    }
}
function contadorHoras() {
    var result = document.querySelector('#result');
    let dataNasc = document.querySelector("#inicio").value;
    let dataAtual = document.querySelector("#fim").value;
    var inicio = new Date(dataNasc);
    var fim = new Date(dataAtual);
    if (dataNasc == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Campo de data de nascimento está vazio!!!',

        })
    } else if (dataAtual == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Campo de data atual está vazio!!!',

        })
    } else {
        contar = fim.getTime() - inicio.getTime();
        ano = contar / anos
        total = contar / horas;
        result.innerHTML = (`Idade: <b>${parseInt(ano)}</b> anos. <br> Idade em horas: <b>${total.toLocaleString('pt-BR')}</b> horas.`);
    }
}
function antecessor() {
    var num1 = document.querySelector('.antecessor').value;
    var result = document.querySelector('#result');
    if (num1 == "") {
        Swal.fire({
            icon: 'error',
            title: 'Atenção!!!',
            text: 'Algum campo de preenchimento está vazio!!!',

        })

    } else {
    var anter = num1 - 1;
    result.innerHTML = (`Número: <b>${num1}</b>  <br> Antecessor: <b>${anter}</b> `)
}
}

function limpar() {
    var peso = document.querySelector('.peso');
    var altura = document.querySelector('.altura');
    var result = document.querySelector("#result");
    peso.value = ("");
    altura.value = ("");
    result.innerHTML = ("");

}
function limpar1() {
    var inicio = document.querySelector('#inicio');

    var operar = document.querySelector("#opera");
    var result = document.querySelector('#result');
    inicio.value = ("");

    operar.value = ("");
    result.innerHTML = ("");
}
function limpar2() {
    var custo = document.querySelector('.custo');
    var porcen = document.querySelector('.porcen');
    var impost = document.querySelector('.impos');
    var result = document.querySelector('#result');
    custo.value = ("");
    porcen.value = ("");
    impost.value = ("");
    result.innerHTML = ("");
}
function limpar3() {
    var salar = document.querySelector('.salar');
    var percen = document.querySelector('.percen');
    var result = document.querySelector('#result');
    salar.value = ("");
    percen.value = ("");
    result.innerHTML = ("");
}
function limpar4() {
    var votosN = document.querySelector('.votosN');
    var votosB = document.querySelector('.votosB');
    var votosV = document.querySelector('.votosV');
    var result = document.querySelector('#result');
    votosN.value = ("");
    votosB.value = ("");
    votosV.value = ("");

    result.innerHTML = ("");
}
function limpar5() {
    var custo = document.querySelector('.custo');
    var porcen = document.querySelector('.porcen');
    var impost = document.querySelector('.impos');
    var result = document.querySelector('#result');
    custo.value = ("");
    porcen.value = ("");
    impost.value = ("");
    result.innerHTML = ("");
}
function limpar6() {
    var salario = document.querySelector('.salario');
    var valor = document.querySelector('.valor');
    var result = document.querySelector("#result");
    salario.value = ("");
    valor.value = ("");
    result.innerHTML = ("");
    cont = 0;
    total = 0;

}
function limparcamp() {
    var valor = document.querySelector('.valor');
    valor.value = ("");
}
function limpar7() {
    var mascul = document.querySelector('#masculino');
    var femini = document.querySelector('#femenino');
    var altura = document.querySelector('.altura');
    mascul.checked = false;
    femini.checked = false;

    altura.value = ("");
    result.innerHTML = ("");


}
function limpar8() {
    var num = document.querySelector('.num');
    num.value = ("");
    result.innerHTML = ("");


}
function limpar9() {
    var valor = document.querySelector('.notas');
    valor.value = ("");
    notas = [];
    result.innerHTML = ("");


}
function limparnota() {
    var valor = document.querySelector('.notas');
    valor.value = ("");
}
function limpar10() {
    var num = document.querySelector('.parimpar');
    num.value = ("");
    result.innerHTML = ("");


}
function limpar11() {
    var result = document.querySelector('#result');
    let dataNasc = document.querySelector("#inicio");
    let dataAtual = document.querySelector("#fim");
    dataNasc.value = ("");
    dataAtual.value = ("");
    result.innerHTML = ("");
}
function limpar12() {
    var result = document.querySelector('#result');
    let dataNasc = document.querySelector("#inicio");
    let dataAtual = document.querySelector("#fim");
    dataNasc.value = ("");
    dataAtual.value = ("");
    result.innerHTML = ("");
}
function limpar13(){
    var num1 = document.querySelector('.antecessor');
    var result = document.querySelector('#result');
    num1.value = ("");
    result.innerHTML = ("");
}
function limpar14(){
    var conta = document.querySelector('.salarioAtual');
    var result = document.querySelector("#result");
    conta.value = ("");
    result.innerHTML = ("");

}

//CALCULADORA
function insert(num) {
    var numero = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = numero + num;
}
function clean() {
    document.getElementById('resultado').innerHTML = "";
}
function back() {
    var resultado = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = resultado.substring(0, resultado.length - 1);
}
function calcular() {
    var resultado = document.getElementById('resultado').innerHTML;
    if (resultado) {
        document.getElementById('resultado').innerHTML = eval(resultado);
    }
    else {
        document.getElementById('resultado').innerHTML = "Nada..."
    }
}
