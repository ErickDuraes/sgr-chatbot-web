async function perguntar() {
  const pergunta = document.getElementById('inputPergunta').value;
  if (!pergunta.trim()) return;

  // Adiciona a pergunta do usuário
  const chatContainer = document.querySelector('.chat-container');
  const userMessage = document.createElement('div');
  userMessage.className = 'message user-message';
  userMessage.textContent = pergunta;
  chatContainer.appendChild(userMessage);

  // Limpa o input
  document.getElementById('inputPergunta').value = '';

  // Mostra o indicador de digitação
  const typingIndicator = document.getElementById('typingIndicator');
  typingIndicator.style.display = 'flex';

  try {
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta })
    });
    const data = await resp.json();

    // Esconde o indicador de digitação
    typingIndicator.style.display = 'none';

    // Adiciona a resposta do assistente
    const assistantMessage = document.createElement('div');
    assistantMessage.className = 'message assistant-message';
    assistantMessage.textContent = data.resposta;
    chatContainer.appendChild(assistantMessage);

    // Rola para a última mensagem
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error('Erro:', error);
    // Esconde o indicador de digitação
    typingIndicator.style.display = 'none';
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message assistant-message';
    errorMessage.textContent = 'Desculpe, ocorreu um erro ao processar sua pergunta.';
    chatContainer.appendChild(errorMessage);
  }
}

// Adiciona evento de Enter no input
document.getElementById('inputPergunta').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    perguntar();
  }
});

// Foca no input quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('inputPergunta').focus();
});
