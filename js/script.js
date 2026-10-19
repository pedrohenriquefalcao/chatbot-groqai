const apiKey = window.CONFIG.API_KEY;
const modelo = window.CONFIG.MODEL;

const caixaResultado = document.getElementById("caixa-resultado");
const inputPrompt = document.getElementById("prompt");
const botaoEnvia = document.getElementById("enviar");
const elementoResposta = document.getElementById("resposta-prompt");
const badgeModelo = document.getElementById("badge-modelo");

const atualizaBadge = (nomeModelo) => {
    badgeModelo.innerText = `Modelo: ${nomeModelo}`;
};

atualizaBadge(modelo);

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
                model: modelo,
                messages: [
                    { role: "system", content: "Responda em texto simples, sempre em PT-BR." },
                    { role: "user", content: textoUsuario }
                ]
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error("Mensagem exata do erro:", dados.error.message);
            console.error("Tipo do erro:", dados.error.type);
            return `Erro na API (${resposta.status}): ${dados.error.message}`;
        }

        if (dados.model) atualizaBadge(dados.model);
            
        return dados.choices[0].message.content;

    } catch (e) {
        console.error("ERRO NA REQUISIÇÃO:", e);
        return "Desculpe, ocorreu um erro ao consultar a IA.";
    }
};

botaoEnvia.addEventListener("click", async (event) => {
    event.preventDefault();

    botaoEnvia.disabled = true;

    const texto = inputPrompt.value.trim();

    if (!texto) return;

    botaoEnvia.disabled = true;

    elementoResposta.innerText = "Pensando...";

    const respostaIA = await chamaGroq(texto);



    elementoResposta.innerHTML = DOMPurify.sanitize(marked.parse(respostaIA));

    botaoEnvia.disabled = false;
});