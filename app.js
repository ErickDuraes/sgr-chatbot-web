// Configurações do QnA Maker
const QNA_CONFIG = {
    endpoint: process.env.QNA_ENDPOINT,
    key: process.env.QNA_KEY,
    knowledgeBaseId: process.env.QNA_KB_ID
};

// Elementos do DOM
const chatContainer = document.querySelector('.chat-container');
const inputPergunta = document.getElementById('inputPergunta');
const typingIndicator = document.getElementById('typingIndicator');

// Função para adicionar mensagem ao chat
function adicionarMensagem(texto, tipo, confianca = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}-message`;
    
    let html = texto;
    if (confianca !== null) {
        html += `<div class="confidence-badge">Confiança: ${(confianca * 100).toFixed(1)}%</div>`;
    }
    
    messageDiv.innerHTML = html;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Função para mostrar/ocultar indicador de digitação
function toggleTypingIndicator(mostrar) {
    typingIndicator.style.display = mostrar ? 'block' : 'none';
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Função para mostrar erro no chat
function mostrarErro(titulo, mensagem, detalhes = null) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message assistant-message error-message';
    
    let html = `<h3>${titulo}</h3>`;
    html += `<p>${mensagem}</p>`;
    
    if (detalhes) {
        html += `<pre>${detalhes}</pre>`;
    }
    
    errorDiv.innerHTML = html;
    chatContainer.appendChild(errorDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Função principal para fazer perguntas
async function perguntar() {
    const pergunta = inputPergunta.value.trim();
    if (!pergunta) return;

    // Limpa o input e adiciona a pergunta ao chat
    inputPergunta.value = '';
    adicionarMensagem(pergunta, 'user');
    toggleTypingIndicator(true);

    try {
        const response = await fetch(`${QNA_CONFIG.endpoint}/knowledgebases/${QNA_CONFIG.knowledgeBaseId}/generateAnswer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `EndpointKey ${QNA_CONFIG.key}`
            },
            body: JSON.stringify({
                question: pergunta,
                top: 1
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        toggleTypingIndicator(false);
        
        if (data.answers && data.answers.length > 0) {
            const answer = data.answers[0];
            // Adiciona a resposta ao chat
            adicionarMensagem(answer.answer, 'assistant', answer.score);
        } else {
            mostrarErro(
                'Resposta não encontrada',
                'Não foi possível encontrar uma resposta para sua pergunta.',
                'Por favor, tente reformular sua pergunta.'
            );
        }
    } catch (error) {
        toggleTypingIndicator(false);
        
        if (error.message.includes('Failed to fetch')) {
            mostrarErro(
                'Erro de Conexão',
                'Não foi possível conectar ao servidor.',
                'Verifique se o servidor está rodando e tente novamente.'
            );
        } else if (error.message.includes('404')) {
            mostrarErro(
                'Rota não encontrada',
                'A rota da API não foi encontrada.',
                'Verifique se o servidor está configurado corretamente.'
            );
        } else if (error.message.includes('401')) {
            mostrarErro(
                'Erro de Autenticação',
                'Chave de API inválida ou não autorizada.',
                'Verifique se a chave de API está correta.'
            );
        } else {
            mostrarErro(
                'Erro',
                'Ocorreu um erro ao processar sua pergunta.',
                error.message
            );
        }
    }
}

// Evento de tecla para enviar com Enter
inputPergunta.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        perguntar();
    }
});

// Foca no input quando a página carrega
inputPergunta.focus(); 