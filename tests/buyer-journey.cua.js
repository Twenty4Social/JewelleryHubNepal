// Paste into CUA with the local app open, then await checkBuyerJourney(qaTab).
// Only navigates and inspects the demo; it never submits an enquiry.
async function checkBuyerJourney(page) {
  const check = (ok, message) => { if (!ok) throw new Error(message); };
  const snapshot = () => page.playwright.domSnapshot();
  if (await page.playwright.getByText('Menu', { exact: true }).isVisible()) await page.playwright.getByText('Menu', { exact: true }).click();
  await page.playwright.getByRole('button', { name: 'English', exact: true }).click();
  if (await page.playwright.getByText('Close', { exact: true }).isVisible()) await page.playwright.locator('header summary').press('Escape');
  await page.playwright.getByRole('link', { name: 'Jewellery Hub Nepāl', exact: true }).click();
  await snapshot();
  check(await page.playwright.locator('#shop-results > a').count() === 3, 'Three featured shops');
  check(await page.playwright.locator('#catalogue-results > a').count() === 3, 'Three featured pieces');
  check(await page.playwright.getByRole('combobox').count() === 0, 'No homepage category controls');
  await page.playwright.getByRole('link', { name: 'View all 5 shops', exact: false }).click();
  await snapshot();
  check(await page.playwright.locator('#shop-results > a').count() === 5, 'Five shop profiles');
  await page.playwright.locator('#shop-results').getByRole('link', { name: /Aabhushan Crafts/ }).click();
  await snapshot();
  check(await page.playwright.getByRole('heading', { name: 'Aabhushan Crafts', exact: true }).isVisible(), 'Dedicated shop page');
  await page.playwright.getByRole('button', { name: 'View more designs', exact: false }).click();
  await snapshot();
  check(await page.playwright.locator('#catalogue-results > a').count() === 11, 'Eleven assigned designs');
  await page.playwright.locator('#catalogue-results').getByRole('link', { name: /Medallion Beaded Choker/ }).click();
  await snapshot();
  check(await page.playwright.getByRole('heading', { name: 'Medallion Beaded Choker', exact: true }).isVisible(), 'Dedicated product page');
  check((await page.playwright.getByRole('link', { name: 'Ask this shop on WhatsApp', exact: false }).getAttribute('href')).startsWith('https://wa.me/9779800000005?'), 'Correct shop enquiry URL');
  if (await page.playwright.getByText('Menu', { exact: true }).isVisible()) await page.playwright.getByText('Menu', { exact: true }).click();
  await page.playwright.locator('header').getByRole('link', { name: 'Jewellery', exact: true }).filter({ visible: true }).click();
  await snapshot();
  await page.playwright.getByRole('combobox', { name: 'Jewellery type', exact: true }).selectOption({ label: 'Rings' });
  await snapshot();
  check(await page.playwright.locator('#catalogue-results > a').count() === 3, 'Three photographed rings');
  if (await page.playwright.getByText('Menu', { exact: true }).isVisible()) await page.playwright.getByText('Menu', { exact: true }).click();
  await page.playwright.getByRole('button', { name: 'नेपाली', exact: true }).click();
  await snapshot();
  check(await page.playwright.locator('html').getAttribute('lang') === 'ne', 'Nepali persists across pages');
  if (await page.playwright.getByText('Menu', { exact: true }).isVisible()) await page.playwright.getByText('Menu', { exact: true }).click();
  await page.playwright.getByRole('button', { name: 'English', exact: true }).click();
  if (await page.playwright.getByText('Close', { exact: true }).isVisible()) await page.playwright.locator('header summary').press('Escape');
  if (await page.playwright.getByText('Menu', { exact: true }).isVisible()) await page.playwright.getByText('Menu', { exact: true }).click();
  await page.playwright.locator('header').getByRole('link', { name: 'Know your jewellery', exact: true }).filter({ visible: true }).click();
  await snapshot();
  check(await page.playwright.getByRole('textbox', { name: 'Your name (required)', exact: true }).isVisible(), 'Dedicated clinic form is open');
  check(await page.playwright.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'No horizontal overflow');
  return 'PASS: homepage previews, five shops, eleven images per shop, product enquiry, filters, Nepali and dedicated clinic';
}

export { checkBuyerJourney };

// Regression check for the demo's shared header and route transitions.
async function checkNavigationPolish(page) {
  const check = (ok, message) => { if (!ok) throw new Error(message); };
  const navigate = async (link, heading) => {
    if (await page.playwright.getByText('Menu', { exact: true }).isVisible()) await page.playwright.getByText('Menu', { exact: true }).click();
    await page.playwright.locator('header').getByRole('link', { name: link, exact: true }).filter({ visible: true }).click();
    await page.playwright.getByRole('heading', { name: heading, exact: true }).waitFor({ state: 'visible' });
    await page.playwright.domSnapshot();
    const state = await page.playwright.evaluate(() => ({
      height: document.querySelector('header').getBoundingClientRect().height,
      scroll: window.scrollY,
      transition: getComputedStyle(document.querySelector('main')).animationName,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      homeLinks: [...document.querySelectorAll('main a')].filter(a => a.textContent.trim() === '← Home').length,
    }));
    check(state.height > 200 && state.scroll === 0, `${link}: full header at page start`);
    check(state.transition === 'page-arrive', `${link}: page arrival animation`);
    check(!state.overflow && !state.homeLinks, `${link}: no overflow or redundant Home link`);
  };
  await navigate('Shops', 'Shops');
  await navigate('Jewellery', 'Explore jewellery');
  await navigate('Know your jewellery', 'Know your jewellery');
  check(await page.playwright.getByRole('textbox', { name: 'Your name (required)', exact: true }).isVisible(), 'Clinic form visible');
  await navigate('For jewellers', 'Your craft. Your customers.');
  check(await page.playwright.getByRole('link', { name: 'Open the jeweller demo desk', exact: false }).getAttribute('href') === '/admin/aabhushan', 'Owner demo desk accessible');
  return 'PASS: large shared header, page transitions, mobile navigation, simplified clinic and owner demo';
}
export { checkNavigationPolish };
