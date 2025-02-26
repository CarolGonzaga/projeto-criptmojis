//Exibe um alerta na tela com uma mensagem.
export function showAlert(message) {
    // Seleciona os elementos do alerta no DOM.
    const alertBox = document.querySelector("#alert-box");
    const alertMessage = document.querySelector("#alert-message");
    const alertBtn = document.querySelector("#close-btn");
    // Verifica se os elementos foram encontrados.
    if (!alertBox || !alertMessage) {
        console.error("Erro: Elementos do alerta não encontrados!");
        return;
    }
    // Define a mensagem e exibe o alerta.
    alertMessage.textContent = message;
    alertBox.classList.remove("hidden");
    // Configura o botão de fechar o alerta.
    alertBtn.addEventListener("click", () => {
        alertBox.classList.add("hidden");
    });
}
