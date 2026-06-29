document.getElementById("btnExcluir").addEventListener("click", () => {
    const senha =
        document.getElementById("senhaExcluir").value;

    const perfil = JSON.parse(
        localStorage.getItem("perfil")
    );

    if (!perfil) {
        alert(
            "Nenhuma conta encontrada.");
        return;
    }

    if (senha !== perfil.senha) {
        alert(
            "Senha incorreta.");
        return;
    }

    const confirmar = confirm(
        "Tem certeza que deseja excluir sua conta?"
    );

    if (!confirmar) {
        return;
    }
    localStorage.clear();

    alert(
        "Conta excluída com sucesso!"
    );

    window.location.href =
        "index.html";
});

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