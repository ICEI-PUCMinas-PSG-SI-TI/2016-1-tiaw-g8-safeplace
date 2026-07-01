const API = "http://localhost:3000/avaliacoes";

const form = document.getElementById("form-avaliacao");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novaAvaliacao = {
        paciente: document.getElementById("paciente").value,
        psicologo: document.getElementById("psicologo").value,
        nota: document.getElementById("nota").value,
        comentario: document.getElementById("comentario").value,
        data: new Date().toLocaleDateString()
    };

    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaAvaliacao)
    });

    form.reset();
    carregarAvaliacoes();
});

async function carregarAvaliacoes() {

    const resposta = await fetch(API);
    const avaliacoes = await resposta.json();

    const lista = document.getElementById("lista-avaliacoes");

    lista.innerHTML = "";

    avaliacoes.forEach(avaliacao => {

        lista.innerHTML += `
            <div class="avaliacao">

                <h3>${avaliacao.psicologo}</h3>

                <p><strong>Paciente:</strong> ${avaliacao.paciente}</p>

                <p><strong>Nota:</strong> ${avaliacao.nota} ⭐</p>

                <p><strong>Comentário:</strong> ${avaliacao.comentario}</p>

                <p><strong>Data:</strong> ${avaliacao.data}</p>

                <button onclick="editarAvaliacao(${avaliacao.id})">
                    Editar
                </button>

                <button onclick="excluirAvaliacao(${avaliacao.id})">
                    Excluir
                </button>

            </div>
        `;
    });
}

async function excluirAvaliacao(id) {

    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    carregarAvaliacoes();
}

async function editarAvaliacao(id) {

    const novoComentario = prompt("Digite o novo comentário:");

    if (!novoComentario) return;

    await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comentario: novoComentario
        })
    });

    carregarAvaliacoes();
}

window.onload = carregarAvaliacoes;