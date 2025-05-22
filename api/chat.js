module.exports = async function (context, req) {
  const pergunta = (req.body && req.body.pergunta) || '';
  if (!pergunta) {
    context.res = { status: 400, body: { resposta: 'Pergunta vazia.' } };
    return;
  }

  // Monta o endpoint usando template literal e projectName em vez de KB GUID
  const endpoint = `${process.env.QNA_ENDPOINT}/language/:query-knowledgebases` +
                   `?projectName=${process.env.QNA_KB_ID}` +
                   `&deploymentName=production` +
                   `&api-version=2021-10-01`;
  const key = process.env.QNA_KEY;
  const axios = require('axios');

  try {
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
    context.res = {
      body: {
        resposta: best || 'Não encontrei resposta.'
      }
    };

  } catch (err) {
    console.error('Erro ao chamar Q&A:', err.message || err);
    context.res = {
      status: 500,
      body: { resposta: 'Erro ao consultar Q&A.' }
    };
  }
};
