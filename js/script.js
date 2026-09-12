const apiKey = window.CONFIG.API_KEY;

const caixaResultado = document.getElementById("caixa-resultado");
const inputPrompt = document.getElementById("prompt");
const botaoEnvia = document.getElementById("enviar");
const elementoResposta = document.getElementById("resposta-prompt");

const chamaGroq = async (textoUsuario) => {
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

    try {
        const resposta = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "groq/compound-mini",
                messages: [{ role: "user", content: textoUsuario }]
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error("Mensagem exata do erro:", dados.error.message);
            console.error("Tipo do erro:", dados.error.type);
            return `Erro na API (${resposta.status}): ${dados.error.message}`;
        }

        return dados.choices[0].message.content;

    } catch (e) {
        console.error("ERRO NA REQUISIÇÃO:", e);
        return "Desculpe, ocorreu um erro ao consultar a IA.";
    }
};

botaoEnvia.addEventListener("click", async (event) => {
    event.preventDefault();

    const texto = inputPrompt.value;

    if (!texto) return;

    elementoResposta.innerText = "Pensando...";

    const respostaIA = await chamaGroq(texto);

    elementoResposta.innerText = respostaIA;
});