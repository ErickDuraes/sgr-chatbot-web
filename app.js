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
    console.log('Enviando requisição para a API:', {
      url: '/api/chat',
      method: 'POST',
      body: { pergunta }
    });

    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta })
    });

    console.log('Status da resposta:', resp.status);
    console.log('Headers da resposta:', Object.fromEntries(resp.headers.entries()));

    const data = await resp.json();
    console.log('Dados recebidos da API:', data);

    // Esconde o indicador de digitação
    typingIndicator.style.display = 'none';

    // Adiciona a resposta do assistente
    const assistantMessage = document.createElement('div');
    assistantMessage.className = 'message assistant-message';
    
    // Verifica se há erro na resposta
    if (data.error) {
      assistantMessage.innerHTML = `
        <div style="color: var(--error-color); margin-bottom: 8px;">
          <strong>Erro na API:</strong> ${data.error}
        </div>
        <div style="font-size: 0.9em; color: var(--text-secondary);">
          Status: ${resp.status}<br>
          Detalhes: ${data.details || 'Nenhum detalhe adicional'}
        </div>
      `;
    } else {
      assistantMessage.textContent = data.resposta;
    }
    
    chatContainer.appendChild(assistantMessage);

    // Rola para a última mensagem
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Esconde o indicador de digitação
    typingIndicator.style.display = 'none';
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message assistant-message';
    errorMessage.innerHTML = `
      <div style="color: var(--error-color); margin-bottom: 8px;">
        <strong>Erro ao processar a requisição:</strong>
      </div>
      <div style="font-size: 0.9em; color: var(--text-secondary);">
        ${error.message}<br>
        <small>Verifique o console para mais detalhes</small>
      </div>
    `;
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
  
  // Adiciona mensagem inicial de debug
  console.log('Chat inicializado. Status da API:', {
    endpoint: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
});
