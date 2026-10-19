module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Método não permitido" } });
  }

  const { texto } = req.body || {};

  if (!texto || typeof texto !== "string" || texto.length > 4000) {
    return res.status(400).json({ error: { message: "Texto inválido" } });
  }

  const modelo = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

  try {
    const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelo,
        messages: [
          { role: "system", content: "Responda em texto simples, sempre em PT-BR." },
          { role: "user", content: texto },
        ],
      }),
    });

    const dados = await resposta.json();
    return res.status(resposta.status).json(dados);
  } catch (e) {
    return res.status(500).json({ error: { message: "Falha ao contatar a Groq" } });
  }
};