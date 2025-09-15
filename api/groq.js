// A forma padrão de declarar uma Função Serverless na Vercel.
// O 'async' nos permite usar 'await' para esperar respostas da internet.
// O 'request' (req) contém os dados do pedido que o frontend enviou.
// E o 'response' (res) é o responsável por enviar a resposta de volta ao frontend.

export default async function handler(request, response) {
  // 1º Ela pega a chave da API do GROQ que está guardada nas Variáveis de Ambiente do Vercel.
  // o process.env é o "cofre" da Vercel. Este código só funciona no servidor,
  // para manter chave segura e fora do navegador
  const API_KEY = process.env.GROQ_API_KEY;

  // 2. A URL do endpoint da Groq.
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";

  try {
    // Pega(request) o histórico(history) da conversa que o frontend enviou 
    // dentro do corpo (body) da requisição.
    const conversationHistory = request.body.history;

    // 3.Traduzimos o nosso chatHistory para que o Groq entenda.
    // Usamos o .map() para passar por cada item do histórico 
    // e "traduzi-lo" para o formato da Groq.
    const messagesForGroq = conversationHistory.map(itemDoHistorico => ({
      // O Groq usa 'assistant' para o bot, então trocamos 'model' por 'assistant'.
      // Usa um Operador Ternário, uma forma compacta de se escrever um IF ELSE
      // Sintaxe = condição ? valor_se_verdadeiro : valor_se_falso
      role: itemDoHistorico.role === 'model' ? 'assistant' : 'user',

      // O Groq usa 'content' para o texto, então pegamos o texto de dentro de 'parts'.
      content: itemDoHistorico.parts[0].text
    }));

    // Monta o pedido para a API da Groq.
    const groqRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Aqui acontece uma autenticação(Authorization), onde é enviado a 
        // nossa chave secreta de forma segura no header.
        "Authorization": `Bearer ${API_KEY}`
      },
      //É enviado qual modelo queremos usar e enviamos as mensagens já "traduzidas".
      body: JSON.stringify({
        //Especifica o modelo(model) que queremos usar e enviamos as mensagens(messages) transformadas.
        model: "llama-3.3-70b-versatile", // É possivel trocar por outros modelos do Groq aqui.
        messages: messagesForGroq,
        temperature: 0.3,
        stream: true,
      })
    };

    //O 'await fetch' envia o pedido para o Groq e espera a resposta.
    const groqResponse = await fetch(API_URL, groqRequestOptions);
    
    //const data = await groqResponse.json(); // Acontece uma conversão da resposta para um objeto JavaScript.

    return new Response(groqResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });

    } catch (error) {
      console.error("Erro na função serverless (Groq):", error);
      // Em caso de erro, retornamos um status 500
      return new Response(JSON.stringify({ error: "Erro ao comunicar com a IA." }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
