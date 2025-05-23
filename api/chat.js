const express = require('express');
const router = express.Router();
const axios = require('axios');

// Configurações do QnA Maker
const QNA_CONFIG = {
    endpoint: process.env.QNA_ENDPOINT,
    key: process.env.QNA_KEY,
    knowledgeBaseId: process.env.QNA_KB_ID
};

// Rota para processar perguntas
router.post('/chat', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Pergunta não fornecida' });
        }

        // Construir URL do QnA Maker
        const url = `${QNA_CONFIG.endpoint}/knowledgebases/${QNA_CONFIG.knowledgeBaseId}/generateAnswer`;

        // Fazer requisição para o QnA Maker
        const response = await axios.post(url, {
            question: question,
            top: 1
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
        
        if (error.response) {
            // Erro da API do QnA Maker
            return res.status(error.response.status).json({
                error: 'Erro ao processar sua pergunta',
                details: error.response.data
            });
        }
        
        res.status(500).json({
            error: 'Erro ao processar sua pergunta',
            details: error.message
        });
    }
});

module.exports = router; 