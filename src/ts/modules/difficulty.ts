import { startGame, updateUI } from "../gameLogic.js";

// Configura os botões de dificuldade para iniciar o jogo com o número correto de tentativas.
export function setupDifficultyButtons(): void {
  const btnEasy = document.querySelector("#button-easy") as HTMLButtonElement;
  const btnNormal = document.querySelector("#button-normal") as HTMLButtonElement;
  const btnHard = document.querySelector("#button-hard") as HTMLButtonElement;

  // Associa cada botão à função startGame com os parâmetros correspondentes.
  btnEasy?.addEventListener("click", () => startGame(10, "Tranquilo"));
  btnNormal?.addEventListener("click", () => startGame(8, "Moderado"));
  btnHard?.addEventListener("click", () => startGame(6, "Insano"));
}

// Configura o menu de seleção de dificuldade exibido na tela de jogo.
export function setupNivelMenu(): void {
  const btnNivel = document.querySelector("#btn-nivel") as HTMLElement | null;
  const menuNivel = document.querySelector("#nivel-box") as HTMLElement | null;
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
    } else {
      menuNivel.classList.remove("hidden");
      menuNivel.classList.add("show");
    }
  });

  // Ao clicar em uma opção, altera o nível e reinicia o jogo.
  nivelOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const newDifficulty = button.getAttribute("data-difficulty")!;
      changeDifficulty(newDifficulty);
      menuNivel.classList.remove("show");
      setTimeout(() => menuNivel.classList.add("hidden"), 400);
    });
  });
}

// Altera a dificuldade do jogo e reinicia com as tentativas adequadas.
export function changeDifficulty(newDifficulty: string): void {
  const attempts = newDifficulty === "Tranquilo" ? 10 : newDifficulty === "Moderado" ? 8 : 6;
  startGame(attempts, newDifficulty);
}
