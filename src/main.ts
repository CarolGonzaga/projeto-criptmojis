document.addEventListener("DOMContentLoaded", () => {
  setupDifficultyButtons();
  setupRulesModal();
  generateEmojiButton();

  const alertBox = document.querySelector("#alert-box") as HTMLElement | null;
  const alertMessage = document.querySelector(
    "#alert-message"
  ) as HTMLElement | null;

  if (!alertBox || !alertMessage) {
    console.error("Erro: Elementos do alerta não encontrados!");
    return;
  }
});

// **Exibe um aviso na tela.**
function showAlert(message: string, duration: number = 2500): void {
  const alertBox = document.querySelector("#alert-box") as HTMLElement | null;
  const alertMessage = document.querySelector(
    "#alert-message"
  ) as HTMLElement | null;
  const alertBtn = document.querySelector("#close-btn") as HTMLButtonElement;

  if (!alertBox || !alertMessage) {
    console.error("Erro: Elementos do alerta não encontrados!");
    return;
  }

  alertMessage.textContent = message; // Define a mensagem
  alertBox.classList.remove("hidden"); // Exibe o alerta

  alertBtn.addEventListener('click', () => {
    alertBox.classList.add("hidden");
  });
}

// **Configura a exibição do modal de regras**
function setupRulesModal(): void {
  const rulesButton = document.getElementById(
    "rulesButton"
  ) as HTMLButtonElement | null;
  const closeButton = document.getElementById(
    "closeRules"
  ) as HTMLButtonElement | null;
  const sectionContainer = document.querySelector(
    ".section-container"
  ) as HTMLElement | null;
  const indexContainer = document.querySelector(".index") as HTMLElement | null;
  const footer = document.querySelector("footer") as HTMLElement | null;

  if (
    !rulesButton ||
    !closeButton ||
    !sectionContainer ||
    !indexContainer ||
    !footer
  ) {
    console.error("Algum elemento não foi encontrado!");
    return;
  }

  rulesButton.addEventListener("click", () => {
    sectionContainer.classList.add("active");
    indexContainer.style.display = "none"; // Esconde a tela inicial
    footer.style.display = "none"; // Esconde o rodapé
  });

  closeButton.addEventListener("click", () => {
    sectionContainer.classList.remove("active");
    setTimeout(() => {
      indexContainer.style.display = "flex"; // Mostra a tela inicial
      footer.style.display = "flex"; // Mostra o rodapé de volta
    }, 300);
  });
}

