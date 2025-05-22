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

    // Esconde o indicador de digitação
    typingIndicator.style.display = 'none';

    // Verifica se a resposta está ok
    if (!resp.ok) {
      throw new Error(`Erro na API: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();

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
    // Esconde o indicador de digitação
    typingIndicator.style.display = 'none';
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message assistant-message';
    
    // Determina o tipo de erro e mostra uma mensagem amigável
    let errorDetails = '';
    if (error.message.includes('Failed to fetch')) {
      errorDetails = `
        <div style="color: var(--error-color); margin-bottom: 8px;">
          <strong>Erro de Conexão:</strong> Não foi possível conectar ao servidor
        </div>
        <div style="font-size: 0.9em; color: var(--text-secondary);">
          Possíveis causas:
          <ul style="margin-top: 8px; padding-left: 20px;">
            <li>O servidor não está rodando</li>
            <li>Problemas de conexão com a internet</li>
            <li>O servidor está demorando para responder</li>
          </ul>
        </div>
      `;
    } else if (error.message.includes('405')) {
      errorDetails = `
        <div style="color: var(--error-color); margin-bottom: 8px;">
          <strong>Erro de Método:</strong> Método não permitido
        </div>
        <div style="font-size: 0.9em; color: var(--text-secondary);">
          O servidor não está configurado para aceitar requisições POST.
          <br><br>
          Solução: Verifique se o servidor está rodando com o comando:
          <pre style="background: var(--background-dark); padding: 8px; border-radius: 4px; margin-top: 8px;">
npm run dev</pre>
        </div>
      `;
    } else if (error.message.includes('404')) {
      errorDetails = `
        <div style="color: var(--error-color); margin-bottom: 8px;">
          <strong>Erro de Rota:</strong> Endpoint não encontrado
        </div>
        <div style="font-size: 0.9em; color: var(--text-secondary);">
          A rota /api/chat não foi encontrada no servidor.
          <br><br>
          Solução: Verifique se o arquivo server.js está configurado corretamente.
        </div>
      `;
    } else if (error.message.includes('500')) {
      errorDetails = `
        <div style="color: var(--error-color); margin-bottom: 8px;">
          <strong>Erro no Servidor:</strong> Erro interno
        </div>
        <div style="font-size: 0.9em; color: var(--text-secondary);">
          Ocorreu um erro no processamento da sua pergunta.
          <br><br>
          Detalhes: ${error.message}
        </div>
      `;
    } else {
      errorDetails = `
        <div style="color: var(--error-color); margin-bottom: 8px;">
          <strong>Erro:</strong> ${error.message}
        </div>
        <div style="font-size: 0.9em; color: var(--text-secondary);">
          Ocorreu um erro ao processar sua pergunta.
          <br><br>
          Por favor, tente novamente mais tarde.
        </div>
      `;
    }

    errorMessage.innerHTML = errorDetails;
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
