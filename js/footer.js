document.addEventListener('DOMContentLoaded', function(){
    const getFooter = document.getElementById('footer');

    let estruturaFooter;

    estruturaFooter = `
            <div id="footer-container">
                <div id="footer-col">
                <h4>Institucional</h4>
                <ul>
                    <li><a href="#">Sobre o SeusDireitos</a></li>
                    <li><a href="#">Como funciona</a></li>
                    <li><a href="#">Carreiras</a></li>
                    <li><a href="#">Imprensa</a></li>
                </ul>
                </div>
                <div id="footer-col">
                <h4>Community</h4>
                <ul>
                    <li><a href="#">Dúvidas Frequentes (FAQ)</a></li>
                    <li><a href="#">Central de Ajuda</a></li>
                    <li><a href="#">Fale Conosco</a></li>
                </ul>
                </div>

                <div id="footer-col">
                <h4>Legal</h4>
                <ul>
                    <li><a href="#">Termos de Uso</a></li>
                    <li><a href="#">Política de Privacidade</a></li>
                    <li><a href="#">Aviso Legal</a></li>
                </ul>
                </div>

                <div id="footer-col">
                <h4>Redes Sociais</h4>
                <ul>
                    <li><a href="#">LinkedIn</a></li>
                    <li><a href="#">Instagram</a></li>
                    <li><a href="#">Facebook</a></li>
                </ul>
                </div>
            </div>

            <hr />

            <div id="footer-bottom">
                <p>© 2025 MinhasLeis, Corp. · <a href="#">Privacidade</a> · <a href="#">Termos de Uso</a> · <a href="#">Mapa do Site</a></p>

            </div>
    `
    getFooter.innerHTML = estruturaFooter; 
})