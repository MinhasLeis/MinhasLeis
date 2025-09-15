// ARQUIVO: /api/gemini.js (VERSÃO FINAL E CORRETA)

export default async function handler(request, response) {
  // LOG 1: Confirma que a função foi acionada.
  console.log("Função Serverless /api/gemini foi acionada!");
  
  // LOG 2: Mostra o corpo completo da requisição que o frontend enviou.
  console.log("Corpo da requisição recebido:", request.body);

  // Pega a chave de API das variáveis de ambiente da Vercel.
  const API_KEY = process.env.API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    // Extrai o histórico do corpo da requisição.
    const conversationHistory = request.body.history;
    
    // LOG 3: Mostra o histórico que será enviado para a API do Google.
    console.log("Histórico extraído para enviar ao Google:", conversationHistory);

    // Verifica se o histórico existe e não está vazio antes de prosseguir.
    if (!conversationHistory || conversationHistory.length === 0) {
      // Se estiver vazio, retorna um erro claro.
      return response.status(400).json({ error: "O histórico da conversa (contents) não pode estar vazio." });
    }

    // Monta a requisição para a API do Google.
    const googleRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "contents": conversationHistory
      })
    };

    // Faz a chamada para a API do Google.
    const googleResponse = await fetch(API_URL, googleRequestOptions);
    const data = await googleResponse.json();

    // Envia a resposta do Google de volta para o seu frontend.
    response.status(200).json(data);

  } catch (error) {
    console.error("Erro na função serverless:", error); 
    response.status(500).json({ error: "Erro interno ao comunicar com a IA." });
  }
}