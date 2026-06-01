var obras = [];

var listaObras = document.getElementById("listaObras");
var pesquisa = document.getElementById("pesquisa");
var filtroTipo = document.getElementById("filtroTipo");
var ordenacao = document.getElementById("ordenacao");
var resultadoTexto = document.getElementById("resultadoTexto");

fetch("dados.json")
  .then(function(resposta) {
    return resposta.json();
  })
  .then(function(dados) {
    obras = dados;
    colocarTipos();
    mostrarNumeros();
    mostrarCatalogo();
  })
  .catch(function() {
    listaObras.innerHTML = "<p class='erro'>Erro ao carregar as obras.</p>";
  });

function colocarTipos() {
  var tipos = [];

  for (var i = 0; i < obras.length; i++) {
    if (obras[i].tipo && tipos.indexOf(obras[i].tipo) === -1) {
      tipos.push(obras[i].tipo);
    }
  }

  tipos.sort();

  for (var j = 0; j < tipos.length; j++) {
    filtroTipo.innerHTML = filtroTipo.innerHTML + "<option value='" + tipos[j] + "'>" + tipos[j] + "</option>";
  }
}

function mostrarNumeros() {
  var tipos = [];

  for (var i = 0; i < obras.length; i++) {
    if (obras[i].tipo && tipos.indexOf(obras[i].tipo) === -1) {
      tipos.push(obras[i].tipo);
    }
  }

  document.getElementById("totalObras").innerHTML = obras.length;
  document.getElementById("totalTipos").innerHTML = tipos.length;
}

function mostrarCatalogo() {
  var lista = [];
  var texto = pesquisa.value.toLowerCase();
  var tipo = filtroTipo.value;
  var ordem = ordenacao.value;

  for (var i = 0; i < obras.length; i++) {
    var obra = obras[i];
    var titulo = String(obra.titulo).toLowerCase();
    var artista = String(obra.artista).toLowerCase();
    var serve = true;

    if (texto !== "" && titulo.indexOf(texto) === -1 && artista.indexOf(texto) === -1) {
      serve = false;
    }

    if (tipo !== "todos" && obra.tipo !== tipo) {
      serve = false;
    }

    if (serve) {
      lista.push(obra);
    }
  }

  if (ordem === "ano-asc") {
    lista.sort(function(a, b) {
      return Number(a.anoOrdenacao) - Number(b.anoOrdenacao);
    });
  }

  if (ordem === "ano-desc") {
    lista.sort(function(a, b) {
      return Number(b.anoOrdenacao) - Number(a.anoOrdenacao);
    });
  }

  if (ordem === "titulo-asc") {
    lista.sort(function(a, b) {
      return String(a.titulo).localeCompare(String(b.titulo));
    });
  }

  escreverObras(lista);
}

function escreverObras(lista) {
  listaObras.innerHTML = "";
  resultadoTexto.innerHTML = lista.length + " obra(s) encontrada(s).";

  if (lista.length === 0) {
    listaObras.innerHTML = "<p>Nenhuma obra encontrada.</p>";
    return;
  }

  for (var i = 0; i < lista.length; i++) {
    var obra = lista[i];
    var card = document.createElement("article");
    card.className = "card";

    card.innerHTML = "<div class='imagem-card'>" +
      "<img src='" + obra.imagem + "' alt='" + obra.titulo + "'>" +
      "</div>" +
      "<div class='card-conteudo'>" +
      "<span class='tipo'>" + obra.tipo + "</span>" +
      "<h3>" + obra.titulo + "</h3>" +
      "<p><b>Artista:</b> " + obra.artista + "</p>" +
      "<p><b>Ano:</b> " + obra.ano + "</p>" +
      "<p><b>Técnica:</b> " + obra.tecnica + "</p>" +
      "<p><b>Dimensões:</b> " + obra.dimensoes + "</p>" +
      "<a href='" + obra.fonte + "' target='_blank'>Ver detalhes</a>" +
      "</div>";

    listaObras.appendChild(card);
  }
}

pesquisa.addEventListener("input", mostrarCatalogo);
filtroTipo.addEventListener("change", mostrarCatalogo);
ordenacao.addEventListener("change", mostrarCatalogo);

var formContacto = document.getElementById("formContacto");
var modalContacto = document.getElementById("modalContacto");
var modalTitulo = document.getElementById("modalTitulo");
var modalMensagem = document.getElementById("modalMensagem");
var fecharModal = document.getElementById("fecharModal");

function abrirModal(titulo, mensagem) {
  modalTitulo.innerHTML = titulo;
  modalMensagem.innerHTML = mensagem;


  modalContacto.classList.add("ativo");
}

function fecharModalContacto() {
  modalContacto.classList.remove("ativo");
}

formContacto.addEventListener("submit", function(evento) {
  evento.preventDefault();

  var botao = formContacto.querySelector("button");
  var textoBotao = botao.innerHTML;
  var dados = new FormData(formContacto);

  botao.disabled = true;
  botao.innerHTML = "A enviar...";

  fetch("/contacto/", {
    method: "POST",
    body: dados
  })
    .then(function(resposta) {
      return resposta.json();
    })
    .then(function(dadosResposta) {
      if (dadosResposta.sucesso) {
        abrirModal("Mensagem enviada", dadosResposta.mensagem);
        formContacto.reset();
      } else {
        abrirModal("Erro", dadosResposta.mensagem);
      }
    })
    .catch(function() {
      abrirModal("Erro", "Não foi possível enviar a mensagem.");
    })
    .finally(function() {
      botao.disabled = false;
      botao.innerHTML = textoBotao;
    });
});

fecharModal.addEventListener("click", fecharModalContacto);
