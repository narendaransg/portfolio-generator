import JSZip from 'jszip';
import { PortfolioData } from './schema.js';
import { renderPortfolioHtml } from './themes.js';
import {
  generateAiCustomizeGuide,
  generateDeployGuide,
  generateLinkedInSyncGuide,
} from './docs-gen.js';

export interface GeneratedBundleFiles {
  'index.html': string;
  '.nojekyll': string;
  'portfolio.json': string;
  'DEPLOY_GUIDE.md': string;
  'LINKEDIN_SYNC.md': string;
  'AI_CUSTOMIZE_GUIDE.md': string;
}

export function generateSiteFiles(
  data: PortfolioData,
  customOverride?: { html?: string; css?: string }
): GeneratedBundleFiles {
  return {
    'index.html': renderPortfolioHtml(data, customOverride),
    '.nojekyll': '',
    'portfolio.json': JSON.stringify(data, null, 2),
    'DEPLOY_GUIDE.md': generateDeployGuide(data),
    'LINKEDIN_SYNC.md': generateLinkedInSyncGuide(data),
    'AI_CUSTOMIZE_GUIDE.md': generateAiCustomizeGuide(data),
  };
}

export async function buildPortfolioZip(
  data: PortfolioData,
  customOverride?: { html?: string; css?: string }
): Promise<Uint8Array> {
  const zip = new JSZip();
  const files = generateSiteFiles(data, customOverride);

  for (const [filename, content] of Object.entries(files)) {
    zip.file(filename, content);
  }

  return await zip.generateAsync({ type: 'uint8array' });
}
