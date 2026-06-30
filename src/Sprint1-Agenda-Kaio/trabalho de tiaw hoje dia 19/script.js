const API = 'http://localhost:3000/entradas';

let entradaAtualId = null;
let humorSelecionado = '';
let climaSelecionado = '';

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  mostrarData();
  carregarEntradas();
  calcularSequencia();

  document.getElementById('conteudo-entrada').addEventListener('input', contarPalavras);
});

// ── DATA ──
function mostrarData() {
  const agora = new Date();
  const opcoes = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  let texto = agora.toLocaleDateString('pt-BR', opcoes);
  texto = texto.charAt(0).toUpperCase() + texto.slice(1);
  document.getElementById('data-atual').textContent = texto;
}

// ── CARREGAR LISTA ──
async function carregarEntradas() {
  try {
    const res = await fetch(API + '?_sort=data&_order=desc');
    const entradas = await res.json();
    renderizarLista(entradas);
  } catch (e) {
    console.error('Erro ao carregar entradas:', e);
    alert('Servidor não encontrado. Rode: npx json-server db.json');
  }
}

function renderizarLista(entradas) {
  const lista = document.getElementById('lista-entradas');
  lista.innerHTML = '';

  entradas.forEach(e => {
    const div = document.createElement('div');
    div.className = 'entrada-item' + (e.id === entradaAtualId ? ' ativa' : '');
    div.onclick = (event) => abrirEntrada(e, event);

    const dataFormatada = formatarData(e.data);
    div.innerHTML = `
      <div class="entrada-data">
        <span>${dataFormatada}</span>
        <span>${e.humor || ''}</span>
      </div>
      <div class="entrada-titulo">${e.titulo}</div>
      <div class="entrada-preview">${e.conteudo}</div>
    `;
    lista.appendChild(div);
  });
}

function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia} Abr ${ano}`;
}

// ── ABRIR ENTRADA ──
function abrirEntrada(e, event) {
  entradaAtualId = e.id;
  document.getElementById('titulo-entrada').value = e.titulo;
  document.getElementById('conteudo-entrada').value = e.conteudo;
  contarPalavras();

  // humor
  document.querySelectorAll('.emoji-btn[data-humor]').forEach(btn => {
    btn.classList.toggle('selecionado', btn.dataset.humor === e.humor);
  });
  humorSelecionado = e.humor || '';

  // clima
  document.querySelectorAll('.emoji-btn[data-clima]').forEach(btn => {
    btn.classList.toggle('selecionado', btn.dataset.clima === e.clima);
  });
  climaSelecionado = e.clima || '';

  // tags
  const areaTag = document.getElementById('area-tags');
  areaTag.innerHTML = '';
  (e.tags || []).forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    span.onclick = () => removerTag(span);
    areaTag.appendChild(span);
  });
  const btnAdd = document.createElement('button');
  btnAdd.id = 'btn-add-tag';
  btnAdd.textContent = '+';
  btnAdd.onclick = adicionarTag;
  areaTag.appendChild(btnAdd);

  // destacar item ativo
  document.querySelectorAll('.entrada-item').forEach(el => el.classList.remove('ativa'));
  if (event && event.currentTarget) event.currentTarget.classList.add('ativa');
}

// ── NOVA ENTRADA ──
document.getElementById('btn-nova').addEventListener('click', () => {
  entradaAtualId = null;
  document.getElementById('titulo-entrada').value = '';
  document.getElementById('conteudo-entrada').value = '';
  humorSelecionado = '';
  climaSelecionado = '';
  contarPalavras();

  document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selecionado'));

  const areaTag = document.getElementById('area-tags');
  areaTag.innerHTML = '<button id="btn-add-tag" onclick="adicionarTag()">+</button>';

  document.querySelectorAll('.entrada-item').forEach(el => el.classList.remove('ativa'));
});

// ── SALVAR ──
async function salvarEntrada() {
  const titulo = document.getElementById('titulo-entrada').value.trim();
  const conteudo = document.getElementById('conteudo-entrada').value.trim();

  if (!titulo) { alert('Coloque um título!'); return; }

  const tags = Array.from(document.querySelectorAll('#area-tags .tag')).map(t => t.textContent);
  const palavras = contarPalavras();

  const dados = {
    data: new Date().toISOString().split('T')[0],
    titulo,
    conteudo,
    humor: humorSelecionado,
    clima: climaSelecionado,
    tags,
    palavras
  };

  try {
    if (entradaAtualId) {
      // PUT — atualizar
      await fetch(`${API}/${entradaAtualId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entradaAtualId, ...dados })
      });
    } else {
      // POST — criar nova
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const nova = await res.json();
      entradaAtualId = nova.id;
    }

    await carregarEntradas();
    await calcularSequencia();

    // destacar item salvo na sidebar
    document.querySelectorAll('.entrada-item').forEach(el => el.classList.remove('ativa'));
    const itens = document.querySelectorAll('.entrada-item');
    itens.forEach(el => {
      const tituloEl = el.querySelector('.entrada-titulo');
      if (tituloEl && tituloEl.textContent === titulo) el.classList.add('ativa');
    });

    alert('Entrada salva!');
  } catch (e) {
    console.error('Erro ao salvar:', e);
    alert('Erro ao salvar. O servidor está rodando?');
  }
}

