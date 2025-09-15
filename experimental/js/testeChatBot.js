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
const chatHistory = [];


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

    // Dentro do balão "pensando...", ele encontra o lugar exato onde o texto
    // da resposta será escrito (o elemento com a classe .message-text).
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    // Define o endereço do nossa Função Serverless no Vercel.
    // É para este endereço que o nosso frontend vai enviar o pedido de mensagem.
    const localApiUrl = "/api/groq";

    // Este objeto é o "formulário de pedido" que vamos enviar.
    // Ele contém todas as instruções sobre a nossa requisição.   
    const requestOptions = {
        //O Método POST Usado para ENVIAR dados para o servidor.
        method: "POST",
        //Os Cabeçalhos com os metadados que descrevem nosso pedido.
        headers: { 
            // Avisa ao servidor que o tipo de conteudo que está sendo enviado é no formato JSON.
            "Content-Type": "application/json" 
        },
        // O contéudo do pedido: os dados que estamos enviando.
        body: JSON.stringify({
            // Enviamos o array 'chatHistory' dentro de um objeto, com a chave 'history'.
            history: chatHistory
        })
    };

    try {
        // A palavra 'await' PAUSA a função aqui e fica esperando a resposta da internet.
        // O fetch() envia nosso pedido (requestOptions) para o nosso Serverless (localApiUrl).
        const response = await fetch(localApiUrl, requestOptions);

        // 'await response.json()' pega a resposta (que vem como texto)
        // e a converte em um objeto JavaScript que podemos usar.
        const data = await response.json();

        // Se o nosso backend nos retornou um objeto com a propriedade 'error',
        // nós criamos um novo erro para pular direto para o bloco 'catch'.
        if (data.error) {
            throw new Error(data.error.message);
        }

        // Aqui aconteceu uma verificação de segurança contra respostas vazias da IA.
        // Ele checa se a propriedade 'candidates' existe na resposta.
        if (data.candidates && data.candidates.length > 0) {

            // Se tudo estiver certo, extraímos o texto da resposta da IA.
            const botResponseText = data.candidates[0].content.parts[0].text;

            // Colocamos o texto da resposta no balão de mensagem, substituindo os pontinhos.
            messageElement.innerText = botResponseText;
            
            // Adicionamos a resposta do bot ao nosso vetor histórico para guardar o contexto.
            chatHistory.push({
                role: "model",
                parts: [{ text: botResponseText }]
            });
        } else {
            // Se a resposta veio sem 'candidates', avisamos o usuário.
            console.error("Resposta da API sem 'candidates':", data);
            messageElement.innerText = "Desculpe, não consegui gerar uma resposta. Tente reformular sua pergunta.";
        }

    } catch (error) {
        // Se qualquer linha dentro do 'try' falhar, o código pula para cá.
        // Imprime o erro técnico no console do navegador para o desenvolvedor ver.
        console.error("Erro:", error);

         // Mostramos uma mensagem de erro amigável para o usuário.
        messageElement.innerText = "Oops! Algo deu errado. Tente novamente.";
        messageElement.style.color = "#ff0000";
    } finally {

        // Este bloco executa SEMPRE, não importa se deu sucesso ou erro.
        // Remove a classe 'thinking' para parar a animação dos pontinhos.
        incomingMessageDiv.classList.remove("thinking");

        // Garante que a janela do chat role para baixo para mostrar a mensagem.
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
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

