// app.js

document.getElementById('btnEnviar').addEventListener('click', async () => {
    const pergunta = document.getElementById('inputPergunta').value.trim();
    if (!pergunta) {
      alert('Digite uma pergunta antes de enviar!');
      return;
    }
  
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta })
      });
      const data = await resp.json();
      const resposta = data.resposta || 'Não encontrei resposta.';
      document.getElementById('resposta').innerText = resposta;
    } catch (err) {
      console.error('Erro na API:', err);
      document.getElementById('resposta').innerText =
        'Erro ao buscar resposta. Tente novamente mais tarde.';
    }
  });
  