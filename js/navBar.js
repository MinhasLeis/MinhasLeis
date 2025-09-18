document.addEventListener('DOMContentLoaded', function() {
    // Pega o elemento onde a barra de navegação será inserida
    const getNavBar = document.getElementById('navBar');

    // Define a lista de links de navegação
    const navLinks = `
        <a href="./questionario.html">Consultar</a>
        <a href="./assistente_virtual.html">Assistente Virtual</a>
        <a href="./missao_visao_valores.html">Sobre nós</a>
        <a href="./pagina_duvidas.html">Dúvidas Frequentes</a>
        <a href="./procurar_advogados.html">Procurar Advogados</a>
    `;

    // Cria a estrutura da barra de navegação, com o botão "Entrar" sempre presente
    const estruturaNavBar = `
        <nav id="barraNavegacao">
            <a href="./index.html"><img id="logo" src="./assets/img/logoBarraNavegacao.svg" alt="Logo MinhasLeis"></a>
            
            <div class="nav-links">
                ${navLinks}
                <a id="loginBtn" href="./tela_login.html">Entrar</a>
            </div>
            
            <div class="menu-hamburger">
                <div class="linha"></div>
                <div class="linha"></div>
                <div class="linha"></div>
            </div>
        </nav>
    `;
    
    // Insere a estrutura criada no HTML da página
    getNavBar.innerHTML = estruturaNavBar;

    // --- LÓGICA PARA FAZER O MENU FUNCIONAR ---

    // Lógica para o menu hambúrguer
    const menuHamburger = document.querySelector('.menu-hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    menuHamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        menuHamburger.classList.toggle('active');
    });

    // Lógica de scroll da barra de navegação
    const navbar = document.getElementById("barraNavegacao");
    const logo = document.getElementById("logo");
    const logoOriginal = "./assets/img/logoBarraNavegacao.svg";
    const logoScrolled = "./assets/img/logoBarraNavegacaoWhiteColor.svg";

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