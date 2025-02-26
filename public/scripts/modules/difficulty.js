import { startGame } from "../gameLogic.js";
// Configura os botões de dificuldade para iniciar o jogo com o número correto de tentativas.
export function setupDifficultyButtons() {
    const btnEasy = document.querySelector("#button-easy");
    const btnNormal = document.querySelector("#button-normal");
    const btnHard = document.querySelector("#button-hard");
    // Associa cada botão à função startGame com os parâmetros correspondentes.
    btnEasy === null || btnEasy === void 0 ? void 0 : btnEasy.addEventListener("click", () => startGame(10, "Tranquilo"));
    btnNormal === null || btnNormal === void 0 ? void 0 : btnNormal.addEventListener("click", () => startGame(8, "Moderado"));
    btnHard === null || btnHard === void 0 ? void 0 : btnHard.addEventListener("click", () => startGame(6, "Insano"));
}
// Configura o menu de seleção de dificuldade exibido na tela de jogo.
export function setupNivelMenu() {
    const btnNivel = document.querySelector("#btn-nivel");
    const menuNivel = document.querySelector("#nivel-box");
    const nivelOptions = document.querySelectorAll(".nivel-option");
    if (!btnNivel || !menuNivel) {
        console.error("Botão ou menu de nível não encontrado!");
        return;
    }
    // Alterna a visibilidade do menu ao clicar no botão.
    btnNivel.addEventListener("click", () => {
        if (menuNivel.classList.contains("show")) {
            menuNivel.classList.remove("show");
            setTimeout(() => menuNivel.classList.add("hidden"), 400);
        }
        else {
            menuNivel.classList.remove("hidden");
            menuNivel.classList.add("show");
        }
    });
    // Ao clicar em uma opção, altera o nível e reinicia o jogo.
    nivelOptions.forEach((button) => {
        button.addEventListener("click", () => {
            const newDifficulty = button.getAttribute("data-difficulty");
            changeDifficulty(newDifficulty);
            menuNivel.classList.remove("show");
            setTimeout(() => menuNivel.classList.add("hidden"), 400);
        });
    });
}
// Altera a dificuldade do jogo e reinicia com as tentativas adequadas.
export function changeDifficulty(newDifficulty) {
    const attempts = newDifficulty === "Tranquilo" ? 10 : newDifficulty === "Moderado" ? 8 : 6;
    startGame(attempts, newDifficulty);
}
