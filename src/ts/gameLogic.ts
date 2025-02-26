// src/ts/gameLogic.ts
import { showAlert } from "./modules/alert.js";
import { generateEmojiButton} from "./modules/gameControls.js";
import { setupNivelMenu } from "./modules/difficulty.js";
import { gameState } from "./state.js";

// Adiciona um emoji à aposta na primeira posição livre.
export function addEmojiToBet(emoji: string): void {
  if (gameState.selectedEmojis.includes(emoji)) {
    showAlert("Esse emoji já foi selecionado! Escolha outro.");
    return;
  }

  const index = gameState.selectedEmojis.indexOf(null);
  if (index === -1) {
    showAlert("Você já selecionou o máximo de 5 emojis!");
    return;
  }

  gameState.selectedEmojis[index] = emoji;
  updateBetDisplay();
}

// Atualiza a área de aposta na interface, exibindo os emojis selecionados.
export function updateBetDisplay(): void {
  const betEmojisContainer = document.querySelector(".bet-emojis") as HTMLElement | null;
  if (!betEmojisContainer) {
    console.error("Erro: Container de bet-emojis não encontrado!");
    return;
  }

  // Limpa o container e recria os elementos para cada posição.
  betEmojisContainer.innerHTML = "";
  gameState.selectedEmojis.forEach((emoji, index) => {
    const span = document.createElement("span");
    span.className = "bet-circle";
    span.id = `bet-${index + 1}`;
    span.textContent = emoji || "";
    
    // Permite remover o emoji clicando sobre ele.
    if (emoji !== null) {
      span.addEventListener("click", () => {
        removeEmojiFromBet(index);
      });
    }
    betEmojisContainer.appendChild(span);
  });
}

// Limpa a área de aposta, reiniciando todas as posições para null.
export function clearBetDisplay(): void {
  const betEmojisContainer = document.querySelector(".bet-emojis") as HTMLElement | null;
  if (!betEmojisContainer) {
    console.error("Erro: Container de bet-emojis não encontrado!");
    return;
  }
  betEmojisContainer.innerHTML = "";
  
  // Atualiza cada posição do array para null sem reatribuir o array
  gameState.selectedEmojis.forEach((_, i, arr) => arr[i] = null);
  updateBetDisplay();
}

// Remove o emoji de uma posição específica na aposta.
export function removeEmojiFromBet(index: number): void {
  gameState.selectedEmojis[index] = null;
  updateBetDisplay();
}

// Ordena a lista de resultados de acordo com as regras do jogo.
export function customSort(list: string[]): string[] {
  return list.sort((a, b) => {
    const order: { [key: string]: number } = { match: 0, partial: 1, wrong: 2 };
    return order[a] - order[b];
  });
}

// Configura o botão de envio da aposta.
export function setupSendButton(): void {
  const sendBtn = document.querySelector(".bet-button") as HTMLElement | null;
  if (!sendBtn) {
    console.error("send-button não encontrado!");
    return;
  }

  sendBtn.addEventListener("click", () => {
    // Verifica se há posições vazias na aposta.
    if (gameState.selectedEmojis.some(item => item === null || item === "")) {
      showAlert("Você precisa informar 5 emojis antes de enviar!");
      return;
    } else {
      endGame();

      let listResult: string[] = [];
      let result = "wrong";

      // Compara os emojis selecionados com o código secreto.
      gameState.selectedEmojis.forEach((emoji, index) => {
        if (gameState.secretCode[index] === gameState.selectedEmojis[index]) {
          result = "match";
          listResult.push(result);
        } else if (gameState.secretCode.some(item => item === gameState.selectedEmojis[index])) {
          result = "partial";
          listResult.push(result);
        } else {
          result = "wrong";
          listResult.push(result);
        }
      });

      // Ordena os resultados para exibição.
      const sortedList = customSort(listResult);
      const sequenceContainer = document.querySelector(".attempts-content") as HTMLElement;
      const sequenceItem = document.createElement("div");
      sequenceItem.className = "sequence";
      sequenceItem.innerHTML = `
            <div class="item">${gameState.selectedEmojis[0]}</div>
            <div class="item">${gameState.selectedEmojis[1]}</div>
            <div class="item">${gameState.selectedEmojis[2]}</div>
            <div class="item">${gameState.selectedEmojis[3]}</div>
            <div class="item">${gameState.selectedEmojis[4]}</div>
            <div></div>
            <div class="item result">
              <div class="item-1">
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" fill="none" class="${sortedList[0]}" />
                </svg>
              </div>
              <div class="item-2">
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" fill="none" class="${sortedList[1]}" />
                </svg>
              </div>
              <div class="item-3">
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" fill="none" class="${sortedList[2]}" />
                </svg>
              </div>
              <div class="item-4">
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" fill="none" class="${sortedList[3]}" />
                </svg>
              </div>
              <div class="item-5">
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" fill="none" class="${sortedList[4]}" />
                </svg>
              </div>
            </div>`;
      // Exibe a tentativa na lista de jogadas.
      sequenceContainer.appendChild(sequenceItem);
      sequenceContainer.scrollTop = sequenceContainer.scrollHeight;
      clearBetDisplay();
    }
  });
}

