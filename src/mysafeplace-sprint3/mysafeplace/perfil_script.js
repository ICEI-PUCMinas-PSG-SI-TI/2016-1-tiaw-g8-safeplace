// PERFIL
const API_URL_USUARIO = "http://localhost:3000/usuarios/1";

async function carregarPerfil() {
  try {
    const res = await fetch(API_URL_USUARIO);
    const perfil = await res.json();

    document.getElementById("nome").textContent = perfil.nome;
    document.getElementById("email").textContent = perfil.email;
    document.getElementById("telefone").textContent = perfil.telefone;
    document.getElementById("cidade").textContent = perfil.cidade;

    document.getElementById("editNome").value = perfil.nome;
    document.getElementById("editEmail").value = perfil.email;
    document.getElementById("editTelefone").value = perfil.telefone;
    document.getElementById("editCidade").value = perfil.cidade;
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
  }
}

function editar() {
  document.getElementById("form-edicao").classList.remove("hidden");
}

function cancelar() {
  document.getElementById("form-edicao").classList.add("hidden");
}

async function salvar() {
  const perfilAtualizado = {
    nome: document.getElementById("editNome").value,
    email: document.getElementById("editEmail").value,
    telefone: document.getElementById("editTelefone").value,
    cidade: document.getElementById("editCidade").value
  };

  await fetch(API_URL_USUARIO, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(perfilAtualizado)
  });

  cancelar();
  carregarPerfil();
}

function logout() {
  alert("Sessão encerrada!");
  window.location.href = "index.html";
}

carregarPerfil();

// FAVORITOS
async function carregarFavoritos() {
  try {
    const usuarioRes = await fetch(API_URL_USUARIO);
    const usuario = await usuarioRes.json();

    document.getElementById("tituloFavoritos").textContent = `Favoritos de ${usuario.nome}`;

    const res = await fetch(`http://localhost:3000/favoritos?usuarioId=${usuario.id}`);
    const favoritos = await res.json();

    const lista = document.getElementById("listaFavoritos");
    lista.innerHTML = "";

    if (favoritos.length === 0) {
      lista.innerHTML = "<li class='list-group-item text-center text-muted'>Nenhum favorito encontrado.</li>";
      return;
    }

    for (const fav of favoritos) {
      const artigoRes = await fetch(`http://localhost:3000/artigos/${fav.artigoId}`);
      const artigo = await artigoRes.json();

      const li = document.createElement("li");
      li.className = "list-group-item";

      li.innerHTML = `
        <div>
          <strong>${artigo.titulo}</strong><br>
          <small>${artigo.autor} - ${artigo.data}</small>
        </div>
        <div>
          <button class="btn btn-sm btn-primary me-2" onclick="verArtigo(${artigo.id})">Ver Artigo</button>
          <button class="btn btn-sm btn-danger" onclick="removerFavorito(${fav.id})">Remover</button>
        </div>
      `;

      lista.appendChild(li);
    }
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
}

function verArtigo(id) {
  alert("Abrindo artigo " + id);
}

async function removerFavorito(id) {
  try {
    await fetch(`http://localhost:3000/favoritos/${id}`, { method: "DELETE" });
    carregarFavoritos();
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
  }
}
