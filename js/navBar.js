document.addEventListener('DOMContentLoaded', function() {
    const getNavBar = document.getElementById('navBar');

    // Verifica se existe um item 'usuarioLogado' no localStorage
    const usuarioTaLogado = localStorage.getItem('usuarioLogado');

    let estruturaNavBar;

    if (usuarioTaLogado) {

        estruturaNavBar = `
        <nav id="barraNavegacao">
            <a href="./index.html"><img id="logo" src="./assets/img/logoBarraNavegacao.svg" alt="Logo MinhasLeis"></a>
            <a href="./questionario.html">Consultar</a>
            <a href="./assistente_virtual.html">Assistente Virtual</a>
            <a href="./missao_visao_valores.html">Sobre nós</a>
            <a href="./pagina_duvidas.html">Dúvidas Frequentes</a>
            <a href="./procurar_advogados.html">Procurar Advogados</a>
            <div id="userProfile">
                <img src="./assets/img/iconeUsuario.svg" alt="Meu Perfil" title="Sair">
            </div>
        </nav>
        `;
    } else {
        
        estruturaNavBar = `
        <nav id="barraNavegacao">
            <a href="./index.html"><img id="logo" src="./assets/img/logoBarraNavegacao.svg" alt="Logo MinhasLeis"></a>
            <a href="./questionario.html">Consultar</a>
            <a href="./assistente_virtual.html">Assistente Virtual</a>
            <a href="./missao_visao_valores.html">Sobre nós</a>
            <a href="./pagina_duvidas.html">Dúvidas Frequentes</a>
            <a href="./procurar_advogados.html">Procurar Advogados</a>
            <a id="loginBtn" href="./tela_login.html">Entrar</a>
        </nav>
        `;
    }
    

    getNavBar.innerHTML = estruturaNavBar;


    if (usuarioTaLogado) {
        const userProfileButton = document.getElementById('userProfile');
        userProfileButton.addEventListener('click', function() {

            localStorage.removeItem('usuarioLogado');

            window.location.href = './index.html';
        });
    }


    const navbar = document.getElementById("barraNavegacao");
    const logo = document.getElementById("logo");

    const logoOriginal = "assets/img/logoBarraNavegacao.svg";
    const logoScrolled = "assets/img/logoBarraNavegacaoWhiteColor.svg";

    window.addEventListener("scroll", () => {
        if (window.scrollY > 15) {
            navbar.classList.add("scrolled");

            if (!logo.src.includes("logoBarraNavegacaoWhiteColor.svg")) {
                logo.style.opacity = 0;
                setTimeout(() => {
                    logo.src = logoScrolled;
                    logo.style.opacity = 1;
                }, 150);
            }
        } else {
            navbar.classList.remove("scrolled");

            if (!logo.src.includes("logoBarraNavegacao.svg")) {
                logo.style.opacity = 0;
                setTimeout(() => {
                    logo.src = logoOriginal;
                    logo.style.opacity = 1;
                }, 150);
            }
        }
    });
});