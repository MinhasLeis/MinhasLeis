const textarea = document.querySelector(".mensagem-input");

textarea.addEventListener("input", () =>{
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px"
})

const caixaChat = document.querySelector(".caixa-chat");

const mensagemInput = document.querySelector(".mensagem-input");

const enviarMensagem = document.querySelector("#enviar-mensagem");

const userData = {
    message: null
}


const chatHistory = [
    {
        role: "user",
        parts: [{ text: "A partir de agora, você é a Maria, uma assistente jurídico virtual especializado em direito brasileiro. Você deve se comunicar de forma clara e objetiva. **Use emojis de forma amigável e apropriada para tornar a conversa mais leve, como 👍, 😊, ou 🤔.** Recuse-se a responder perguntas que não sejam sobre o sistema judiciário ou leis do Brasil. Comece a primeira conversa se apresentando formalmente e oferecendo ajuda. Formate suas respostas usando Markdown quando apropriado para melhorar a clareza.Use parágrafos para separar as ideias principais e formate o texto com Markdown" }]

    },
    {
        role: "model",
        parts: [{text: "Olá! Eu sou a Maria, sua assistente jurídico virtual. Como posso auxiliá-la com suas dúvidas sobre direitos hoje?" }]
    }
];


const advogados = [
    {
        nome: "Fernando",
        fotoURL: "/assets/img/fotoPerfil.png", 
        avaliacoes: "Avaliações (189) ★★★★★",
        especialidades: "Advogado trabalhista, Civil, Propriedade Intelectual e Industrial.",
    },
    {
        nome: "Mariana",
        fotoURL: "/assets/img/fotoPerfil.png", 
        avaliacoes: "Avaliações (215) ★★★★★",
        especialidades: "Direito do Consumidor, Direito de Família."
    },
    {
        nome: "Lucas",
        fotoURL: "/assets/img/fotoPerfil.png", 
        avaliacoes: "Avaliações (150) ★★★★★",
        especialidades: "Direito Penal, Direito Empresarial."
    },
    {
        nome: "Beatriz",
        fotoURL: "/assets/img/fotoPerfil.png", 
        avaliacoes: "Avaliações (302) ★★★★☆",
        especialidades: "Direito Tributário, Direito Imobiliário."
    }
];

// FUNÇÃO PARA CRIAR E EXIBIR O MENU DE ADVOGADOS
const gerarMenuAdvogados = () => {
 
    const introContent = `
        <div class="mensagem mensagem-bot">
            <div class="avatar-bot"></div>
            <div class="mensagem-texto">
                Encontrei alguns advogados que podem te ajudar nesse assunto. Veja as opções abaixo e escolha o profissional que melhor atende às suas necessidades. Você pode conferir as avaliações, áreas de atuação e clicar em Ver Perfil para iniciar o contato.
            </div>
        </div>`;
    
  
    const cardsHtml = advogados.map(adv => `
        <div class="advogado-card">
            <img src="${adv.fotoURL}" alt="Foto de ${adv.nome}" class="advogado-foto">
            <p class="advogado-nome">${adv.nome}</p>
            <p class="advogado-avaliacoes">${adv.avaliacoes}</p>
            <p class="advogado-especialidades">${adv.especialidades}</p>
            <button class="advogado-ver-perfil-btn">VER PERFIL</button>
        </div>
    `).join('');


    const menuContent = `
        <div class="menu-advogados">
            <div class="advogados-lista">
                ${cardsHtml}
            </div>
        </div>`;


    caixaChat.innerHTML += introContent; 
    caixaChat.innerHTML += menuContent; 

    caixaChat.scrollTo({ top: caixaChat.scrollHeight, behavior: "smooth" });
};

/* 
    FUNÇÃO 1
    Função que cria os balões de mensagens, o que ela faz é o seguinte:
    ela recebe dois valores, o 'content' que é o conteudo que vai para o balão de mensagem
    e o 'classes' que é o nome da classe da mensagem para que ela receba a estilização certa do css
    
*/
// Entrada de dados
// Processamento de dados
// Saida de dados

const createMessageElement = (content, ...classes) =>{
    const div = document.createElement("div");

    div.classList.add("mensagem", ...classes);

    div.innerHTML = content

    return div;

};


//FUNÇÃO 2 RESPONSÁVEL POR GERAR A RESPOSTA DA IA
// A palavra 'async' aqui é um aviso de que esta função fará tarefas que
// demoram (como esperar a internet) e nos permite usar a palavra 'await' lá dentro.
// Ela recebe como parâmetro o balão de mensagem "pensando..." (incomingMessageDiv)
// para saber qual elemento na tela ela deve atualizar.

