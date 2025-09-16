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

/* 
    FUNÇÃO 1
    Função que cria os balões de mensagens, o que ela faz é o seguinte:
    ela recebe dois valores, o 'content' que é o conteudo que vai para o balão de mensagem
    e o 'classes' que é o nome da classe da mensagem para que ela receba a estilização certa do css
    
*/

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

    chatHistory.push({ role: "user", parts: [{ text: message }] });

    if(chatHistory.length > 15){
        chatHistory.splice(2, 2)
    }


    const outgoingMessageDiv = createMessageElement(`<div class="mensagem-texto">${message}</div>`, "mensagem-usuario");
    caixaChat.appendChild(outgoingMessageDiv);
    
    mensagemInput.value = ""; 
    caixaChat.scrollTo({ top: caixaChat.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        const messageContent = `<div class="avatar-bot"></div><div class="mensagem-texto"><div class="indicador-pensamento"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;

        const indicadorPensamentoMessageDiv = createMessageElement(messageContent, "mensagem-bot", "indicadorPensamento");
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