// Inicia o jogo
export function startGame(attempts: number, selectedDifficulty: string): void {
  gameState.numAttempts = attempts;
  gameState.difficulty = selectedDifficulty;

  const body = document.querySelector("body");
  if (body) {
    // Insere o HTML do jogo na página.
    body.innerHTML = generateGameHTML();
    
    // Recria os botões de emoji e configura os controles.
    generateEmojiButton();
    setupSendButton();
    setupResetButton();
    updateScore();
    setupNivelMenu();
    
    // Gera uma nova sequência secreta de emojis.
    gameState.secretCode = getEmojis();
  }
}

// Formata o número de tentativas para exibição.
export function formatNumAttempts(numAttempts: number): string {
  return numAttempts < 10 ? `0${numAttempts}` : numAttempts.toString();
}

// Atualiza a interface com a dificuldade e o número de tentativas.
export function updateUI(): void {
  const gameDifficulty = document.querySelector("#game-difficulty") as HTMLElement;
  const attemptCount = document.querySelector("#numAttempts") as HTMLElement;
  if (gameDifficulty) gameDifficulty.textContent = gameState.difficulty;
  if (attemptCount) attemptCount.textContent = formatNumAttempts(gameState.numAttempts);
}

// Atualiza a pontuação na interface.
export function updateScore(): void {
  const scoreCount = document.querySelector("#player-score") as HTMLElement;
  if (scoreCount) scoreCount.textContent = `${gameState.score}`;
}

// Gera um novo código secreto de 5 emojis.
export function getEmojis(): string[] {
  const newEmojis: string[] = [
    "❤️",
    "😭",
    "🔥",
    "🌻",
    "😎",
    "😜",
    "⭐",
    "🐱",
    "🐞",
    "🎁",
    "🎲",
    "💡",
  ];
  // Embaralha e seleciona os 5 primeiros.
  return newEmojis.sort(() => Math.random() - 0.5).slice(0, 5);
}

// Processa o fim do jogo
export function endGame(): void {
  //Decrementa as tentativas
  gameState.numAttempts--;
  updateUI();

  // Verifica se a aposta do jogador corresponde ao código secreto.
  if (compareLists(gameState.secretCode, gameState.selectedEmojis as string[])) {
    showEndGameMessage("Parabéns! Você ganhou! 🎉");
    updateUI();
    showCode();
    calculateScore(gameState.difficulty, gameState.numAttempts);
    updateScore();
    disableGameControls();
  } else if (gameState.numAttempts <= 0) {
    showEndGameMessage("Fim de Jogo! 😢");
    gameState.numAttempts = 0;
    updateUI();
    showCode();
    disableGameControls();
  }
}

// Exibe uma mensagem de fim de jogo e desabilita os controles.
export function showEndGameMessage(message: string): void {
  showAlert(message);
  disableGameControls();
}

// Habilita os botões do jogo.
export function enableGameControls(): void {
  const sendBtn = document.querySelector(".bet-button") as HTMLElement | null;
  const emojiButtons = document.querySelectorAll("#list-emojis button");
  if (sendBtn) {
    sendBtn.classList.remove("block");
  }
  emojiButtons.forEach(btn => (btn as HTMLButtonElement).disabled = false);
}

// Desabilita os botões do jogo após o fim da partida.
export function disableGameControls(): void {
  const sendBtn = document.querySelector(".bet-button") as HTMLElement | null;
  const emojiButtons = document.querySelectorAll("#list-emojis button");
  if (sendBtn) {
    sendBtn.classList.add("block");
  }
  emojiButtons.forEach(btn => (btn as HTMLButtonElement).disabled = true);
}

// Exibe o código secreto na interface.
export function showCode(): void {
  const tagCodes = document.querySelectorAll(".password-panel span");
  tagCodes.forEach((code, index) => {
    (code as HTMLElement).textContent = `${gameState.secretCode[index]}`;
  });
}

