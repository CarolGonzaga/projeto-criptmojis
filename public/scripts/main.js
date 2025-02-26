import { setupDifficultyButtons } from "./modules/difficulty.js";
import { setupRulesModal } from "./modules/rules.js";
import { generateEmojiButton } from "./modules/gameControls.js";
// Inicializa os eventos quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    // Configura os botões de dificuldade e o menu de nível.
    setupDifficultyButtons();
    setupRulesModal();
    generateEmojiButton();
    // Verifica se os elementos de alerta existem na página.
    const alertBox = document.querySelector("#alert-box");
    const alertMessage = document.querySelector("#alert-message");
    if (!alertBox || !alertMessage) {
        console.error("Erro: Elementos do alerta não encontrados!");
        return;
    }
});
