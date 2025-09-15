
export default async function handler(request, response) {
  const API_KEY = process.env.API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const conversationHistory = request.body.history;

    const googleRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "contents": conversationHistory
      })
    };

    const googleResponse = await fetch(API_URL, googleRequestOptions);
    const data = await googleResponse.json();

    response.status(200).json(data);

  } catch (error) {
    console.error("Erro na função serverless:", error); 
    response.status(500).json({ error: "Erro ao comunicar com a IA." });
  }
}