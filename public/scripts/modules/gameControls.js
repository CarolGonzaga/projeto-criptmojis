import { gameState } from "../state.js";
import { addEmojiToBet } from "../gameLogic.js";
import { resetGame } from "../gameLogic.js";
// Gera dinamicamente os botões de emoji na tela.
export function generateEmojiButton() {
    const listBtnEmoji = document.querySelector("#list-emojis");
    if (!listBtnEmoji) {
        console.error("Erro: A lista de emojis não foi encontrada!");
        return;
    }
    // Limpa a lista atual de botões.
    listBtnEmoji.innerHTML = "";
    // Para cada emoji disponível, cria um botão que, ao ser clicado, adiciona o emoji à aposta.
    gameState.emojis.forEach((emoji) => {
        const listItem = document.createElement("li");
        const buttonItem = document.createElement("button");
        buttonItem.textContent = emoji;
        buttonItem.addEventListener("click", () => {
            addEmojiToBet(emoji);
        });
        listItem.appendChild(buttonItem);
        listBtnEmoji.appendChild(listItem);
    });
}
// Configura o botão de reset para reiniciar a partida.
export function setupResetButton() {
    const resetBtn = document.querySelector("#btn-reset");
    if (!resetBtn) {
        console.error("Botão reset não encontrado!");
        return;
    }
    resetBtn.addEventListener("click", () => {
        const userResponse = confirm("Deseja iniciar uma nova partida?");
        if (userResponse) {
            resetGame();
        }
    });
}
