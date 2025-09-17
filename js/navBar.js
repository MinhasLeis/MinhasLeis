


document.addEventListener('DOMContentLoaded', function() {
    const getNavBar = document.getElementById('navBar');
    const estruturaNavBar = `
        <nav id="barraNavegacao">
            <a href="./index.html"><img id="logo" src="./assets/img/logoBarraNavegacao.svg" alt="Logo MinhasLeis"></a>
            <a href="./questionario.html">Consultar</a>
            <a href="./assistente_virtual.html">Assistente Virtual</a>
            <a href="./missao_visao_valores.html">Como funciona</a>
            <a href="">Dúvidas Frequentes</a>
            <a href="">Planos</a>

            <a id="loginBtn" href="">Entrar</a>
        </nav>
        `; 
        getNavBar.innerHTML = estruturaNavBar
        
    // script para modificar a barra de navegação quando rolar para baixo
    const navbar = document.getElementById("barraNavegacao");
    const logo = document.getElementById("logo")

    const logoOriginal = "assets/img/logoBarraNavegacao.svg";
    const logoScrolled = "assets/img/logoBarraNavegacaoWhiteColor.svg";

    window.addEventListener("scroll", () =>{ 
        if (window.scrollY > 15){
            navbar.classList.add("scrolled")

            if(!logo.src.includes("logoBarraNavegacaoWhiteColor.svg")){
                logo.style.opacity = 0
                setTimeout(() =>{
                    logo.src = logoScrolled
                    logo.style.opacity = 1
                },150);
            }
        }else{
            navbar.classList.remove("scrolled")

            if(!logo.src.includes("logoBarraNavegacao.svg")){
                logo.style.opacity = 0
                setTimeout(() =>{
                    logo.src = logoOriginal
                    logo.style.opacity = 1
                },150)
            }
        }
    })
})  


