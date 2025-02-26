// Configura a exibição do modal de regras.
// Ao clicar no botão de regras, esconde a tela principal e o rodapé, mostrando somente as regras.
// Ao clicar no botão "Voltar", restaura a tela principal.
export function setupRulesModal() {
    // Seleciona os elementos do modal e da página.
    const rulesButton = document.getElementById("rulesButton");
    const closeButton = document.getElementById("closeRules");
    const sectionContainer = document.querySelector(".section-container");
    const indexContainer = document.querySelector(".index");
    const footer = document.querySelector("footer");
    // Verifica se todos os elementos foram encontrados.
    if (!rulesButton || !closeButton || !sectionContainer || !indexContainer || !footer) {
        console.error("Algum elemento não foi encontrado!");
        return;
    }
    // Ao clicar em "regras", exibe o modal e esconde outros elementos.
    rulesButton.addEventListener("click", () => {
        sectionContainer.classList.add("active");
        indexContainer.style.display = "none";
        footer.style.display = "none";
    });
    // Ao clicar em "voltar", oculta o modal e restaura a tela principal.
    closeButton.addEventListener("click", () => {
        sectionContainer.classList.remove("active");
        setTimeout(() => {
            indexContainer.style.display = "flex";
            footer.style.display = "flex";
        }, 300);
    });
}
