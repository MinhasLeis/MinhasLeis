export default async function handler(request, response) {
  const API_KEY = process.env.GROQ_API_KEY;
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const conversationHistory = request.body.history;
    const messagesForGroq = conversationHistory.map(turn => ({
      role: turn.role === 'model' ? 'assistant' : 'user',
      content: turn.parts[0].text
    }));

    const groqRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // Modelo ativo
        messages: messagesForGroq,
        // A MUDANÇA PRINCIPAL AQUI: 'stream: true' foi removido!
      })
    };

    const groqResponse = await fetch(API_URL, groqRequestOptions);
    // VOLTAMOS A USAR .json() para esperar a resposta completa
    const data = await groqResponse.json();

    if (data.choices && data.choices.length > 0) {
      const botResponse = data.choices[0].message.content;
      response.status(200).json({
        candidates: [{ content: { parts: [{ text: botResponse }] } }]
      });
    } else {
      console.error("Resposta inesperada da Groq:", data);
      throw new Error("A resposta da API da Groq não veio no formato esperado.");
    }

  } catch (error) {
    console.error("Erro na função serverless (Groq):", error);
    response.status(500).json({ error: "Erro ao comunicar com a IA." });
  }
}