const generateBotResponse = async (incomingMessageDiv) => {

    const messageElement = incomingMessageDiv.querySelector(".mensagem-texto");


    const localApiUrl = "/api/groq";

 
    const requestOptions = {

        method: "POST",

        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            history: chatHistory
        })
    };

    try {
        const response = await fetch(localApiUrl, requestOptions);

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }


        if (data.candidates && data.candidates.length > 0) {

 
            const botResponseText = data.candidates[0].content.parts[0].text;


            messageElement.innerHTML = marked.parse(botResponseText);
            chatHistory.push({
                role: "model",
                parts: [{ text: botResponseText }]
            });
        } else {
            console.error("Resposta da API sem 'candidates':", data);
            messageElement.innerText = "Desculpe, não consegui gerar uma resposta. Tente reformular sua pergunta.";
        }

    } catch (error) {

        console.error("Erro:", error);


        messageElement.innerText = "Oops! Algo deu errado. Tente novamente.";
        messageElement.style.color = "#ff0000";
    } finally {

        incomingMessageDiv.classList.remove("indicador-pensamento");

        caixaChat.scrollTo({ top: caixaChat.scrollHeight, behavior: "smooth" });
    }
};

/*
    FUNÇÃO 3
    Função responsável por lidar com o processo de envio de mensagem do usuário
*/
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    const message = mensagemInput.value.trim();
    if (!message) return; // Não envia mensagens vazias


    const confirmationKeywords = ['sim', 'quero', 'gostaria', 'pode ser', 'chamar', 'advogado', 'localizar', 'encontrar'];
    const messageLowerCase = message.toLowerCase();


    const isConfirmation = confirmationKeywords.some(keyword => messageLowerCase.includes(keyword));


    const outgoingMessageDiv = createMessageElement(`<div class="mensagem-texto">${message}</div>`, "mensagem-usuario");
    caixaChat.appendChild(outgoingMessageDiv);
    mensagemInput.value = "";
    caixaChat.scrollTo({ top: caixaChat.scrollHeight, behavior: "smooth" });


    if (isConfirmation) {
        setTimeout(() => {
            gerarMenuAdvogados();
        }, 600); 
        return; 
    }


    chatHistory.push({ role: "user", parts: [{ text: message }] });

    if (chatHistory.length > 15) {
        chatHistory.splice(2, 2);
    }

    setTimeout(() => {
        const messageContent = `<div class="avatar-bot"></div><div class="mensagem-texto"><div class="indicador-pensamento"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;

        //const indicadorPensamentoMessageDiv = div
        const indicadorPensamentoMessageDiv = createMessageElement(messageContent, "mensagem-bot", "indicador-pensamento");
        caixaChat.appendChild(indicadorPensamentoMessageDiv);

        caixaChat.scrollTo({ top: caixaChat.scrollHeight, behavior: "smooth" });

        generateBotResponse(indicadorPensamentoMessageDiv);
    }, 600);
};

//FUNÇÕES DE EVENT LISTENERS 


//Primeira Função de detectão de tecla, a função será acionada toda vez que o usuário pressionar uma tecla.
//Ele lida com o 'mensagemInput' que armazena o ponto de referencia da mensagem digitada nos formularios
//Curiosidade, o 'e' dentro dos parenteses não é por acaso, ele é uma abreviação de 'Event'
//Ele contem alguns dados baśicos do objeto detectado, de modo que conseguimos acessar algumas
//propriedades como o 'target' ou o 'key' para nesse caso informarmos qual tecla foi pressionada

mensagemInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();

    if(e.key === "Enter" && userMessage){
        handleOutgoingMessage(e)
    }
});

//Segunda Função detectora, nesse caso, do clique do mouse
//Faz a mesma coisa do detector de teclados, mas é mais simples pois
//não precisa checar qual foi a tecla pressionada
enviarMensagem.addEventListener("click", (e) => handleOutgoingMessage(e));



document.addEventListener('DOMContentLoaded', () => {
    const menuHamburgerVirtual = document.querySelector('.menu-hamburger-virtual');
    const navOptions = document.querySelector('#assistenteVirtualNavBar .option');

    if (menuHamburgerVirtual && navOptions) {
        menuHamburgerVirtual.addEventListener('click', () => {
            
            navOptions.classList.toggle('active');
           
            menuHamburgerVirtual.classList.toggle('active');
        });
    }
});
