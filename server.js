const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

// Configurações do QnA Maker
const QNA_CONFIG = {
    endpoint: process.env.QNA_ENDPOINT || 'https://sgr-chatbot.azurewebsites.net/qnamaker',
    key: process.env.QNA_KEY || 'YOUR-QNA-MAKER-KEY',
    knowledgeBaseId: process.env.QNA_KB_ID || 'YOUR-KNOWLEDGE-BASE-ID'
};

// Middleware para parsing de JSON
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota da API do chat
app.post('/api/chat', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Pergunta não fornecida' });
        }

        // Construir URL do QnA Maker
        const url = `${QNA_CONFIG.endpoint}/knowledgebases/${QNA_CONFIG.knowledgeBaseId}/generateAnswer`;

        // Fazer requisição para o QnA Maker
        const response = await axios.post(url, {
            question: question
        }, {
            headers: {
                'Authorization': `EndpointKey ${QNA_CONFIG.key}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar se há respostas
        if (response.data.answers && response.data.answers.length > 0) {
            const bestAnswer = response.data.answers[0];
            return res.json({
                answer: bestAnswer.answer,
                confidence: bestAnswer.score
            });
        }

        // Se não houver respostas
        return res.json({
            answer: 'Desculpe, não encontrei uma resposta para sua pergunta.'
        });

    } catch (error) {
        console.error('Erro ao processar pergunta:', error);
        res.status(500).json({
            error: 'Erro ao processar sua pergunta',
            details: error.message
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Configurações do QnA Maker:');
    console.log(`- Endpoint: ${QNA_CONFIG.endpoint}`);
    console.log(`- Knowledge Base ID: ${QNA_CONFIG.knowledgeBaseId}`);
    console.log(`- Key: ${QNA_CONFIG.key ? 'Configurada' : 'Não configurada'}`);
}); 