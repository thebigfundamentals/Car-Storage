/*
Vamos estruturar um pequeno app utilizando módulos.
Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
seguinte forma:
- No início do arquivo, deverá ter as informações da sua empresa - nome e
telefone (já vamos ver como isso vai ser feito)
- Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
um formulário para cadastro do carro, com os seguintes campos:
  - Imagem do carro (deverá aceitar uma URL)
  - Marca / Modelo
  - Ano
  - Placa
  - Cor
  - e um botão "Cadastrar"
Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
aparecer no final da tabela.
Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
Dê um nome para a empresa e um telefone fictício, preechendo essas informações
no arquivo company.json que já está criado.
Essas informações devem ser adicionadas no HTML via Ajax.
Parte técnica:
Separe o nosso módulo de DOM criado nas últimas aulas em
um arquivo DOM.js.
E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
que será nomeado de "app".
*/

// values

let $imgCarro = document.querySelector('#imgCarro');
let $marcaModelo = document.querySelector('#marcaModelo');
let $ano = document.querySelector('#ano');
let $placa = document.querySelector('#placa');
let $cor = document.querySelector('#cor');
let $cadastrarBtn = document.querySelector('#cadastrar');
let $limparBtn = document.querySelector('#limpar');
let excluirBtnAtivado;
let $excluirBtn = () => { return document.querySelectorAll('#excluir') };
let $loading = document.querySelector('.loading');
const $carro = () => { return document.querySelector('.carro') };
const $carroLista = document.querySelector('.output');
const carroDefault = document.querySelector('.carro').cloneNode(true);

let carCounter = 0;

class CriadorCarro {
    constructor(id, imgCarro, marcaModelo, ano, placa, cor) {
        this.id = id;
        this.imgCarro = getValue(imgCarro);
        this.marcaModelo = getValue(marcaModelo).toUpperCase();
        this.ano = getValue(ano);
        this.placa = getValue(placa).toUpperCase();
        this.cor = getValue(cor).toLowerCase();
    }
};

function getValue(element) {
    return element.value
};


async function cadastrarCarro() {

    let $novoCarro = carroDefault.cloneNode(true);

    const ID = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const carroInserido = new CriadorCarro(ID(), $imgCarro, $marcaModelo, $ano, $placa, $cor);

    if (!getValue($imgCarro) || !getValue($marcaModelo) || !getValue($ano) || !getValue($placa) || !getValue($cor)) {
        alert('Por favor, preencha todos os campos.')
        return;
    }

    else {

        if (carCounter === 0) {

            let imgEnviada = document.createElement('img');
            imgEnviada.setAttribute('class', 'imgEnviada');
            imgEnviada.src = carroInserido.imgCarro;
            let $imgCarroOutput = $novoCarro.querySelector('.imgCarroOutput');
            $imgCarroOutput.appendChild(imgEnviada);

            $novoCarro.querySelector('.marcaModeloOutput').textContent = carroInserido.marcaModelo;
            $novoCarro.querySelector('.anoOutput').textContent = carroInserido.ano;
            $novoCarro.querySelector('.placaOutput').textContent = carroInserido.placa;
            $novoCarro.querySelector('.corOutput').textContent = carroInserido.cor;

            $novoCarro.setAttribute('id', `${carroInserido.id}`);

            $carroLista.appendChild($novoCarro);
            $carro().style.display = 'none';
            ++carCounter;

        }

        else {
            let $ultimoCarro = document.querySelector('.output').firstElementChild;


            let imgEnviada = document.createElement('img');
            imgEnviada.setAttribute('class', 'imgEnviada');
            imgEnviada.src = carroInserido.imgCarro;
            let $imgCarroOutput = $novoCarro.querySelector('.imgCarroOutput');
            $imgCarroOutput.removeChild($imgCarroOutput.lastChild);
            $imgCarroOutput.appendChild(imgEnviada);

            $novoCarro.querySelector('.marcaModeloOutput').textContent = carroInserido.marcaModelo;
            $novoCarro.querySelector('.anoOutput').textContent = carroInserido.ano;
            $novoCarro.querySelector('.placaOutput').textContent = carroInserido.placa;
            $novoCarro.querySelector('.corOutput').textContent = carroInserido.cor;

            $novoCarro.setAttribute('id', `${carroInserido.id}`);

            $carroLista.insertBefore($novoCarro, $ultimoCarro);
            ++carCounter;
        }
    }

    limparInput();
    excluirBtnAtivado = $excluirBtn();
    excluirBtnAtivado.forEach(selected => selected.removeAttribute('hidden'));
    console.log(carroInserido);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carroInserido),
    };

    const response = await fetch('/api', options);
    const data = await response.json();
    console.log(data);


    return ativarBtnExcluir();
};

