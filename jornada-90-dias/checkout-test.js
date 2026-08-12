(() => {
  const TEST_URL = 'https://mpago.la/1NYZCwd';

  function showWaitingState() {
    const box = document.getElementById('payment-waiting-box');
    if (box) box.hidden = false;

    const button = document.getElementById('checkout-btn');
    if (button) button.textContent = 'ABRIR MERCADO PAGO NOVAMENTE';
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest && event.target.closest('#checkout-btn');
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    try {
      state.checkout_started = true;
      state.checkout_mode = 'TESTE_001_NOVA_GUIA';
      state.checkout_commercial_url = 'https://mpago.la/1fjYJpX';
      state.checkout_started_at = new Date().toISOString();
      save();
    } catch (e) {
      console.warn('Não foi possível registrar o início do checkout localmente.', e);
    }

    const checkoutWindow = window.open(TEST_URL, '_blank', 'noopener,noreferrer');
    if (!checkoutWindow) {
      alert('Seu navegador bloqueou a nova guia. Permita pop-ups para esta página e tente novamente.');
      return;
    }

    showWaitingState();
  }, true);

  window.addEventListener('focus', () => {
    try {
      if (state && state.checkout_started) showWaitingState();
    } catch (e) {}
  });
})();
