// ARQUIVO: /api/groq.js (VERSÃO FINAL E CORRETA PARA GROQ)

export default async function handler(request, response) {
  // 1. Pega a chave da GROQ que está guardada na Vercel.
  const API_KEY = process.env.GROQ_API_KEY;
  // 2. A URL do endpoint da Groq (é compatível com o padrão da OpenAI).
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const conversationHistory = request.body.history;

    // 3. TRANSFORMAÇÃO: O corpo da requisição da Groq é diferente do Gemini.
    // Precisamos transformar o nosso `chatHistory` para o formato que a Groq espera.
    const messagesForGroq = conversationHistory.map(turn => ({
      // A Groq usa 'user' e 'assistant' em vez de 'user' e 'model'.
      role: turn.role === 'model' ? 'assistant' : 'user',
      // A Groq espera uma propriedade 'content' em vez de 'parts'.
      content: turn.parts[0].text
    }));

    // Monta a requisição para a API da Groq.
    const groqRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 4. AUTENTICAÇÃO: A Groq usa um Header 'Authorization'.
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        // 5. CORPO: Especificamos o modelo que queremos usar e enviamos as mensagens transformadas.
        model: "llama3-8b-8192", // Um dos modelos Llama 3 disponíveis na Groq
        messages: messagesForGroq
      })
    };

    // Faz a chamada para a API da Groq.
    const groqResponse = await fetch(API_URL, groqRequestOptions);
    const data = await groqResponse.json();

    // 6. RESPOSTA: A resposta da Groq também vem em um formato diferente.
    if (data.choices && data.choices.length > 0) {
      const botResponse = data.choices[0].message.content;

      // Devolvemos a resposta no formato que o nosso frontend espera ({ candidates: [...] }),
      // assim não precisamos mudar quase nada no frontend!
      response.status(200).json({
        candidates: [{ content: { parts: [{ text: botResponse }] } }]
      });
    } else {
      // Se a resposta vier vazia ou com erro, nós o repassamos.
      console.error("Resposta inesperada da Groq:", data);
      throw new Error("A resposta da API da Groq não veio no formato esperado.");
    }

  } catch (error) {
    console.error("Erro na função serverless (Groq):", error);
    response.status(500).json({ error: "Erro ao comunicar com a IA." });
  }
}