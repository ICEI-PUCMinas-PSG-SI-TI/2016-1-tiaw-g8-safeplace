document.addEventListener("DOMContentLoaded", () => {

    if (!localStorage.getItem("perfil")) {

        const perfilPadrao = {
            nome: "João Silva",
            email: "joao@email.com",
            telefone: "(31) 99999-9999",
            senha: "12345678",
            tema: "claro"
        };
        localStorage.setItem(
            "perfil",
            JSON.stringify(perfilPadrao)
        );
    }

});

const btnAtualizarSenha =
    document.getElementById("atualizarSenha");
if (btnAtualizarSenha) {

    btnAtualizarSenha.addEventListener("click", alterarSenha);
}

function alterarSenha() {
    const senhaAtual =
        document.getElementById("senhaAtual").value.trim();

    const novaSenha =
        document.getElementById("novaSenha").value.trim();

    const confirmarSenha =
        document.getElementById("confirmarSenha").value.trim();

    const perfil = JSON.parse(
        localStorage.getItem("perfil")
    );

    if (
        senhaAtual === "" ||
        novaSenha === "" ||
        confirmarSenha === ""
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    if (senhaAtual !== perfil.senha) {

        alert("Senha atual incorreta.");
        return;
    }

    if (novaSenha.length < 8) {

        alert("A nova senha deve ter pelo menos 8 caracteres.");
        return;
    }

    const possuiMaiuscula =
        /[A-Z]/.test(novaSenha);

    if (!possuiMaiuscula) {

        alert("A senha deve conter pelo menos uma letra maiúscula.");
        return;
    }

    const possuiNumero =
        /\d/.test(novaSenha);

    if (!possuiNumero) {

        alert("A senha deve conter pelo menos um número.");
        return;
    }

    if (novaSenha !== confirmarSenha) {

        alert("A confirmação da senha não corresponde.");
        return;
    }

    if (novaSenha === senhaAtual) {

        alert("A nova senha deve ser diferente da atual.");
        return;
    }

    perfil.senha = novaSenha;
    localStorage.setItem(
        "perfil",
        JSON.stringify(perfil)
    );

    alert("Senha alterada com sucesso!");
    window.location.href = "perfil.html";
}

function alternarSenha(idCampo) {

    const campo =
        document.getElementById(idCampo);
    if (!campo) return;

    if (campo.type === "password") {
        campo.type = "text";
    } else {
        campo.type = "password";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const perfil = JSON.parse(
        localStorage.getItem("perfil")
    );

    if(
        perfil && perfil.tema === "escuro"
    ) {
        document.body.classList.add("dark");
    }
});