document.addEventListener('DOMContentLoaded', function () {
  var todosOsArtigos = [];

  var grade = document.getElementById('container-grade');
  var carregando = document.getElementById('mensagem-carregando');
  var inputBusca = document.getElementById('input-busca');
  var selectCat = document.getElementById('select-categoria');
  var contador = document.getElementById('contador-resultados');

  fetch('http://localhost:3000/artigos')
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (artigos) {
      todosOsArtigos = artigos.filter(function (a) { return a.publicado; });

      carregando.classList.add('d-none');
      grade.classList.remove('d-none');

      renderizarArtigos(todosOsArtigos);
    })
    .catch(function (erro) {
      carregando.innerHTML = '<i class="bi bi-exclamation-circle text-danger"></i> Erro ao conectar à API do JSONServer.';
      console.error(erro);
    });

  function renderizarArtigos(lista) {
    grade.innerHTML = '';
    contador.textContent = lista.length + ' artigo(s)';

    if (lista.length === 0) {
      grade.innerHTML = '<div class="col-12 text-center py-5 text-muted"><i class="bi bi-folder-x" style="font-size:2rem;"></i><p class="mt-2">Nenhum artigo corresponde à sua busca.</p></div>';
      return;
    }

    lista.forEach(function (artigo) {
      var col = document.createElement('div');
      col.classList.add('col-12', 'col-md-6', 'col-lg-4');

      col.innerHTML =
        '<div class="card h-100">' +
        '<img src="' + artigo.imagemCapa + '" class="card-img-top" alt="' + artigo.imagemAlt + '">' +
        '<div class="card-body d-flex flex-column">' +
        '<span class="badge-categoria">' + artigo.categoria + '</span>' +
        '<h5 class="card-title">' +
        '<a href="artigo.html?id=' + artigo.id + '" class="text-decoration-none text-dark hover-verde">' + artigo.titulo + '</a>' +
        '</h5>' +
        '<p class="card-text flex-grow-1">' + artigo.resumo + '</p>' +
        '<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">' +
        '<span class="texto-autor text-truncate" style="max-width:150px;">' + artigo.autor + '</span>' +
        '<a href="artigo.html?id=' + artigo.id + '" class="btn btn-sm btn-success px-3">Ler mais</a>' +
        '</div>' +
        '</div>' +
        '<div class="card-footer bg-white border-top-0 d-flex justify-content-between py-3 px-3">' +
        '<button class="btn-acao-card btn-curtir-lista" data-id="' + artigo.id + '">' +
        '<i class="bi bi-heart"></i> <span class="num-likes">' + artigo.likes + '</span>' +
        '</button>' +
        '<button class="btn-acao-card btn-compartilhar-lista" data-id="' + artigo.id + '">' +
        '<i class="bi bi-share"></i> Compartilhar' +
        '</button>' +
        '</div>' +
        '</div>';

      grade.appendChild(col);
    });

    registrarEventosDeInteracao();
  }

  function aplicarFiltros() {
    var termo = inputBusca.value.toLowerCase().strip || inputBusca.value.toLowerCase();
    var catSelecionada = selectCat.value;

    var filtrados = todosOsArtigos.filter(function (artigo) {
      var bateTexto = artigo.titulo.toLowerCase().includes(termo) ||
        artigo.resumo.toLowerCase().includes(termo) ||
        artigo.tags.some(function (t) { return t.toLowerCase().includes(termo); });

      var bateCategoria = catSelecionada === "" || artigo.categoria === catSelecionada;

      return bateTexto && bateCategoria;
    });

    renderizarArtigos(filtrados);
  }

  inputBusca.addEventListener('input', aplicarFiltros);
  selectCat.addEventListener('change', aplicarFiltros);

  function registrarEventosDeInteracao() {
    document.querySelectorAll('.btn-curtir-lista').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        var span = this.querySelector('.num-likes');
        var jaCurtiu = this.classList.contains('text-danger');
        var totalLikes = parseInt(span.textContent);
        var novoLikes = jaCurtiu ? totalLikes - 1 : totalLikes + 1;

        fetch('http://localhost:3000/artigos/' + id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likes: novoLikes })
        });

        span.textContent = novoLikes;
        this.classList.toggle('text-danger');
        this.classList.toggle('fw-bold');
      });
    });

    document.querySelectorAll('.btn-compartilhar-lista').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        var url = window.location.origin + '/artigo.html?id=' + id;
        if (navigator.share) {
          navigator.share({ title: 'mySafePlace', url: url });
        } else {
          navigator.clipboard.writeText(url);
          alert('Link copiado para a área de transferência!');
        }
      });
    });
  }
});
