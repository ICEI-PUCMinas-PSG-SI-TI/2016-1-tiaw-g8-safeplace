const API_POPUP   = 'http://localhost:3000/popup_emergencial/1';
const API_FRASES  = 'http://localhost:3000/frases_motivacionais';
const API_OPCOES  = 'http://localhost:3000/opcoes_atendimento';

function fecharPopup() {
  const overlay = document.getElementById('popup-overlay');
  if (overlay) {
    overlay.classList.add('popup-saindo');
    setTimeout(function () { overlay.remove(); }, 300);
  }
}

function criarBotao(botao) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = botao.classe_css;
  btn.dataset.acao = botao.tipo_acao;

  if (botao.icone) {
    const icone = document.createElement('i');
    icone.className = `bi ${botao.icone} me-2`;
    icone.setAttribute('aria-hidden', 'true');
    btn.appendChild(icone);
  }

  btn.appendChild(document.createTextNode(botao.texto));

  btn.addEventListener('click', function () {
    if (this.dataset.acao === 'fechar_modal') {
      fecharPopup();
    } else if (this.dataset.acao === 'abrir_chamada_chat') {
      fetch(API_OPCOES)
        .then(function (r) { return r.json(); })
        .then(function (opcoes) { abrirSegundoPopup(opcoes); })
        .catch(function (err) { console.error('Erro ao buscar opções de atendimento:', err); });
    }
  });

  return btn;
}

function criarOpcaoAtendimento(opcao) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `popup-opcao-atendimento ${opcao.classe_css}`;

  btn.innerHTML = `
    <i class="bi ${opcao.icone} popup-opcao-icone" aria-hidden="true"></i>
    <span>
      <span class="popup-opcao-titulo">${opcao.titulo}</span>
      <span class="popup-opcao-desc">${opcao.descricao}</span>
    </span>
  `;

  btn.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-3px) scale(1.02)';
    this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)';
  });

  btn.addEventListener('mouseleave', function () {
    this.style.transform = '';
    this.style.boxShadow = '';
  });

  btn.addEventListener('click', function () {
    if (opcao.link) {
      window.open(opcao.link, '_blank');
    } else {
      fecharPopup();
      mostrarToastPopup(`Conectando você ao atendimento via ${opcao.titulo}. Aguarde...`);
    }
  });

  return btn;
}

function abrirSegundoPopup(opcoes) {
  fecharPopup();

  const overlay = document.createElement('div');
  overlay.id = 'popup-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'popup2-titulo');
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) fecharPopup();
  });

  const card = document.createElement('div');
  card.className = 'card text-center popup-card popup-card-segundo';

  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header popup-card-header';

  const btnFechar = document.createElement('button');
  btnFechar.type = 'button';
  btnFechar.className = 'popup-btn-fechar';
  btnFechar.setAttribute('aria-label', 'Fechar');
  btnFechar.innerHTML = '<i class="bi bi-x-lg"></i>';
  btnFechar.addEventListener('click', fecharPopup);

  const titulo = document.createElement('h5');
  titulo.id = 'popup2-titulo';
  titulo.className = 'popup-segundo-titulo';
  titulo.textContent = 'Como prefere ser atendido?';

  const descricao = document.createElement('p');
  descricao.className = 'popup-segundo-descricao';
  descricao.textContent = 'Escolha a forma de atendimento com a qual se sente mais confortável.';

  cardHeader.appendChild(btnFechar);
  cardHeader.appendChild(titulo);
  cardHeader.appendChild(descricao);

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body popup-card-body popup-segundo-body';

  opcoes.forEach(function (opcao) {
    cardBody.appendChild(criarOpcaoAtendimento(opcao));
  });

  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer popup-card-footer';
  cardFooter.textContent = 'Você não está sozinho. Estamos aqui por você.';

  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

function renderizarPopup(dados, frase) {
  const overlay = document.createElement('div');
  overlay.id = 'popup-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'popup-titulo');
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) fecharPopup();
  });

  const card = document.createElement('div');
  card.className = 'card text-center popup-card';

  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header popup-card-header';

  const icone = document.createElement('i');
  icone.className = `bi ${dados.icone} popup-icone-alerta`;
  icone.setAttribute('aria-hidden', 'true');

  const btnFechar = document.createElement('button');
  btnFechar.type = 'button';
  btnFechar.className = 'popup-btn-fechar';
  btnFechar.setAttribute('aria-label', 'Fechar');
  btnFechar.innerHTML = '<i class="bi bi-x-lg"></i>';
  btnFechar.addEventListener('click', fecharPopup);

  cardHeader.appendChild(icone);
  cardHeader.appendChild(btnFechar);

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body popup-card-body';

  const titulo = document.createElement('h5');
  titulo.id = 'popup-titulo';
  titulo.className = 'card-title popup-titulo';
  titulo.textContent = dados.titulo;

  const descricao = document.createElement('p');
  descricao.className = 'card-text popup-descricao';
  descricao.textContent = dados.descricao;

  const wrapperBotoes = document.createElement('div');
  wrapperBotoes.className = 'popup-botoes';
  dados.botoes.forEach(function (botao) {
    wrapperBotoes.appendChild(criarBotao(botao));
  });

  cardBody.appendChild(titulo);
  cardBody.appendChild(descricao);
  cardBody.appendChild(wrapperBotoes);

  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer popup-card-footer';

  if (frase) {
    const aspas = document.createElement('i');
    aspas.className = 'bi bi-quote me-1';
    aspas.setAttribute('aria-hidden', 'true');
    cardFooter.appendChild(aspas);
    cardFooter.appendChild(document.createTextNode(frase));
  } else {
    cardFooter.textContent = 'mySafePlace – Cuidando da sua saúde mental';
  }

  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', function () {
  // Mostrar popup apenas uma vez por sessão
  var jaViu = sessionStorage.getItem('msp_popup_visto');
  if (jaViu) return;

  Promise.all([
    fetch(API_POPUP).then(function (r) { return r.json(); }),
    fetch(API_FRASES).then(function (r) { return r.json(); })
  ])
    .then(function (resultados) {
      const dadosPopup = resultados[0];
      const frases     = resultados[1];

      if (!dadosPopup.ativo) return;

      let fraseSorteada = null;
      if (frases && frases.length > 0) {
        fraseSorteada = frases[Math.floor(Math.random() * frases.length)].frase;
      }

      renderizarPopup(dadosPopup, fraseSorteada);
      sessionStorage.setItem('msp_popup_visto', 'true');
    })
    .catch(function (err) {
      console.error('Não foi possível carregar o pop-up emergencial:', err);
    });
});

function mostrarToastPopup(msg) {
  var toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1e5c38;color:#fff;padding:14px 20px;border-radius:10px;font-size:14px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:9999;max-width:320px;line-height:1.5;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(function () { toast.remove(); }, 300);
  }, 3500);
}
