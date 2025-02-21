"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const rulesButton = document.getElementById("rulesButton");
    const closeButton = document.getElementById("closeRules");
    const sectionContainer = document.querySelector(".section-container");
    const indexContainer = document.querySelector(".index");
    const footer = document.querySelector("footer");
    if (!rulesButton || !closeButton || !sectionContainer || !indexContainer || !footer) {
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
});
let pontuacao = [];
// Adiciona um ouvinte de clique para o botão
const btnNivel = document.querySelector(".nivel-button");
btnNivel.addEventListener("click", () => {
    startGame();
});
// Função para iniciar o jogo
function startGame() {
    const html = document.querySelector("html");
    if (html) {
        html.innerHTML = generateGameHTML();
        // criarParagrafo();
    }
}
// function embaralha array emojis
function getEmojis() {
    const emojis = [
        "❤️",
        "😭",
        "🔥",
        "💀",
        "😎",
        "😜",
        "⭐",
        "🐱",
        "☂️",
        "🎁",
        "🎲",
        "💡",
    ];
    return emojis.sort(() => Math.random() - 0.5).slice(0, 5);
}
function criarParagrafo() {
    const p = document.querySelector("#emojiSenha");
    if (p) {
        p.textContent = getEmojis().join(" "); // Adiciona os emojis dentro do <p>
    }
}
function generateGameHTML() {
    console.log("Começou o jogo!");
    return `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Descubra a Senha - Criptmojis</title>

  <!-- ESTILO CSS COMPILADO -->
  <link rel="stylesheet" href="./src/styles/game.css">
  <!-- ICON -->
  <script src="https://kit.fontawesome.com/ec3f8a7c11.js" crossorigin="anonymous"></script>
</head>

<body>
  <main>
    <header>
      <h1>Criptmojis</h1>
      <i class="fa-solid fa-arrow-rotate-right"></i>
    </header>

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
          <p>resultado</p>
        </div>

        <div class="attempts-content">
          <div class="line">
            <div class="square">❤️</div>
            <div class="square">😭</div>
            <div class="square">🔥</div>
            <div class="square">💀</div>
            <div class="square">😎</div>
            <div class="results">
              <span class="result-ball">🟡</span>
              <span class="result-ball">🟡</span>
              <span class="result-ball">⚪</span>
              <span class="result-ball">🟡</span>
              <span class="result-ball">🟢</span>
            </div>
          </div>
      </section>

      <section class="player-bet">
        <div class="bet-emojis">
          <span id="bet-1" class="bet-circle">😎</span>
          <span id="bet-2" class="bet-circle">💀</span>
          <span id="bet-3" class="bet-circle">🔥</span>
          <span id="bet-4" class="bet-circle">😭</span>
          <span id="bet-5" class="bet-circle">❤️</span>
        </div>
        <div class="bet-button">
          <i class="fa-solid fa-circle-right"></i>
        </div>
      </section>

      <section class="score-content">
        <p class="score-bar">
          <span class="score-title">Dificuldade:</span>
          <span class="score-info">Tranquilo</span>
        </p>

        <p class="score-bar">
          <span class="score-title">Pontos:</span>
          <span class="score-info">000</span>
        </p>

        <p class="score-bar">
          <span class="score-title">Tentativas:</span>
          <span class="score-info">00</span>
        </p>
      </section>
    </div>
    <footer>
      <div class="title">
        <p>selecione um emoji</p>
      </div>
      <div class="emojis-container">
        <ul>
          <li>❤️</li>
          <li>😭</li>
          <li>🔥</li>
          <li>💀</li>
          <li>😎</li>
          <li>😜</li>
          <li>⭐</li>
          <li>🐱</li>
          <li>☂️</li>
          <li>🎁</li>
          <li>🎲</li>
          <li>💡</li>
        </ul>
      </div>
    </footer>
  </main>

  <script src="dist/main.js" defer></script>
</body>
  `;
}