// **Variáveis globais**
const emojis: string[] = [
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
let score: number = 0;
let numAttempts: number;
let difficulty: string;
let secretCode: string[] = [];
let selectedEmojis: (string | null)[] = [null, null, null, null, null];

// **Configuração dos botões de dificuldade**
function setupDifficultyButtons(): void {
  const btnEasy = document.querySelector("#button-easy") as HTMLButtonElement;
  const btnNormal = document.querySelector(
    "#button-normal"
  ) as HTMLButtonElement;
  const btnHard = document.querySelector("#button-hard") as HTMLButtonElement;

  btnEasy?.addEventListener("click", () => startGame(10, "Tranquilo"));
  btnNormal?.addEventListener("click", () => startGame(8, "Moderado"));
  btnHard?.addEventListener("click", () => startGame(6, "Insano"));
}

function generateEmojiButton(): void {
  const listBtnEmoji = document.querySelector(
    "#list-emojis"
  ) as HTMLUListElement | null;
  if (!listBtnEmoji) {
    console.error("Erro: A lista de emojis não foi encontrada!");
    return;
  }

  listBtnEmoji.innerHTML = "";

  emojis.forEach((emoji) => {
    const listItem = document.createElement("li");
    const buttonItem = document.createElement("button");
    buttonItem.textContent = emoji;

    // Ao clicar no botão, tenta adicionar o emoji à área de aposta
    buttonItem.addEventListener("click", () => {
      addEmojiToBet(emoji);
    });

    listItem.appendChild(buttonItem);
    listBtnEmoji.appendChild(listItem);
  });
}

// Função para adicionar um emoji na primeira posição livre
function addEmojiToBet(emoji: string): void {
  // Verifica se o emoji já está na aposta
  if (selectedEmojis.includes(emoji)) {
    showAlert("Esse emoji já foi selecionado! Escolha outro.");
    return;
  }

  // Procura o primeiro slot vazio
  const index = selectedEmojis.indexOf(null);
  if (index === -1) {
    showAlert("Você já selecionou o máximo de 5 emojis!");
    return;
  }

  // Adiciona o emoji à posição disponível
  selectedEmojis[index] = emoji;
  updateBetDisplay();
}

// Atualiza a exibição da área de aposta
function updateBetDisplay(): void {
  // Seleciona o container de bet-emojis
  const betEmojisContainer = document.querySelector(
    ".bet-emojis"
  ) as HTMLElement | null;

  if (!betEmojisContainer) {
    console.error("Erro: Container de bet-emojis não encontrado!");
    return;
  }

  // Limpa o conteúdo atual
  betEmojisContainer.innerHTML = "";

  // Para cada posição do array selectedEmojis, cria um novo <span>
  selectedEmojis.forEach((emoji, index) => {
    const span = document.createElement("span");
    span.className = "bet-circle";
    span.id = `bet-${index + 1}`;
    span.textContent = emoji || ""; // Se emoji for null, ficará vazio

    // Se houver um emoji, adiciona um event listener para removê-lo
    if (emoji !== null) {
      span.addEventListener("click", () => {
        removeEmojiFromBet(index);
      });
    }

    // Adiciona o span ao container
    betEmojisContainer.appendChild(span);
  });
}

function clearBetDisplay(): void {
  // Seleciona o container de bet-emojis
  const betEmojisContainer = document.querySelector(
    ".bet-emojis"
  ) as HTMLElement | null;

  if (!betEmojisContainer) {
    console.error("Erro: Container de bet-emojis não encontrado!");
    return;
  }

  // Limpa o conteúdo atual
  betEmojisContainer.innerHTML = "";
  selectedEmojis = [null, null, null, null, null];
  updateBetDisplay();
}

// Função para remover um emoji de uma posição específica
function removeEmojiFromBet(index: number): void {
  selectedEmojis[index] = null;
  updateBetDisplay();
}

function customSort(list: string[]): string[] {
  return list.sort((a, b) => {
    const order: { [key: string]: number } = { match: 0, partial: 1, wrong: 2 };
    return order[a] - order[b];
  });
}

// Função para configurar o botão de envio
function setupSendButton(): void {
  const sendBtn = document.querySelector(".bet-button") as HTMLElement | null;
  let listResult: string[] = [];

  if (!sendBtn) {
    console.error("send-button não encontrado!");
    return;
  }

  sendBtn.addEventListener("click", () => {
    
    if (selectedEmojis.some((item) => item === null || item === "")) {
      showAlert("Você precisa informar 5 emojis antes de enviar!");
      return;
    } else {
      
      endGame();
      
      let result = "wrong";

      selectedEmojis.forEach((emoji, index) => {

        if (secretCode[index] === selectedEmojis[index]) {
          result = "match";
          listResult.push(result)

        } else if (secretCode.some(item => item === selectedEmojis[index])) {
          result = "partial";
          listResult.push(result)

        } else {
          result = "wrong";
          listResult.push(result)
          
        }
      })

      const sortedList = customSort(listResult);

      const sequenceContainer = document.querySelector(
        ".attempts-content"
      ) as HTMLElement;

      const sequenceItem = document.createElement("div");
      sequenceItem.className = "sequence";
      sequenceItem.innerHTML = `
            <div class="item">${selectedEmojis[0]}</div>
            <div class="item">${selectedEmojis[1]}</div>
            <div class="item">${selectedEmojis[2]}</div>
            <div class="item">${selectedEmojis[3]}</div>
            <div class="item">${selectedEmojis[4]}</div>
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

      sequenceContainer.appendChild(sequenceItem);
      sequenceContainer.scrollTop = sequenceContainer.scrollHeight;
      clearBetDisplay();
      listResult = [];
    }
  });
}

// **Função para iniciar o jogo**
function startGame(attempts: number, selectedDifficulty: string): void {
  numAttempts = attempts - 1;
  difficulty = selectedDifficulty;

  // Atualiza a interface do jogo
  const body = document.querySelector("body");
  if (body) {
    body.innerHTML = generateGameHTML();
    generateEmojiButton();
    setupSendButton();
    setupResetButton();
    updateScore();
    setupNivelMenu();
    secretCode = getEmojis();
  }

  console.log(
    `Jogo iniciado! Dificuldade: ${difficulty}, Tentativas: ${numAttempts}, Senha: ${secretCode}`
  );
}

// **Função auxiliar para formatar número de tentativas**
function formatNumAttempts(numAttempts: number): string {
  return numAttempts < 10 ? `0${numAttempts}` : numAttempts.toString();
}

// **Atualiza a interface sem resetar a pontuação**
function updateUI(): void {
  const gameDifficulty = document.querySelector("#game-difficulty") as HTMLElement;
  const attemptCount = document.querySelector("#numAttempts") as HTMLElement;

  if (gameDifficulty) gameDifficulty.textContent = difficulty;
  if (attemptCount) attemptCount.textContent = formatNumAttempts(numAttempts);
}

function updateScore(): void {
  const scoreCount = document.querySelector("#player-score") as HTMLElement;
  if (scoreCount) scoreCount.textContent = `${score}`;
}

// function embaralha array emojis
// **Gera uma nova sequência de emojis aleatórios**
function getEmojis(): string[] {
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
  return newEmojis.sort(() => Math.random() - 0.5).slice(0, 5);
}

// **Função para finalizar o jogo**
function endGame(): void {

  if (numAttempts < 0) {
    showEndGameMessage("Fim de Jogo!");
    numAttempts = 0;
    updateUI();
    showCode();
    disableGameControls();
  
  } else if (compareLists(secretCode, selectedEmojis as string[])) {
    showEndGameMessage("Parabéns! Você ganhou! 🎉");
    updateUI();
    showCode();
    calculateScore(difficulty, numAttempts);
    updateScore();
    disableGameControls();
  
  } else {
    updateUI();
    numAttempts--;
  }
}

function showEndGameMessage(message: string): void {
  showAlert(message, 5000); // Exibe a mensagem por 5 segundos
  disableGameControls();
}

function enableGameControls(): void {
  const sendBtn = document.querySelector(".bet-button") as HTMLElement | null;
  const emojiButtons = document.querySelectorAll("#list-emojis button");

  if (sendBtn) {
    sendBtn.classList.remove("block");    
  }
  emojiButtons.forEach(btn => (btn as HTMLButtonElement).disabled = false); // Bloqueia os botões de emoji
}

function disableGameControls(): void {
  const sendBtn = document.querySelector(".bet-button") as HTMLElement | null;
  const emojiButtons = document.querySelectorAll("#list-emojis button");

  if (sendBtn) {
    sendBtn.classList.add("block");    
  }
  emojiButtons.forEach(btn => (btn as HTMLButtonElement).disabled = true); // Bloqueia os botões de emoji
}

function showCode(): void {
    const tagCodes = document.querySelectorAll(".password-panel span");

    tagCodes.forEach((code, index) => {
      const codeElement = code as HTMLElement;
      codeElement.textContent = `${secretCode[index]}`; // Exemplo de substituição de conteúdo
    });
}

function hideCode(): void {
  const tagCodes = document.querySelectorAll(".password-panel span");

  tagCodes.forEach((code) => {
    const codeElement = code as HTMLElement;
    codeElement.textContent = `✱`; // Exemplo de substituição de conteúdo
  });
}

function calculateScore(difficulty: string, attemptsLeft: number): number {
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

  // Bônus por tentativas restantes
  const bonus = attemptsLeft * 10;
  score += baseScore + bonus

  return score;
}

function compareLists(list1: string[], list2: string[]): boolean {
  if (list1.length !== list2.length) return false;
  return list1.every((item, index) => item === list2[index]);
}

function resetGame(): void {
  console.log("Reiniciando o jogo...");

  // Gera uma nova senha
  secretCode = getEmojis();

  // Reseta as tentativas conforme o nível de dificuldade atual
  numAttempts = difficulty === "Tranquilo" ? 10 : difficulty === "Moderado" ? 8 : 6;

  // Limpa as apostas feitas
  const sequenceContainer = document.querySelector(".attempts-content") as HTMLElement | null;
  if (sequenceContainer) sequenceContainer.innerHTML = ""; // Apaga todas as apostas já feitas

  // Limpa a área de aposta
  selectedEmojis = [null, null, null, null, null];

  // Atualiza a interface
  hideCode();
  updateUI();
  clearBetDisplay();
  enableGameControls();

  console.log(`Novo jogo iniciado! Dificuldade: ${difficulty}, Tentativas: ${numAttempts}, Senha: ${secretCode}`);
}

function setupResetButton(): void {
  const resetBtn = document.querySelector("#btn-reset") as HTMLElement | null;

  if (!resetBtn) {
    console.error("Botão reset não encontrado!");
    return;
  }

  resetBtn.addEventListener("click", () => {
    const userResponse = confirm("Deseja reiniciar a partida?");

    if (userResponse) {
      console.log("Usuário clicou em OK!");
      resetGame();

    } else {
      console.log("Usuário clicou em Cancelar!");
      return
    }
  })
}

function setupNivelMenu(): void {
  const btnNivel = document.querySelector("#btn-nivel") as HTMLElement | null;
  const menuNivel = document.querySelector("#nivel-box") as HTMLElement | null;
  const nivelOptions = document.querySelectorAll(".nivel-option");

  if (!btnNivel || !menuNivel) {
    console.error("Botão ou menu de nível não encontrado!");
    return;
  }

  // Alterna a visibilidade do menu ao clicar no botão
  btnNivel.addEventListener("click", () => {
    if (menuNivel.classList.contains("show")) {
      menuNivel.classList.remove("show");
      setTimeout(() => menuNivel.classList.add("hidden"), 400); // Aguarda animação antes de esconder
    } else {
      menuNivel.classList.remove("hidden");
      menuNivel.classList.add("show");
    }
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener("click", (event) => {
    if (!menuNivel.contains(event.target as Node) && event.target !== btnNivel) {
      menuNivel.classList.remove("show");
      setTimeout(() => menuNivel.classList.add("hidden"), 400);
    }
  });

  // Adiciona evento aos botões do menu para mudar a dificuldade
  nivelOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const newDifficulty = button.getAttribute("data-difficulty")!;
      changeDifficulty(newDifficulty);
      menuNivel.classList.remove("show");
      setTimeout(() => menuNivel.classList.add("hidden"), 400);
    });
  });
}

function changeDifficulty(newDifficulty: string): void {
  difficulty = newDifficulty;
  numAttempts = newDifficulty === "Tranquilo" ? 10 : newDifficulty === "Moderado" ? 8 : 6;
  
  startGame(numAttempts, difficulty);

  console.log(`Dificuldade alterada para: ${difficulty}. Novas tentativas: ${numAttempts}`);
}


function generateGameHTML(): string {
  console.log("Começou o jogo!");

  return `
  <div class="main">
    <div id="alert-box" class="alert-box hidden">
      <div class="modal-box">
        <h1>Aviso!</h1>
        <p id="alert-message">Lorem ipsum dolor, sit amet consectetur adipisicing elit. At odio in laboriosam, quia iste expedita repudiandae officiis reiciendis natus modi eaque quaerat porro, facere, doloremque adipisci! Distinctio quos eum sint.</p>
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
          <span class="score-info" id="game-difficulty">${difficulty}</span>
        </p>

        <p class="score-bar">
          <span class="score-title">Pontuação:</span>
          <span class="score-info" id="player-score">${score}</span>
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

        <div class="attempts-content">
        </div>

        <div class="boardgame-botton">
          <p>tentativas: </p>
          <span id="numAttempts">${formatNumAttempts(numAttempts + 1)}</span>
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
        <ul id="list-emojis">
        </ul>
      </div>
    </div>
  </div>
  `;
}
