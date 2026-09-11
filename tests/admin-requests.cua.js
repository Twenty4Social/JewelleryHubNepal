// Run with the admin page open in CUA. This check never accepts or resolves a request.
export async function checkRequestDetails(page) {
  const button = page.playwright.getByRole('button', { name: 'View request →', exact: true }).first();
  const before = await button.evaluate(element => element.closest('article').innerText);
  await button.click();
  const detail = page.playwright.getByRole('dialog');
  await detail.waitFor({ state: 'visible' });
  const name = await page.playwright.locator('#request-title').innerText();
  if (!before.includes(name)) throw new Error('Opened a different customer request');
  if (!await detail.getByRole('heading', { name: 'Customer’s enquiry', exact: true }).isVisible()) throw new Error('Full enquiry missing');
  if (!await detail.getByRole('button', { name: 'Close ×', exact: true }).isVisible()) throw new Error('Close control missing');
  await detail.getByRole('button', { name: 'Close ×', exact: true }).press('Escape');
  await detail.waitFor({ state: 'hidden' });
  const after = await button.evaluate(element => element.closest('article').innerText);
  if (before !== after) throw new Error('Opening a request changed its card');
  return 'PASS: correct request opens, full enquiry is visible, Escape closes without changing the request';
}
