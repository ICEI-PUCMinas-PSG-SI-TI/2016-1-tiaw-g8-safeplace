function criarPerfilPadrao() {

    const perfilPadrao = {
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(31) 99999-9999",
        idioma: "Português (Brasil)",
        notificacoes: true,
        tipoUsuario: "Aluno",
        tema: "claro",
        senha: "12345678",
        foto: ""
    };

    localStorage.setItem(
        "perfil",
        JSON.stringify(perfilPadrao)
    );
    return perfilPadrao;
}

function obterPerfil() {

    let perfil = JSON.parse(
        localStorage.getItem("perfil")
    );
    if (
        !perfil ||
        !perfil.nome ||
        !perfil.email ||
        !perfil.telefone
    ) {

        perfil = criarPerfilPadrao();
    }
    return perfil;
}

function carregarPerfil() {
    const perfil = obterPerfil();
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const telefone = document.getElementById("telefone");
    const idioma = document.getElementById("idioma");
    const notificacoes = document.getElementById("notificacoes");

    if (nome) nome.value = perfil.nome;
    if (email) email.value = perfil.email;
    if (telefone) telefone.value = perfil.telefone;
    if (idioma) idioma.value = perfil.idioma;
    if (notificacoes) notificacoes.checked = perfil.notificacoes;

    const nomePerfil =
        document.getElementById("nomePerfil");

    const nomeHeader =
        document.getElementById("nomeHeader");

    const emailPerfil =
        document.getElementById("emailPerfil");

    if (nomePerfil)
        nomePerfil.textContent = perfil.nome;

    if (nomeHeader)
        nomeHeader.textContent = perfil.nome;

    if (emailPerfil)
        emailPerfil.textContent = perfil.email;

    const fotoPerfil =
        document.getElementById("fotoPerfil");

    const fotoTopo =
        document.getElementById("fotoTopo");

    if (perfil.foto) {
        if (fotoPerfil)
            fotoPerfil.src = perfil.foto;
        if (fotoTopo)
            fotoTopo.src = perfil.foto;
    }
    aplicarTema(perfil.tema);
}

function salvarPerfil() {
    const perfil = obterPerfil();
    perfil.nome =
        document.getElementById("nome").value;

    perfil.email =
        document.getElementById("email").value;

    perfil.telefone =
        document.getElementById("telefone").value;

    localStorage.setItem(
        "perfil",
        JSON.stringify(perfil)
    );
    carregarPerfil();
    alert("Perfil atualizado com sucesso!");
}

function salvarPreferencias() {
    const perfil = obterPerfil();

    const idioma =
        document.getElementById("idioma");

    const notificacoes =
        document.getElementById("notificacoes");

    if (idioma)
        perfil.idioma = idioma.value;
    if (notificacoes)
        perfil.notificacoes =
            notificacoes.checked;

    perfil.tema =
        document.body.classList.contains("dark")
            ? "escuro"
            : "claro";

    localStorage.setItem(
        "perfil",
        JSON.stringify(perfil)
    );
    alert("Preferências salvas!");
}

function alterarFoto(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = function(e) {

        const perfil = obterPerfil();
        perfil.foto = e.target.result;
        localStorage.setItem(
            "perfil",
            JSON.stringify(perfil)
        );
        carregarPerfil();
    };
    leitor.readAsDataURL(arquivo);
}

function aplicarTema(tema) {

    if (tema === "escuro") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

function ativarTemaClaro() {
    document.body.classList.remove("dark");

    const claro =
        document.getElementById("temaClaro");

    const escuro =
        document.getElementById("temaEscuro");

    if (claro)
        claro.classList.add("ativo");
    if (escuro)
        escuro.classList.remove("ativo");
}

function ativarTemaEscuro() {
    document.body.classList.add("dark");

    const claro =
        document.getElementById("temaClaro");

    const escuro =
        document.getElementById("temaEscuro");

    if (escuro)
        escuro.classList.add("ativo");
    if (claro)
        claro.classList.remove("ativo");
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        carregarPerfil();

        const btnSalvarPerfil =
            document.getElementById(
                "salvarPerfil"
            );
        if (btnSalvarPerfil) {
            btnSalvarPerfil.addEventListener(
                "click",
                salvarPerfil
            );
        }

        const btnSalvarPreferencias =
            document.getElementById(
                "salvarPreferencias"
            );
        if (btnSalvarPreferencias) {
            btnSalvarPreferencias.addEventListener(
                "click",
                salvarPreferencias
            );
        }

        const fotoInput =
            document.getElementById(
                "fotoInput"
            );
        if (fotoInput) {
            fotoInput.addEventListener(
                "change",
                alterarFoto
            );
        }

        const temaClaro =
            document.getElementById(
                "temaClaro"
            );
        if (temaClaro) {
            temaClaro.addEventListener(
                "click",
                ativarTemaClaro
            );
        }

        const temaEscuro =
            document.getElementById(
                "temaEscuro"
            );
        if (temaEscuro) {
            temaEscuro.addEventListener(
                "click",
                ativarTemaEscuro
            );
        }
    }
);