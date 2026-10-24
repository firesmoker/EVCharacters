import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto(process.env.EV_TEST_URL || 'http://127.0.0.1:5174/');
  await page.evaluate(async () => {
    const m = await import('/src/character-creation.js');
    const { initCreationWizard } = await import('/src/creation-wizard.js');
    window.openSkillTest = initCreationWizard(() => {});
    window.skillState = { ...m.newCharacter(), level: 3, subclass: 'Tale Weaver' };
    window.openSkillTest({ headers: {}, creation: window.skillState });
    for (const [className, subclass, skill] of [['Bard','Tale Weaver','History'], ['Rogue','Assassin','Disguise'], ['Rogue','Fae Trickster','Deception'], ['Alchemist','Toymaker','Mechanics'], ['Bard','Muse','Charm']]) {
      for (const dice of [4,5]) {
        const choices = { [dice === 4 ? 'origin' : 'legacy-expert']: [skill], ...(subclass === 'Muse' ? { 'muse-skill': [skill] } : {}) };
        const state = { ...m.newCharacter(), className, subclass, level:3, choices };
        const plan = m.skillPlan(state);
        if (plan.fixed[skill] !== 5 || !plan.groups.some(g => g.id === 'subclass-replacement') || plan.groups.some(g => g.id === 'subclass-extra') !== (dice === 5)) throw Error(`${subclass}: incorrect replacement choices for ${dice}d6`);
      }
    }
  });
  const dialog = page.locator('.creation-wizard[open]');
  await dialog.locator('[data-step="3"]').click();
  const select = key => dialog.locator(`[data-key="skill:${key}:0"]`);
  assert.equal(await select('origin').locator('option[value="History"]').evaluate(el => el.disabled), false);
  await select('origin').selectOption('History');
  assert.equal(await select('subclass-replacement').count(), 1);
  assert.equal(await select('subclass-extra').count(), 0);
  assert.equal(await select('origin').locator('option[value="Performance"]').evaluate(el => el.disabled), true);
  assert.equal(await select('legacy-adept').locator('option[value="History"]').evaluate(el => el.disabled), true);
  await select('origin').selectOption('Insight');
  assert.equal(await select('subclass-replacement').count(), 0);
  await select('legacy-expert').selectOption('History');
  assert.equal(await select('subclass-replacement').count(), 1);
  assert.equal(await select('subclass-extra').count(), 1);
  await select('subclass-replacement').selectOption('Arcana');
  assert.equal(await select('subclass-extra').locator('option[value="Arcana"]').evaluate(el => el.disabled), true);
  assert.equal(await select('origin').locator('option[value="Arcana"]').evaluate(el => el.disabled), true);
  await dialog.locator('[data-close]').click();
  await page.evaluate(() => window.openSkillTest({ headers: {}, creation: { ...window.skillState, subclass:'Muse', choices:{ 'legacy-expert':['Charm'] } } }));
  await dialog.locator('[data-step="3"]').click();
  assert.equal(await select('muse-skill').locator('option[value="Charm"]').evaluate(el => el.disabled), false);
  await select('muse-skill').selectOption('Charm');
  assert.equal(await select('subclass-replacement').count(), 1);
  assert.equal(await select('subclass-extra').count(), 1);
  console.log('Subclass skill compensation: Adept/Expert grants, live dropdown choices, and duplicate prevention passed.');
} finally { await browser.close(); }
