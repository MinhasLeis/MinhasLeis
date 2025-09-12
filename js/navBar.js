
// script para modificar a barra de navegação quando rolar para baixo
const navbar = document.getElementById("barraNavegacao");
const logo = document.getElementById("logo")

const logoOriginal = "/assets/img/logoBarraNavegacao.svg"
const logoScrolled = "/assets/img/logoBarraNavegacaoWhiteColor.svg"


window.addEventListener("scroll", () =>{
    if (window.scrollY > 15){
        navbar.classList.add("scrolled")

        if(!logo.src.includes("logoBarraNavegacaoWhiteColor.svg")){
            logo.style.opacity = 0
            setTimeout(() =>{
                logo.src = logoScrolled
                logo.style.opacity = 1
            },200);
        }
    }else{
        navbar.classList.remove("scrolled")

        if(!logo.src.includes("logoBarraNavegacao.svg")){
            logo.style.opacity = 0
            setTimeout(() =>{
                logo.src = logoOriginal
                logo.style.opacity = 1
            },200)
        }
    }
})
