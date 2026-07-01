const API = "http://localhost:3000/mensagens";

async function carregarMensagens() {

    const resposta = await fetch(API);

    const dados = await resposta.json();

    const chat = document.getElementById("chat");

    chat.innerHTML = "";

    dados.forEach(msg => {

        chat.innerHTML += `
            <div class="mensagem">

                <h3>${msg.usuario}</h3>

                <p>${msg.mensagem}</p>

                <button onclick="editarMensagem(${msg.id})">
                    Editar
                </button>

                <button onclick="excluirMensagem(${msg.id})">
                    Excluir
                </button>

            </div>
        `;
    });
}

async function enviarMensagem() {

    const usuario = document.getElementById("usuario").value;

    const mensagem = document.getElementById("mensagem").value;

    const novaMensagem = {
        usuario,
        mensagem
    };

    await fetch(API, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(novaMensagem)
    });

    carregarMensagens();

    document.getElementById("usuario").value = "";

    document.getElementById("mensagem").value = "";
}

async function excluirMensagem(id) {

    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    carregarMensagens();
}

async function editarMensagem(id) {

    const novaMensagem = prompt("Digite a nova mensagem:");

    await fetch(`${API}/${id}`, {

        method: "PATCH",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            mensagem: novaMensagem
        })
    });

    carregarMensagens();
}

window.onload = carregarMensagens;