function ativarBtnExcluir() {
    return excluirBtnAtivado.forEach(selected => selected.addEventListener('click', removerCarro, false));
}


async function removerCarro() {

    let confirmar = confirm('Você tem certeza de que deseja excluir este veículo? Esta ação não poderá ser desfeita.');

    if (!confirmar) {
        return
    }

    else {

        const idToRemove = { id: this.parentNode.parentNode.id };

        if (carCounter - 1 === 0) {

            this.parentNode.parentNode.remove();
            $carro().style.display = 'initial';
            excluirBtnAtivado.forEach(selected => selected.setAttribute('hidden', ''));
            --carCounter
        }

        else {
            this.parentNode.parentNode.remove();
            --carCounter
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(idToRemove)
        };

        const response = await fetch('/removeApi', options);
        const data = await response.json();
        console.log(data)

    }
};

function limparInput() {
    document.querySelector('form').reset();
};


async function verificarLista() {
    const response = await fetch('/api');
    const data = await response.json();
    return data

};

verificarLista().then(
    (data) => {
        if (data.length !== 0) {
            for (const carroDatabase of data) {

                console.log(carroDatabase)

                let $novoCarro = carroDefault.cloneNode(true);

                if (carCounter === 0) {

                    let imgEnviada = document.createElement('img');
                    imgEnviada.setAttribute('class', 'imgEnviada');
                    imgEnviada.src = carroDatabase.imgCarro;
                    let $imgCarroOutput = $novoCarro.querySelector('.imgCarroOutput');
                    $imgCarroOutput.appendChild(imgEnviada);

                    $novoCarro.querySelector('.marcaModeloOutput').textContent = carroDatabase.marcaModelo;
                    $novoCarro.querySelector('.anoOutput').textContent = carroDatabase.ano;
                    $novoCarro.querySelector('.placaOutput').textContent = carroDatabase.placa;
                    $novoCarro.querySelector('.corOutput').textContent = carroDatabase.cor;

                    $novoCarro.setAttribute('id', `${carroDatabase.id}`);

                    $carroLista.appendChild($novoCarro);
                    $carro().style.display = 'none';
                    ++carCounter;

                }

                else {
                    let $ultimoCarro = document.querySelector('.output').firstElementChild;


                    let imgEnviada = document.createElement('img');
                    imgEnviada.setAttribute('class', 'imgEnviada');
                    imgEnviada.src = carroDatabase.imgCarro;
                    let $imgCarroOutput = $novoCarro.querySelector('.imgCarroOutput');
                    $imgCarroOutput.removeChild($imgCarroOutput.lastChild);
                    $imgCarroOutput.appendChild(imgEnviada);

                    $novoCarro.querySelector('.marcaModeloOutput').textContent = carroDatabase.marcaModelo;
                    $novoCarro.querySelector('.anoOutput').textContent = carroDatabase.ano;
                    $novoCarro.querySelector('.placaOutput').textContent = carroDatabase.placa;
                    $novoCarro.querySelector('.corOutput').textContent = carroDatabase.cor;

                    $novoCarro.setAttribute('id', `${carroDatabase.id}`);

                    $carroLista.insertBefore($novoCarro, $ultimoCarro);
                    ++carCounter;
                }
                excluirBtnAtivado = $excluirBtn();
                excluirBtnAtivado.forEach(selected => selected.removeAttribute('hidden'));
            }
            $loading.setAttribute('hidden', '');
            return ativarBtnExcluir();
        }
        $loading.setAttribute('hidden', '');
    }
);



document.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $cadastrarBtn.click();
    }
});

$cadastrarBtn.addEventListener('click', cadastrarCarro, false);
$limparBtn.addEventListener('click', limparInput, false);