async function perguntar() {
  const pergunta = document.getElementById('inputPergunta').value;
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta })
  });
  const data = await resp.json();
  document.getElementById('resposta').innerText = data.resposta;
}
