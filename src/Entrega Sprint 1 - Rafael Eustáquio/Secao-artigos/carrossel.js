document.addEventListener('DOMContentLoaded', function () {

  fetch('http://localhost:3000/artigos')
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (artigos) {

      var destaques = artigos.filter(function (artigo) {
        return artigo.destaque === true;
      });

      var track = document.getElementById('carousel-track');
      var indicators = document.getElementById('carousel-indicators');
      var btnPrev = document.getElementById('carousel-prev');
      var btnNext = document.getElementById('carousel-next');

      var visiveis = 3;
      var atual = 0;
      var total = destaques.length;

      destaques.forEach(function (artigo) {
        var col = document.createElement('div');
        col.classList.add('carousel-card-col');

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
          '<div class="texto-autor">' +
          '<strong>' + artigo.autor + '</strong><br>' +
          artigo.data +
          '</div>' +
          '<div class="d-flex gap-2 flex-wrap">' +
          '<button class="btn btn-outline-secondary btn-curtir" data-id="' + artigo.id + '">' +
          '<i class="bi bi-heart"></i> <span class="contagem-likes">' + artigo.likes + '</span>' +
          '</button>' +
          '<button class="btn btn-outline-secondary btn-compartilhar" data-id="' + artigo.id + '">' +
          '<i class="bi bi-share"></i> Compartilhar' +
          '</button>' +
          '<a href="artigo.html?id=' + artigo.id + '" class="btn btn-leia-mais">Leia mais</a>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>';

        track.appendChild(col);
      });

      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.setAttribute('type', 'button');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.setAttribute('data-index', String(i));
        if (i === 0) dot.classList.add('active');
        indicators.appendChild(dot);
      }

      function maxIndex() {
        return Math.max(0, total - visiveis);
      }

      function mover(novoIndex) {
        atual = Math.max(0, Math.min(novoIndex, maxIndex()));
        var pct = (100 / visiveis) * atual;
        track.style.transform = 'translateX(-' + pct + '%)';

        indicators.querySelectorAll('button').forEach(function (dot, i) {
          dot.classList.toggle('active', i === atual);
        });

        btnPrev.disabled = atual === 0;
        btnNext.disabled = atual >= maxIndex();
      }

      btnPrev.addEventListener('click', function () { mover(atual - 1); });
      btnNext.addEventListener('click', function () { mover(atual + 1); });

      indicators.querySelectorAll('button').forEach(function (dot) {
        dot.addEventListener('click', function () {
          mover(parseInt(this.getAttribute('data-index')));
        });
      });

      mover(0);

      document.getElementById('mensagem-carregando').classList.add('d-none');
      document.getElementById('carousel-wrapper').classList.remove('d-none');

      registrarEventoCurtir();
      registrarEventoCompartilhar();
    })
    .catch(function (erro) {
      document.getElementById('mensagem-carregando').innerHTML =
        '<i class="bi bi-exclamation-circle text-danger"></i> ' +
        'Não foi possível carregar os artigos. Verifique se o JSONServer está rodando.';
      console.error('Erro ao buscar artigos:', erro);
    });

});


function registrarEventoCurtir() {
  document.querySelectorAll('.btn-curtir').forEach(function (btn) {
    btn.addEventListener('click', function () {

      var id = this.getAttribute('data-id');
      var spanLikes = this.querySelector('.contagem-likes');
      var jaCurtiu = this.classList.contains('curtido');
      var novoLikes = jaCurtiu
        ? parseInt(spanLikes.textContent) - 1
        : parseInt(spanLikes.textContent) + 1;

      fetch('http://localhost:3000/artigos/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: novoLikes })
      });

      spanLikes.textContent = novoLikes;
      this.classList.toggle('curtido');
    });
  });
}


function registrarEventoCompartilhar() {
  document.querySelectorAll('.btn-compartilhar').forEach(function (btn) {
    btn.addEventListener('click', function () {

      var id = this.getAttribute('data-id');
      var url = window.location.origin + '/artigo.html?id=' + id;

      if (navigator.share) {
        navigator.share({ title: 'mySafePlace', url: url });
      } else {
        navigator.clipboard.writeText(url).then(function () {
          alert('Link copiado para a área de transferência!');
        });
      }
    });
  });
}
