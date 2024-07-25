class Vetor2D{// Classe para definir um vetor de duas dimensões
    constructor(eixoX, eixoY){
        this.x = eixoX;
        this.y = eixoY;
    }

    adicionar(vetor){//Soma dois vetores
        this.x += vetor.x;
        this.y += vetor.y;
    }

    multiplicar(escalar){//Multiplica o vetor por um escalar
        this.x *= escalar;
        this.y *= escalar;
    }

    tamanho(){//calcula o tamanho do vetor
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalizarVetor(){// Normalizar o vetor
        let tamanho = this.tamanho();
        if(tamanho != 0){
            this.x /= tamanho;
            this.y /= tamanho;
        }
    }
}

const canvas = document.getElementById("AL-ping-pong");//Carrega o modelo canvas criado
const contexto = canvas.getContext('2d');

const bola ={
    posicao: new Vetor2D(canvas.width / 2, canvas.height / 2),
    velocidade: new Vetor2D(4, 4),
    raio: 12,
    cor: "#FFFFFF"
};

const raquetePlayer ={
    posicao: new Vetor2D(0, (canvas.height - 120) / 2),
    largura: 12,
    altura: 120,
    pontos: 0,
    cor: "#0000FF" 
};

const raqueteMaquina = {
    posicao: new Vetor2D(canvas.width - 12, (canvas.height - 120) / 2),
    largura: 12,
    altura: 120,
    pontos: 0,
    cor: "#FF0000" 
};

function criarCampo(x, y, largura, altura, cor){// Funcao para criar o campo (mesa de ping-pong)
    contexto.fillStyle = cor;
    contexto.fillRect(x, y, largura, altura);
}

function criarBola(x, y, raio, cor){// Funcao para criar a bola
    contexto.fillStyle = cor;
    contexto.beginPath();
    contexto.arc(x, y, raio, 0, Math.PI * 2, true);
    contexto.closePath();
    contexto.fill();
}

canvas.addEventListener("mousemove", posicaoMouse);// Evento para captar movimento do mouse
function posicaoMouse(evento){// Funcao para captar a posicao do mouse
    let rect = canvas.getBoundingClientRect();
    raquetePlayer.posicao.y = evento.clientY - rect.top - raquetePlayer.altura / 2;
}

function reiniciarBola(){// Funcao para reiniciar a bola apos marcar um ponto
    bola.posicao = new Vetor2D(canvas.width / 2, canvas.height / 2);
    bola.velocidade = new Vetor2D(-bola.velocidade.x, bola.velocidade.y);
    bola.velocidade.multiplicar(7 / bola.velocidade.tamanho());
}

function placarJogo(texto, x, y){//Exibe o placar do jogo
    contexto.fillStyle = "#fff";
    contexto.font = "30px Arial";
    contexto.fillText(texto, x, y);
}

function Colisoes(bola, raquete){//Verifica as colisoes utilizando a altura largura e posicao da raquete e da bola
    raquete.topo = raquete.posicao.y;
    raquete.base = raquete.posicao.y + raquete.altura;
    raquete.esquerda = raquete.posicao.x;
    raquete.direita = raquete.posicao.x + raquete.largura;
    bola.topo = bola.posicao.y - bola.raio;
    bola.base = bola.posicao.y + bola.raio;
    bola.esquerda = bola.posicao.x - bola.raio;
    bola.direita = bola.posicao.x + bola.raio;

    return (raquete.esquerda < bola.direita && raquete.topo < bola.base &&
    raquete.direita > bola.esquerda && raquete.base > bola.topo);
}

function atualizar(){//Funcao para fazer atualizao dos atributos do jogo
    if(bola.posicao.x - bola.raio < 0){
        raqueteMaquina.pontos++;
        reiniciarBola();
    }else if(bola.posicao.x + bola.raio > canvas.width){
        raquetePlayer.pontos++;
        reiniciarBola();
    }

    bola.posicao.adicionar(bola.velocidade);

    let alvoY = bola.posicao.y - (raqueteMaquina.altura / 2);
    let deltaY = alvoY - raqueteMaquina.posicao.y;
    raqueteMaquina.posicao.y += deltaY * 0.1;

    if(bola.posicao.y - bola.raio < 0 || bola.posicao.y + bola.raio > canvas.height){
        bola.velocidade.y = -bola.velocidade.y;
    }
    let raquete = (bola.posicao.x + bola.raio < canvas.width / 2) ? raquetePlayer : raqueteMaquina;

    if(Colisoes(bola, raquete)){
        let pontoDeColisao = (bola.posicao.y - (raquete.posicao.y + raquete.altura / 2));
        pontoDeColisao = pontoDeColisao / (raquete.altura / 2);
        let angulo1 = (Math.PI / 4) * pontoDeColisao;
        let direcao = (bola.posicao.x + bola.raio < canvas.width / 2) ? 1 : -1;//se for 1 bola sobe e -1 desce
        bola.velocidade = new Vetor2D(direcao * bola.velocidade.tamanho() * Math.cos(angulo1),
        bola.velocidade.tamanho() * Math.sin(angulo1));
        bola.velocidade.multiplicar(1.1);
    }
}

function exibir(){//Carrega os itens graficos do jogo
    criarCampo(0, 0, canvas.width, canvas.height, "#004d00");
    placarJogo(raquetePlayer.pontos, canvas.width / 4, canvas.height / 5);
    placarJogo(raqueteMaquina.pontos, 3 * canvas.width / 4, canvas.height / 5);
    criarCampo(raquetePlayer.posicao.x, raquetePlayer.posicao.y, raquetePlayer.largura, raquetePlayer.altura, raquetePlayer.cor);
    criarCampo(raqueteMaquina.posicao.x, raqueteMaquina.posicao.y, raqueteMaquina.largura, raqueteMaquina.altura, raqueteMaquina.cor);
    criarBola(bola.posicao.x, bola.posicao.y, bola.raio, bola.cor);
}

function jogo(){// Principal funcao do jogo
    atualizar();
    exibir();
}

let fps = 60;
let loop = setInterval(jogo, 1000 / fps);
