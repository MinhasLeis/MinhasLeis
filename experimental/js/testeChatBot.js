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



const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const generateBorResponse =async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    
    const localApiUrl = "/api/gemini";

    /*
    chatHistory.push({
                role: "user",
                parts: [{text: userData.message}]
            });
    */
    const requestOptions ={
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            history: chatHistory
        })
    }

    try{
        const response = await fetch(localApiUrl, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);


        const apiReponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiReponseText;
        chatHistory.push({
            role: "model",
            parts: [{text: apiReponseText}]
        });
    }catch(error){
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    }finally{
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top:chatBody.scrollHeight, behavior: "smooth"});
    }

}



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

const handleOutgoingMessage = (e) =>{
    //Por padrão quando o user clica no 'enviar' de um form html, a o navegador acaba por recarregar a página
    //O e.preventDefault impede isso básicamente, impedindo que o chat seja interrompido 
    e.preventDefault();

    //Dentro a propriedade 'message' do objeto 'userData' é atribuido tudo que estiver no campo de texto 'messageInput'através do '.value' e utiliza o 'trim' para limpar espaços vazios no inicio e no final do texto
    userData.message = messageInput.value.trim();

    //Limpando a caixa de texto depois que a mensagem é enviada
    messageInput.value = "";

    //Constante que recebe um texto ja escrito uma estrutura HTML div ja com a classe
    //'message-text' para ser estilizada quando for criada através do innerHTML na função
    // 'createMessageElement'
    const messageContent = `<div class="message-text"></div>`;

    //Para depois ele criar a mensagem com o conteudo dessa estrutura e aplica a classe 'user-message' ja que essa função lida com o envio de mensagem do lado do usuário
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");


    //Aqui o 'outgoingMessageDiv' criado anteriormente, usa o querySelector pra ja pegar o 
    // ponto de referencia daa div que acabou de ser criada com a classe 'message-text'
    //nisso, ele define que a propriedade 'textContent' receba o valor de da propriedade 'message'
    //do Obejto 'userData'
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message

    //Nisso o 'outgoingMessageDiv' que é a mensagem do usuário, é mostrada na div do chat
    //que é o 'chatBody' visto nas constantes criadadas no começo do script
    //através da propriedade 'appendChild'
    chatBody.appendChild(outgoingMessageDiv)
    chatBody.scrollTo({ top:chatBody.scrollHeight, behavior: "smooth"});

    //É criado um 'Timeout' que é uma função que tem um delay pra rodar
    //Ela simulação o pensamento do bot pra responder depois desse delay
    setTimeout(() =>{
        const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top:chatBody.scrollHeight, behavior: "smooth"});
        generateBorResponse(incomingMessageDiv);
    },600)//delay em milisegundos para rodar a função
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







