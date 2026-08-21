import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'j90_escrita_v6_teste';

async function fillValidLead(page) {
  await page.getByLabel('Seu primeiro nome').fill('Autor Teste');
  await page.getByLabel('Seu e-mail').fill('autor.teste@example.com');
  await page.getByLabel('Seu WhatsApp').fill('47999999999');
  await page.locator('#lead-consent').check();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload();
});

test('carrega a tela inicial da Jornada', async ({ page }) => {
  await expect(page).toHaveTitle(/Jornada dos 90 Dias/);
  await expect(page.locator('#screen-lead')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Seu livro não precisa continuar parado.' })).toBeVisible();
  await expect(page.locator('#start-btn')).toBeVisible();
});

test('bloqueia início quando os dados do lead são inválidos', async ({ page }) => {
  let dialogMessage = '';
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });

  await page.locator('#start-btn').click();

  await expect(page.locator('#screen-lead')).toBeVisible();
  expect(dialogMessage).toContain('Confira nome, e-mail, WhatsApp e consentimento');
});

test('aceita lead válido e abre a primeira pergunta', async ({ page }) => {
  await fillValidLead(page);
  await page.locator('#start-btn').click();

  await expect(page.locator('#screen-question')).toBeVisible();
  await expect(page.locator('#counter')).toHaveText(/Pergunta 1 de \d+/);
  await expect(page.locator('#question-title')).toHaveText('Em que momento seu livro está hoje?');
});

test('mantém o progresso do questionário após recarregar', async ({ page }) => {
  await fillValidLead(page);
  await page.locator('#start-btn').click();

  await page.locator('input[name="q1"][value="INICIO"]').check();
  await page.locator('#next-btn').click();
  await expect(page.locator('#counter')).toHaveText(/Pergunta 2 de \d+/);

  await page.reload();

  await expect(page.locator('#screen-question')).toBeVisible();
  await expect(page.locator('#counter')).toHaveText(/Pergunta 2 de \d+/);
  await expect(page.locator('#question-title')).toHaveText('O que você está escrevendo?');
});

test('checkout registra estado e exibe espera sem sair da Jornada', async ({ page }) => {
  const seededState = {
    lead: {
      name: 'Autor Teste',
      email: 'autor.teste@example.com',
      whatsapp: '(47) 99999-9999',
      consent: true,
    },
    answers: {
      q1: 'INICIO',
      q2: 'FICCAO',
      q3: 'FANTASIA',
      q4: 'MARCOS',
      q5: 'APROXIMADO',
      q6: 'NAO',
      q7: '4',
      q8: '40_60',
      q9: 'ESTAVEL',
      q10: 'NOITE',
      q11: ['TEMPO'],
      q12: 'RETOMA',
      q13: 'DEPOIS',
      q14: 'DESAFIADOR',
      q15: 'CONCLUSAO',
      q16: 'REORGANIZAR',
      q17: 'NAO',
    },
    currentIndex: 16,
    completed: true,
  };

  await page.addInitScript(() => {
    window.open = () => ({ closed: false });
  });
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: seededState }
  );
  await page.reload();

  await expect(page.locator('#screen-result')).toBeVisible();
  await page.locator('#journey-btn').click();
  await expect(page.locator('#screen-sales')).toBeVisible();

  await page.locator('#checkout-btn').click();

  await expect(page.locator('#payment-waiting-box')).toBeVisible();
  await expect(page.locator('#checkout-btn')).toHaveText('ABRIR MERCADO PAGO NOVAMENTE');
  await expect(page.locator('#screen-sales')).toBeVisible();

  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(stored.checkout_started).toBe(true);
  expect(stored.checkout_mode).toBe('TESTE_001_NOVA_GUIA');
});
