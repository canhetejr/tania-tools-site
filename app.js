(() => {
  const webhookUrl = 'https://canhete.com/tania/n8n/webhook/tania-lead-v2';
  const form = document.getElementById('lead-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  const setFeedback = (msg, type) => {
    feedback.textContent = msg;
    feedback.classList.remove('success', 'error');
    if (type) feedback.classList.add(type);
  };

  const validate = () => {
    let ok = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach((el) => {
      el.classList.remove('invalid');
      if (!el.checkValidity()) {
        el.classList.add('invalid');
        ok = false;
      }
    });
    return ok;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFeedback('');

    if (!validate()) {
      setFeedback('Revise os campos obrigatórios antes de enviar.', 'error');
      return;
    }

    const payload = {
      nome: form.nome.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      email: form.email.value.trim(),
      empresa: form.empresa.value.trim(),
      interesse: form.interesse.value,
      mensagem: form.mensagem.value.trim(),
      origem: 'site-tania-tools-ia',
      pagina: window.location.href,
      timestamp: new Date().toISOString(),
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const prev = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Falha HTTP ${res.status}`);

      setFeedback('Recebido! Sua mensagem foi enviada com sucesso.', 'success');
      form.reset();
      form.interesse.value = 'Conversor de questões';
    } catch (err) {
      setFeedback('Não foi possível enviar agora. Tente novamente em instantes.', 'error');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = prev;
    }
  });
})();