// ── CONTAGEM DE PALAVRAS ──
function contarPalavras() {
  const texto = document.getElementById('conteudo-entrada').value.trim();
  const qtd = texto ? texto.split(/\s+/).length : 0;
  document.getElementById('contagem-palavras').textContent = qtd;
  return qtd;
}

// ── SEQUÊNCIA ──
async function calcularSequencia() {
  try {
    const res = await fetch(API + '?_sort=data&_order=desc');
    const entradas = await res.json();

    if (!entradas.length) { atualizarSequencia(0); return; }

    let seq = 1;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const datas = [...new Set(entradas.map(e => e.data))].sort((a, b) => b.localeCompare(a));

    let ref = new Date(datas[0]);
    ref.setHours(0, 0, 0, 0);

    // aceita se a última entrada foi hoje ou ontem
    const diff = (hoje - ref) / (1000 * 60 * 60 * 24);
    if (diff > 1) { atualizarSequencia(1); return; }

    for (let i = 1; i < datas.length; i++) {
      const anterior = new Date(datas[i]);
      anterior.setHours(0, 0, 0, 0);
      const delta = (ref - anterior) / (1000 * 60 * 60 * 24);
      if (delta === 1) { seq++; ref = anterior; } else break;
    }

    atualizarSequencia(seq);
  } catch (e) {
    atualizarSequencia(0);
  }
}

function atualizarSequencia(n) {
  document.getElementById('sequencia-num').textContent = n;
}

// ── SELEÇÃO DE HUMOR ──
document.querySelectorAll('.emoji-btn[data-humor]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.emoji-btn[data-humor]').forEach(b => b.classList.remove('selecionado'));
    btn.classList.add('selecionado');
    humorSelecionado = btn.dataset.humor;
  });
});

// ── SELEÇÃO DE CLIMA ──
document.querySelectorAll('.emoji-btn[data-clima]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.emoji-btn[data-clima]').forEach(b => b.classList.remove('selecionado'));
    btn.classList.add('selecionado');
    climaSelecionado = btn.dataset.clima;
  });
});

// ── TAGS ──
function adicionarTag() {
  const nome = prompt('Nome da tag:');
  if (!nome) return;
  const area = document.getElementById('area-tags');
  const span = document.createElement('span');
  span.className = 'tag';
  span.textContent = nome.trim();
  span.onclick = () => removerTag(span);
  area.insertBefore(span, document.getElementById('btn-add-tag'));
}

function removerTag(el) {
  if (confirm(`Remover tag "${el.textContent}"?`)) el.remove();
}
