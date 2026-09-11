// Run against the English landing page using a CUA tab's playwright handle.
export async function checkRashi(page) {
  const expected = ['Red coral', 'Diamond', 'Emerald', 'Pearl', 'Ruby', 'Emerald', 'Diamond', 'Red coral', 'Yellow sapphire', 'Blue sapphire', 'Blue sapphire', 'Yellow sapphire'];
  for (let i = 0; i < expected.length; i++) {
    await page.getByLabel('Choose your Rashi', { exact: true }).selectOption(String(i));
    if (await page.locator('#rashi h3').innerText() !== expected[i]) throw new Error(`Wrong gemstone for Rashi ${i}`);
  }
}
