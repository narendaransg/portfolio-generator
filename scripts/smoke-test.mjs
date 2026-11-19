import assert from 'node:assert/strict';
import {
  SAMPLE_PORTFOLIO,
  THEME_CATALOG,
  buildCustomAiPrompt,
  buildPortfolioZip,
  generateSiteFiles,
  normalizePortfolioData,
  renderPortfolioHtml,
  validateCustomAiHtml,
} from '../packages/core/dist/index.js';

console.log('Running end-to-end smoke tests...');

// 1. Test backward-compatible JSON import migration
const legacyJson = {
  meta: { githubUsername: 'testuser' },
  identity: { fullName: 'Test User', headline: 'Engineer', location: 'Chennai' },
  about: { bio: 'Building systems.', lookingFor: '' },
  links: { email: 'test@example.com', github: 'https://github.com/testuser', linkedin: '' },
};
const migrated = normalizePortfolioData(legacyJson);
assert.equal(migrated.meta.repoName, 'testuser.github.io');
assert.ok(Array.isArray(migrated.achievements));
console.log('✓ Legacy portfolio.json migration passed');

// 2. Test all 5 built-in themes + accent color + font override + achievements
for (const theme of THEME_CATALOG.filter((t) => t.id !== 'custom-ai')) {
  const sample = structuredClone(SAMPLE_PORTFOLIO);
  sample.meta.theme = theme.id;
  sample.meta.accentColor = '#e11d48';
  sample.meta.fontChoice = 'mono';
  const html = renderPortfolioHtml(sample);
  assert.ok(html.includes('Alex Sharma'));
  assert.ok(html.includes('#e11d48'));
  assert.ok(html.includes('National RTL Design Hackathon Finalist'));
}
console.log('✓ All 5 themes + accent colors + achievements rendered cleanly');

// 3. Test BYO-AI prompt generation and HTML validator
const prompt = buildCustomAiPrompt(SAMPLE_PORTFOLIO);
assert.ok(prompt.includes('Alex Sharma'));
const validCheck = validateCustomAiHtml(
  `<!DOCTYPE html><html><body><h1>Alex Sharma</h1><a href="mailto:alex.sharma@example.com">Email</a><a href="https://github.com/alex-builder">GH</a></body></html>`,
  SAMPLE_PORTFOLIO
);
assert.equal(validCheck.valid, true);
const invalidCheck = validateCustomAiHtml('<div>incomplete</div>', SAMPLE_PORTFOLIO);
assert.equal(invalidCheck.valid, false);
console.log('✓ BYO-AI prompt builder & HTML validator passed');

// 4. Test bundled files, Gitingest URL, and ZIP archive header
const files = generateSiteFiles(SAMPLE_PORTFOLIO);
const expectedFiles = [
  'index.html',
  '.nojekyll',
  'portfolio.json',
  'DEPLOY_GUIDE.md',
  'LINKEDIN_SYNC.md',
  'AI_CUSTOMIZE_GUIDE.md',
];
for (const file of expectedFiles) {
  assert.ok(file in files, `Missing ${file} in generated bundle`);
}
assert.ok(files['AI_CUSTOMIZE_GUIDE.md'].includes('https://gitingest.com/alex-builder/alex-builder.github.io'));

const zipBytes = await buildPortfolioZip(SAMPLE_PORTFOLIO);
assert.ok(zipBytes instanceof Uint8Array && zipBytes.length > 500);
assert.equal(zipBytes[0], 0x50); // 'P'
assert.equal(zipBytes[1], 0x4b); // 'K'
console.log('✓ Bundled files, Gitingest guide, and ZIP archive verified');

console.log('\nAll end-to-end smoke tests passed!');
