// Objeto que armazena o estado global do jogo.
// Todas as propriedades podem ser alteradas durante a execução.
export const gameState = {
    // Lista de emojis disponíveis para o jogo.
    emojis: [
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
    ],
    // Pontuação do jogador.
    score: 0,
    // Número de tentativas restantes.
    numAttempts: 0,
    // Nível de dificuldade atual (ex: "Tranquilo", "Moderado", "Insano").
    difficulty: "",
    // Código secreto gerado aleatoriamente.
    secretCode: [],
    // Emojis selecionados pelo jogador, inicialmente vazios.
    selectedEmojis: [null, null, null, null, null]
};
