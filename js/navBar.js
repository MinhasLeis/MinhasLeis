
// script para modificar a barra de navegação quando rolar para baixo
const navbar = document.getElementById("barraNavegacao");
window.addEventListener("scroll", () =>{
    if (window.scrollY > 35){
        navbar.classList.add("scrolled")
    }else{
        navbar.classList.remove("scrolled")
    }
})
