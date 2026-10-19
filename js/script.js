const caixaResultado = document.getElementById("caixa-resultado");
const inputPrompt = document.getElementById("prompt");
const botaoEnvia = document.getElementById("enviar");
const elementoResposta = document.getElementById("resposta-prompt");
const badgeModelo = document.getElementById("badge-modelo");

const atualizaBadge = (nomeModelo) => {
    badgeModelo.innerText = `Modelo: ${nomeModelo}`;
};

const chamaGroq = async (textoUsuario) => {
    try {
        const resposta = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto: textoUsuario })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            const msg = dados?.error?.message || "Erro desconhecido";
            console.error("Erro da API:", msg);
            return `Erro na API (${resposta.status}): ${msg}`;
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

    const texto = inputPrompt.value.trim();
    if (!texto) return;

    botaoEnvia.disabled = true;
    elementoResposta.innerText = "Pensando...";

    const respostaIA = await chamaGroq(texto);

    elementoResposta.innerHTML = DOMPurify.sanitize(marked.parse(respostaIA));
    botaoEnvia.disabled = false;
});