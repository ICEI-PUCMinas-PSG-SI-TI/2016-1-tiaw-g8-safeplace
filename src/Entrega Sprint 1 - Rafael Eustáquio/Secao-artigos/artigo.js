document.addEventListener('DOMContentLoaded', function () {
  var parametros = new URLSearchParams(window.location.search);
  var idArtigo = parametros.get('id');

  if (!idArtigo) {
    console.warn('ID do artigo não encontrado na URL. Redirecionando...');
    window.location.href = 'artigos.html'; 
    return;
  }

  fetch('http://localhost:3000/artigos/' + idArtigo)
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error('Artigo não encontrado no servidor');
      }
      return resposta.json();
    })
    .then(function (artigo) {
      document.getElementById('mensagem-carregando').classList.add('d-none');
      document.getElementById('conteudo-artigo').classList.remove('d-none');
      
      var capa = document.getElementById('capa-artigo');
      capa.src = artigo.imagemCapa;
      capa.alt = artigo.imagemAlt;
      capa.classList.remove('d-none');

      document.getElementById('categoria-artigo').textContent = artigo.categoria;
      document.getElementById('titulo-artigo').textContent = artigo.titulo;
      document.getElementById('autor-artigo').textContent = artigo.autor;
      document.getElementById('data-artigo').textContent = artigo.data;
      document.getElementById('texto-artigo').innerHTML = artigo.texto;
      document.getElementById('likes-artigo').textContent = artigo.likes;

      var btnCurtir = document.getElementById('btn-curtir');
      btnCurtir.addEventListener('click', function() {
        var jaCurtiu = this.classList.contains('btn-danger');
        var novoLikes = jaCurtiu ? artigo.likes : artigo.likes + 1;
        
        fetch('http://localhost:3000/artigos/' + idArtigo, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likes: novoLikes })
        }).then(function() {
          document.getElementById('likes-artigo').textContent = novoLikes;
        });

        this.classList.toggle('btn-danger');
        this.classList.toggle('text-white');
      });

      carregarRelacionados(artigo);
    })
    .catch(function (erro) {
      console.error(erro);
      mostrarMensagemErro();
    });
});

function carregarRelacionados(artigoAtual) {
  fetch('http://localhost:3000/artigos')
    .then(res => res.json())
    .then(todos => {
      var relacionados = todos.filter(function (a) {
        return a.categoria === artigoAtual.categoria && a.id !== artigoAtual.id && a.publicado;
      });

      if (relacionados.length === 0) {
        relacionados = todos.filter(function (a) {
          return a.id !== artigoAtual.id && a.publicado;
        });
      }

      relacionados = relacionados.slice(0, 3);
      var grade = document.getElementById('grade-relacionados');
      grade.innerHTML = '';

      relacionados.forEach(function (rel) {
        var col = document.createElement('div');
        col.classList.add('col-12', 'col-sm-6', 'col-md-4');
        col.innerHTML =
          '<a href="artigo.html?id=' + rel.id + '" class="text-decoration-none">' +
            '<div class="card-relacionado">' +
              '<img src="' + rel.imagemCapa + '" alt="' + rel.imagemAlt + '">' +
              '<div class="card-body p-3">' +
                '<span class="badge-categoria">' + rel.categoria + '</span>' +
                '<h6 class="card-title mt-2" style="color: #1a1a1a;">' + rel.titulo + '</h6>' +
                '<p style="font-size:0.8rem;color:#888;margin:0;">' + rel.autor + '</p>' +
              '</div>' +
            '</div>' +
          '</a>';
        grade.appendChild(col);
      });
    });
}

function mostrarMensagemErro() {
  document.getElementById('mensagem-carregando').classList.add('d-none');
  var container = document.getElementById('container-artigo');
  if (container) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
        <h3 class="mt-3">Artigo não encontrado</h3>
        <p class="text-muted">O conteúdo que você está tentando acessar não existe ou foi removido.</p>
        <a href="artigos.html" class="btn btn-success mt-2">Voltar para todos os artigos</a>
      </div>
    `;
  }
}
