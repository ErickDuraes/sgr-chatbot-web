module.exports = async function (context, req) {
    const pergunta = (req.body && req.body.pergunta) || '';
    if (!pergunta) {
      context.res = { status: 400, body: { resposta: 'Pergunta vazia.' } };
      return;
    }
  
    // Chame seu QnA Maker direto aqui:
    const endpoint = process.env.QNA_ENDPOINT + '/qnamaker/knowledgebases/' 
                     + process.env.QNA_KB_ID + '/generateAnswer';
    const key = process.env.QNA_KEY;
    const axios = require('axios');
  
    try {
      const resp = await axios.post(endpoint,
        { question: pergunta },
        { headers: { 'Authorization': 'EndpointKey ' + key, 'Content-Type': 'application/json' } }
      );
      const best = resp.data.answers?.[0]?.answer;
      context.res = { body: { resposta: best || 'Não encontrei resposta.' } };
    } catch (err) {
      context.res = { status: 500, body: { resposta: 'Erro ao consultar Q&A.' } };
    }
  };
  