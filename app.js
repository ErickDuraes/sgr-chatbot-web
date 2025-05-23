<<<<<<< HEAD
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
=======
// Configurações do QnA Maker
const QNA_CONFIG = {
    endpoint: 'https://sgr-chatbot.azurewebsites.net/qnamaker',
    key: 'YOUR-QNA-MAKER-KEY', // Substitua pela sua chave do QnA Maker
    knowledgeBaseId: 'YOUR-KNOWLEDGE-BASE-ID' // Substitua pelo ID da sua base de conhecimento
};

// Elementos do DOM
const chatContainer = document.querySelector('.chat-container');
const inputPergunta = document.getElementById('inputPergunta');
const inputResposta = document.getElementById('inputResposta');
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

// Função para copiar resposta
function copiarResposta() {
    const resposta = inputResposta.value;
    if (!resposta) return;

    navigator.clipboard.writeText(resposta).then(() => {
        const botao = document.querySelector('.button-group button');
        const textoOriginal = botao.innerHTML;
        
        botao.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Copiado!
        `;
        
        setTimeout(() => {
            botao.innerHTML = textoOriginal;
        }, 2000);
    }).catch(err => {
        mostrarErro(
            'Erro ao copiar',
            'Não foi possível copiar a resposta.',
            err.message
        );
    });
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
        const response = await fetch('https://sgr-chatbot.azurewebsites.net/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pergunta: pergunta })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        toggleTypingIndicator(false);
        
        if (data.answer) {
            // Atualiza o campo de resposta
            inputResposta.value = data.answer;
            
            // Adiciona a resposta ao chat
            adicionarMensagem(data.answer, 'assistant', data.confidence);
        } else {
            inputResposta.value = '';
            mostrarErro(
                'Resposta não encontrada',
                'Não foi possível encontrar uma resposta para sua pergunta.',
                'Por favor, tente reformular sua pergunta.'
            );
        }
    } catch (error) {
        toggleTypingIndicator(false);
        inputResposta.value = '';
        
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
        } else if (error.message.includes('405')) {
            mostrarErro(
                'Método não permitido',
                'O método de requisição não é permitido.',
                'Verifique se está usando o método POST corretamente.'
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
>>>>>>> origin/main
inputPergunta.focus(); 