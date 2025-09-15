/*
    Script para lidar com os inputs do usário para interagir com o chat bot 
    e posteriormente receber uma mensagem da IA em resposta
*/


//Constantes que pegam elementos do html, através do querySelector
//O querySelector pega tags especificas do html para interagir com elas


//chatBody, é a div onde vai aparecer as mensagens
const chatBody = document.querySelector(".chat-body");

//Message input é onde pega a mensagem que foi enviada através do input 
// da tag <textarea> no HTML
const messageInput = document.querySelector(".message-input");

//Esta constante contem a referencia pro botão de submit do formulario,para que seja possivel detectar os cliques nele depois com o EventListener
const sendMessageButton = document.querySelector("#send-message");

//É criado um objeto chamado userData com a propriedade 'message'
const userData = {
    message: null
}

const chatHistory = [];



/*const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;*/

// Renomeado para "Bot" e com a lógica de verificação
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    const localApiUrl = "/api/groq";

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

        // --- A VERIFICAÇÃO DE SEGURANÇA QUE ESTÁ FALTANDO ---
        // Checa se a propriedade 'candidates' existe na resposta da API.
        if (data.candidates && data.candidates.length > 0) {
            // Se existir, continue normalmente.
            const botResponseText = data.candidates[0].content.parts[0].text;
            messageElement.innerText = botResponseText;
            
            chatHistory.push({
                role: "model",
                parts: [{ text: botResponseText }]
            });
        } else {
            // Se não existir, avise o usuário e registre o problema no console para você depurar.
            console.error("Resposta da API sem 'candidates':", data);
            messageElement.innerText = "Desculpe, não consegui gerar uma resposta. Tente reformular sua pergunta.";
        }

    } catch (error) {
        console.error("Erro:", error);
        messageElement.innerText = "Oops! Algo deu errado. Tente novamente.";
        messageElement.style.color = "#ff0000";
    } finally {
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
};



//FUNÇÃO 1
//Função de detectão de tecla, a função será acionada toda vez que o usuário pressionar uma tecla.
//Ele lida com o 'messageInput' que armazena o ponto de referencia da mensagem digitada nos formularios
//Curiosidade, o 'e' dentro dos parenteses não é por acaso, ele é uma abreviação de 'Event'
//Ele contem alguns dados baśicos do objeto detectado, de modo que conseguimos acessar algumas
//propriedades como o 'target' ou o 'key' para nesse caso informarmos qual tecla foi pressionada

messageInput.addEventListener("keydown", (e) => {
    //Criada constante pra mensagem do usuário e através do objeto 'e' criado pra armazenar essa detecção, acessamos o valor da detecção(que é o texto) e aplicamos o trim(remove espaços vazios no começo e final do texto)
    const userMessage = e.target.value.trim();


    //Checamos através do objeto 'e' se a propriedade 'key'(tecla pressionada) é a tecla 'Enter'
    //e checamos se 'userMessage' é verdadeiro ou seja, se não há conteúdo vazio
    if(e.key === "Enter" && userMessage){
        //Se as DUAS condições forem VERDADEIRAS, é chamado a função que cuida do processo de envio da mensagem do usuário para o chat e é colocado como parametro o 'e' que contém os dados da mensagem do usuário
        handleOutgoingMessage(e)
    }
});


//Adiciona um detector, nesse caso, do clique do mouse
//Faz a mesma coisa do detector de teclados, mas é mais simples pois
//não precisa checar qual foi a tecla pressionada
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));


/*
    FUNÇÃO 2
    Função responsável por lidar com o processo de envio de mensagem do usuário
*/

const handleOutgoingMessage = (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return; // Não envia mensagens vazias

    // <<--- ESTA É A LINHA MAIS IMPORTANTE! ELA PRECISA ESTAR AQUI.
    // 1. Salva a mensagem do usuário no histórico PRIMEIRO.
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    // 2. Exibe a mensagem do usuário na tela.
    const outgoingMessageDiv = createMessageElement(`<div class="message-text">${message}</div>`, "user-message");
    chatBody.appendChild(outgoingMessageDiv);
    
    messageInput.value = ""; // Limpa o input
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // 3. Mostra o "pensando..." e chama a função do bot DEPOIS.
    setTimeout(() => {
        const thinkingMessageDiv = createMessageElement(`<div class="message-text"><div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`, "bot-message", "thinking");
        chatBody.appendChild(thinkingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        generateBotResponse(thinkingMessageDiv);
    }, 600);
};



/* 
    FUNÇÃO 3
    Função que cria os balões de mensagens, o que ela faz é o seguinte:
    ela recebe dois valores, o 'content' que é o conteudo que vai para o balão de mensagem
    e o 'classes' que é o nome da classe da mensagem para que ela receba a estilização certa do css
    
*/
const createMessageElement = (content, ...classes) =>{
    //É criado uma tag html vazia na memória(não é visivel por enquanto), sendo a div nesse caso e armazenada numa constante
    const div = document.createElement("div");
    
    //A div recebe por padrão a classe 'message' para receber estilização de tal
    //e depois recebe uma classe a depender do valor digitado no parametro 'classes'
    div.classList.add("message", ...classes);

    //o innerHTML insere o conteúdo da mensagem que foi recebido via o parametro 'content'
    //para dentro da tag que foi criada, então agora a div tem o conteudo da mensagem
    div.innerHTML = content

    //é retornado a div com suas classes definidas e seu conteúdo
    return div;

};







