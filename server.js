const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rota da API
app.post('/api/chat', async (req, res) => {
  const pergunta = req.body.pergunta;
  if (!pergunta) {
    return res.status(400).json({ resposta: 'Pergunta vazia.' });
  }

  try {
    // Monta o endpoint usando template literal e projectName em vez de KB GUID
    const endpoint = `${process.env.QNA_ENDPOINT}/language/:query-knowledgebases` +
                    `?projectName=${process.env.QNA_KB_ID}` +
                    `&deploymentName=production` +
                    `&api-version=2021-10-01`;
    const key = process.env.QNA_KEY;

    // Chama o serviço de Custom Q&A
    const resp = await axios.post(
      endpoint,
      { question: pergunta },
      {
        headers: {
          'Authorization': `EndpointKey ${key}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extrai a melhor resposta
    const best = resp.data.answers?.[0]?.answer;
    res.json({ resposta: best || 'Não encontrei resposta.' });

  } catch (err) {
    console.error('Erro ao chamar Q&A:', err.message || err);
    res.status(500).json({ resposta: 'Erro ao consultar Q&A.' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 