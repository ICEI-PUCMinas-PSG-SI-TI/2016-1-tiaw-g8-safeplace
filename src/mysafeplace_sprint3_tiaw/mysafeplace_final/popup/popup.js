// Os dados vêm do "db" local (shared/supabase.js), carregado antes deste script.
function fetchSupabase(tabela, filtros = {}) {
  return db.get(tabela, filtros);
}

function fecharPopup() {
  const overlay = document.getElementById('popup-overlay');
  if (overlay) { overlay.classList.add('popup-saindo'); setTimeout(() => overlay.remove(), 300); }
}

function criarBotao(botao) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = botao.classe_css;
  btn.dataset.acao = botao.tipo_acao;
  if (botao.icone) {
    const icone = document.createElement('i');
    icone.className = `bi ${botao.icone} me-2`;
    btn.appendChild(icone);
  }
  btn.appendChild(document.createTextNode(botao.texto));
  btn.addEventListener('click', function() {
    if (this.dataset.acao === 'fechar_modal') {
      fecharPopup();
    } else if (this.dataset.acao === 'abrir_chamada_chat') {
      fetchSupabase('opcoes_atendimento').then(opcoes => abrirSegundoPopup(opcoes));
    }
  });
  return btn;
}

function criarOpcaoAtendimento(opcao) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `popup-opcao-atendimento ${opcao.classe_css}`;
  btn.innerHTML = `<i class="bi ${opcao.icone} popup-opcao-icone"></i>
    <span><span class="popup-opcao-titulo">${opcao.titulo}</span>
    <span class="popup-opcao-desc">${opcao.descricao}</span></span>`;
  btn.addEventListener('mouseenter', function() { this.style.transform='translateY(-3px) scale(1.02)'; });
  btn.addEventListener('mouseleave', function() { this.style.transform=''; });
  btn.addEventListener('click', function() {
    if (opcao.link) { window.open(opcao.link, '_blank'); }
    else {
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
  overlay.addEventListener('click', e => { if (e.target === overlay) fecharPopup(); });
  const card = document.createElement('div');
  card.className = 'card text-center popup-card popup-card-segundo';
  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header popup-card-header';
  const btnFechar = document.createElement('button');
  btnFechar.type = 'button'; btnFechar.className = 'popup-btn-fechar';
  btnFechar.innerHTML = '<i class="bi bi-x-lg"></i>';
  btnFechar.addEventListener('click', fecharPopup);
  const titulo = document.createElement('h5');
  titulo.className = 'popup-segundo-titulo';
  titulo.textContent = 'Como prefere ser atendido?';
  const desc = document.createElement('p');
  desc.className = 'popup-segundo-descricao';
  desc.textContent = 'Escolha a forma de atendimento com a qual se sente mais confortável.';
  cardHeader.appendChild(btnFechar); cardHeader.appendChild(titulo); cardHeader.appendChild(desc);
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body popup-card-body popup-segundo-body';
  opcoes.forEach(o => cardBody.appendChild(criarOpcaoAtendimento(o)));
  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer popup-card-footer';
  cardFooter.textContent = 'Você não está sozinho. Estamos aqui por você.';
  card.appendChild(cardHeader); card.appendChild(cardBody); card.appendChild(cardFooter);
  overlay.appendChild(card); document.body.appendChild(overlay);
}

function renderizarPopup(dados, frase) {
  const overlay = document.createElement('div');
  overlay.id = 'popup-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) fecharPopup(); });
  const card = document.createElement('div');
  card.className = 'card text-center popup-card';
  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header popup-card-header';
  const icone = document.createElement('i');
  icone.className = `bi ${dados.icone} popup-icone-alerta`;
  const btnFechar = document.createElement('button');
  btnFechar.type = 'button'; btnFechar.className = 'popup-btn-fechar';
  btnFechar.innerHTML = '<i class="bi bi-x-lg"></i>';
  btnFechar.addEventListener('click', fecharPopup);
  cardHeader.appendChild(icone); cardHeader.appendChild(btnFechar);
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body popup-card-body';
  const titulo = document.createElement('h5');
  titulo.className = 'card-title popup-titulo';
  titulo.textContent = dados.titulo;
  const descricao = document.createElement('p');
  descricao.className = 'card-text popup-descricao';
  descricao.textContent = dados.descricao;
  const wrapperBotoes = document.createElement('div');
  wrapperBotoes.className = 'popup-botoes';
  dados.botoes.forEach(b => wrapperBotoes.appendChild(criarBotao(b)));
  cardBody.appendChild(titulo); cardBody.appendChild(descricao); cardBody.appendChild(wrapperBotoes);
  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer popup-card-footer';
  if (frase) {
    const aspas = document.createElement('i');
    aspas.className = 'bi bi-quote me-1';
    cardFooter.appendChild(aspas);
    cardFooter.appendChild(document.createTextNode(frase));
  }
  card.appendChild(cardHeader); card.appendChild(cardBody); card.appendChild(cardFooter);
  overlay.appendChild(card); document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', function() {
  if (sessionStorage.getItem('msp_popup_visto')) return;
  Promise.all([
    fetchSupabase('popup_emergencial').then(d => d[0]),
    fetchSupabase('frases_motivacionais')
  ]).then(([dadosPopup, frases]) => {
    if (!dadosPopup || !dadosPopup.ativo) return;
    let fraseSorteada = null;
    if (frases && frases.length > 0) {
      fraseSorteada = frases[Math.floor(Math.random() * frases.length)].frase;
    }
    renderizarPopup(dadosPopup, fraseSorteada);
    sessionStorage.setItem('msp_popup_visto', 'true');
  }).catch(err => console.error('Erro ao carregar popup:', err));
});

function mostrarToastPopup(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1e5c38;color:#fff;padding:14px 20px;border-radius:10px;font-size:14px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:9999;max-width:320px;line-height:1.5;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity 0.3s'; setTimeout(()=>toast.remove(),300); }, 3500);
}
