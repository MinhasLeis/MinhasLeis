/*
    Script para lidar com os inputs do usário para interagir com o chat bot 
    e posteriormente receber uma mensagem da IA em resposta
*/

//Constantes que pegam elementos do html, através do querySelector
//O querySelector pega tags especificas do html para interagir com elas

//chatBody, é a div onde vai aparecer as mensagens
const chatBody = document.querySelector(".chat-body");

//Message input é onde pega a mensagem que foi enviada através 
//do input da tag <textarea> no HTML
const messageInput = document.querySelector(".message-input");

//Esta constante contem a referencia pro botão de submit do formulario,
//para que seja possivel detectar os cliques nele depois com o EventListener
const sendMessageButton = document.querySelector("#send-message");

//É criado um objeto chamado userData com a propriedade 'message'
const userData = {
    message: null
}

//Constante que é um vetor para armazenar historico da conversa e 
// o chat lembrar do que ja foi falado
const chatHistory = [
    {
        //Adicionando um contexto para que a IA já saiba sobre o que e como falar
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

//FUNÇÃO 2 RESPONSÁVEL POR GERAR A RESPOSTA DA IA

// A palavra 'async' aqui é um aviso de que esta função fará tarefas que
// demoram (como esperar a internet) e nos permite usar a palavra 'await' lá dentro.
// Ela recebe como parâmetro o balão de mensagem "pensando..." (incomingMessageDiv)
// para saber qual elemento na tela ela deve atualizar.
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    const localApiUrl = "/api/groq";

    messageElement.innerHTML = "";
    let botResponseText = "";

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: chatHistory })
    };

    try {
        const response = await fetch(localApiUrl, requestOptions);

        // Se a resposta não for 'ok' (ex: status 500, 400, etc.),
        // nós tratamos como um erro JSON antes de tentar o streaming.
        if (!response.ok) {
            const errorData = await response.json(); // Tenta ler o corpo do erro como JSON
            throw new Error(errorData.error || "A resposta da rede não foi 'ok'.");
        }

        // Se a resposta for 'ok' (status 200), aí sim procedemos com o streaming.
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.substring(6);
                    if (jsonStr.trim() === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(jsonStr);
                        const textChunk = parsed.choices[0]?.delta?.content || "";
                        if (textChunk) {
                            botResponseText += textChunk;
                            messageElement.innerHTML = marked.parse(botResponseText);
                            chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "auto" });
                        }
                    } catch (e) {
                        // Ignora erros de parsing de JSON incompletos
                    }
                }
            }
        }
        
        chatHistory.push({
            role: "model",
            parts: [{ text: botResponseText }]
        });

    } catch (error) {
        console.error("Erro:", error);
        // Agora, o erro capturado aqui será mais claro
        messageElement.innerText = `Oops! Algo deu errado. (${error.message})`;
        messageElement.style.color = "#ff0000";
    } finally {
        incomingMessageDiv.classList.remove("thinking");
    }
};


/*
    FUNÇÃO 3
    Função responsável por lidar com o processo de envio de mensagem do usuário
*/

const handleOutgoingMessage = (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return; // Não envia mensagens vazias

    // <<--- ESTA É A LINHA MAIS IMPORTANTE! ELA PRECISA ESTAR AQUI.
    // 1. Salva a mensagem do usuário no histórico PRIMEIRO.
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    if(chatHistory.length > 15){
        chatHistory.splice(2, 2)
    }

    // 2. Exibe a mensagem do usuário na tela.
    const outgoingMessageDiv = createMessageElement(`<div class="message-text">${message}</div>`, "user-message");
    chatBody.appendChild(outgoingMessageDiv);
    
    messageInput.value = ""; // Limpa o input
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // 3. Mostra o "pensando..." e chama a função do bot DEPOIS com a função timeOut.
    setTimeout(() => {
        const thinkingMessageDiv = createMessageElement(`<div class="message-text"><div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`, "bot-message", "thinking");
        chatBody.appendChild(thinkingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        generateBotResponse(thinkingMessageDiv);
    }, 600);
};



//FUNÇÕES DE EVENT LISTENERS 

//1° messageInput.addEventListener("keydown", (e)  => {}
//2º sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));


//Primeira Função de detectão de tecla, a função será acionada toda vez que o usuário pressionar uma tecla.
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


//Segunda Função detectora, nesse caso, do clique do mouse
//Faz a mesma coisa do detector de teclados, mas é mais simples pois
//não precisa checar qual foi a tecla pressionada
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));

window.addEventListener("load", () => {
    // Esta função será executada assim que a página terminar de carregar.
    
    // Passa por cada item do histórico inicial
    chatHistory.forEach(turn => {
        // Renderiza apenas as mensagens do 'model' (bot) que já devem aparecer
        if (turn.role === 'model') {
            const messageDiv = createMessageElement(
                `<div class="message-text">${turn.parts[0].text}</div>`, 
                "bot-message"
            );
            chatBody.appendChild(messageDiv);
        }
    });

    // Garante que a rolagem esteja no final
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
});