// Oculta o código secreto, substituindo-o por *.
export function hideCode(): void {
  const tagCodes = document.querySelectorAll(".password-panel span");
  tagCodes.forEach((code) => {
    (code as HTMLElement).textContent = `✱`;
  });
}

//Calcula a pontuação com base na dificuldade e nas tentativas restantes.
export function calculateScore(difficulty: string, attemptsLeft: number): number {
  let baseScore = 0;
  switch (difficulty) {
    case "Tranquilo":
      baseScore = 100;
      break;
    case "Moderado":
      baseScore = 200;
      break;
    case "Insano":
      baseScore = 300;
      break;
    default:
      console.error("Nível de dificuldade inválido!");
      return 0;
  }
  const bonus = attemptsLeft * 10;
  gameState.score += baseScore + bonus;
  return gameState.score;
}

// Compara duas listas de emojis para verificar se são idênticas.
export function compareLists(list1: string[], list2: string[]): boolean {
  if (list1.length !== list2.length) return false;
  return list1.every((item, index) => item === list2[index]);
}

// Reinicia o jogo
export function resetGame(): void {
  //Gera um novo código secreto.
  gameState.secretCode = getEmojis();

  // Reseta o número de tentativas.
  gameState.numAttempts = gameState.difficulty === "Tranquilo" ? 10 : gameState.difficulty === "Moderado" ? 8 : 6;

  const sequenceContainer = document.querySelector(".attempts-content") as HTMLElement | null;
  if (sequenceContainer) sequenceContainer.innerHTML = "";

  // Atualiza cada elemento do array selectedEmojis para null.
  gameState.selectedEmojis.forEach((_, i, arr) => arr[i] = null);

  hideCode();
  updateUI();
  clearBetDisplay();
  enableGameControls();
}

// Configura o botão de reset.
export function setupResetButton(): void {
  const resetBtn = document.querySelector("#btn-reset") as HTMLElement | null;
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

// Retorna o HTML da interface do jogo.
export function generateGameHTML(): string {
  return `
  <div class="main">
    <div id="alert-box" class="alert-box hidden">
      <div class="modal-box">
        <h1>Aviso!</h1>
        <p id="alert-message"></p>
      </div>
      <button class="close-alert" id="close-btn">Ok</button>
    </div>
    <div class="header">
      <section class="top">
        <h1>Criptmojis</h1>
        <div>
          <i class="fa-solid fa-arrow-rotate-right" id="btn-reset"></i>
          <i class="fa-solid fa-sliders" id="btn-nivel"></i>
          <div id="nivel-box" class="nivel-box">
            <div class="modal-box">
              <div class="title-box">
                <h1>Dificuldade:</h1>
              </div>
              <div class="btn-box">
                <button class="nivel-option" data-difficulty="Tranquilo">Tranquilo</button>
                <button class="nivel-option" data-difficulty="Moderado">Moderado</button>
                <button class="nivel-option" data-difficulty="Insano">Insano</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="score-content">
        <p class="score-bar">
          <span class="score-title">Nível:</span>
          <span class="score-info" id="game-difficulty">${gameState.difficulty}</span>
        </p>
        <p class="score-bar">
          <span class="score-title">Pontuação:</span>
          <span class="score-info" id="player-score">${gameState.score}</span>
        </p>
      </section>
    </div>
    <div class="game-content">
      <section class="password-panel">
        <span id="code-1">✱</span>
        <span id="code-2">✱</span>
        <span id="code-3">✱</span>
        <span id="code-4">✱</span>
        <span id="code-5">✱</span>
      </section>
      <section class="boardgame">
        <div class="boardgame-title">
          <p>últimas jogadas</p>
          <p>resultados</p>
        </div>
        <div class="attempts-content"></div>
        <div class="boardgame-botton">
          <p>tentativas: </p>
          <span id="numAttempts">${formatNumAttempts(gameState.numAttempts)}</span>
        </div>
      </section>
      <section class="player-bet">
        <div class="bet-emojis" id="bet-barr">
          <span id="bet-1" class="bet-circle"></span>
          <span id="bet-2" class="bet-circle"></span>
          <span id="bet-3" class="bet-circle"></span>
          <span id="bet-4" class="bet-circle"></span>
          <span id="bet-5" class="bet-circle"></span>
        </div>
        <div class="bet-button">
          <i class="fa-solid fa-arrow-up" id="send-button"></i>
        </div>
      </section>
    </div>
    <div class="footer">
      <div class="title">
        <p>selecione um emoji</p>
      </div>
      <div class="emojis-container">
        <ul id="list-emojis"></ul>
      </div>
    </div>
  </div>
  `;
}