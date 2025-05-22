const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Middleware de logging
app.use((req, res, next) => {
  console.log('\n=== Nova Requisição ===');
  console.log('Método:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Rota da API
app.post('/api/chat', async (req, res) => {
  console.log('\n=== Iniciando Processamento da Pergunta ===');
  const pergunta = req.body.pergunta;
  
  if (!pergunta) {
    console.log('❌ Erro: Pergunta vazia');
    return res.status(400).json({ resposta: 'Pergunta vazia.' });
  }

  console.log('✅ Pergunta recebida:', pergunta);

  try {
    // Verifica variáveis de ambiente
    console.log('\n=== Verificando Variáveis de Ambiente ===');
    const envVars = {
      QNA_ENDPOINT: process.env.QNA_ENDPOINT,
      QNA_KB_ID: process.env.QNA_KB_ID,
      QNA_KEY: process.env.QNA_KEY ? '***' : undefined
    };
    console.log('Variáveis de ambiente:', envVars);

    if (!envVars.QNA_ENDPOINT || !envVars.QNA_KB_ID || !envVars.QNA_KEY) {
      throw new Error('Variáveis de ambiente não configuradas corretamente');
    }

    // Monta o endpoint
    console.log('\n=== Montando Endpoint ===');
    const endpoint = `${process.env.QNA_ENDPOINT}/language/:query-knowledgebases` +
                    `?projectName=${process.env.QNA_KB_ID}` +
                    `&deploymentName=production` +
                    `&api-version=2021-10-01`;
    console.log('Endpoint montado:', endpoint);

    // Prepara a requisição
    console.log('\n=== Preparando Requisição para QnA ===');
    const requestConfig = {
      headers: {
        'Authorization': `EndpointKey ${process.env.QNA_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    console.log('Configuração da requisição:', {
      ...requestConfig,
      headers: {
        ...requestConfig.headers,
        'Authorization': '***'
      }
    });

    // Chama o serviço de Custom Q&A
    console.log('\n=== Enviando Requisição para QnA ===');
    console.log('Payload:', { question: pergunta });
    
    const resp = await axios.post(
      endpoint,
      { question: pergunta },
      requestConfig
    );

    console.log('\n=== Resposta Recebida do QnA ===');
    console.log('Status:', resp.status);
    console.log('Headers:', resp.headers);
    console.log('Dados:', resp.data);

    // Extrai a melhor resposta
    const best = resp.data.answers?.[0]?.answer;
    console.log('\n=== Processando Resposta ===');
    console.log('Melhor resposta encontrada:', best || 'Nenhuma resposta encontrada');

    res.json({ resposta: best || 'Não encontrei resposta.' });
    console.log('\n✅ Requisição processada com sucesso');

  } catch (err) {
    console.error('\n❌ ERRO DETALHADO:');
    console.error('Mensagem:', err.message);
    console.error('Stack:', err.stack);
    
    if (err.response) {
      console.error('\nDetalhes da Resposta de Erro:');
      console.error('Status:', err.response.status);
      console.error('Headers:', err.response.headers);
      console.error('Data:', err.response.data);
    }

    res.status(500).json({ 
      resposta: 'Erro ao consultar Q&A.',
      detalhes: err.message
    });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('\n❌ ERRO GLOBAL:');
  console.error(err);
  res.status(500).json({ 
    resposta: 'Erro interno do servidor',
    detalhes: err.message
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log('\n=== Servidor Iniciado ===');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('📝 Logs detalhados ativados');
  console.log('⚠️  Verifique se as variáveis de ambiente estão configuradas:');
  console.log('   - QNA_ENDPOINT');
  console.log('   - QNA_KB_ID');
  console.log('   - QNA_KEY');
}); 