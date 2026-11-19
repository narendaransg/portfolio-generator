import { FontChoice, PortfolioData, ThemeId } from './schema.js';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  bestFor: string;
}

export const THEME_CATALOG: ThemeMeta[] = [
  {
    id: 'minimalist',
    name: 'Minimalist Clean',
    tagline: 'Crisp single-column layout with generous whitespace and clear hierarchy.',
    bestFor: 'Students, analysts, and anyone who wants a distraction-free, fast-reading portfolio.',
  },
  {
    id: 'bento',
    name: 'Bento Card Grid',
    tagline: 'Modern modular cards highlighting projects, skills, and education side-by-side.',
    bestFor: 'Builders and creators who want visitors to scan everything in 15 seconds.',
  },
  {
    id: 'terminal',
    name: 'Terminal / Developer',
    tagline: 'Dark-mode engineering aesthetic with monospace accents and command-line sections.',
    bestFor: 'Software, hardware, embedded, and Linux/systems engineers.',
  },
  {
    id: 'editorial',
    name: 'Editorial / Storyteller',
    tagline: 'Warm serif headings and narrative flow designed around your story and writing.',
    bestFor: 'Researchers, designers, writers, and product thinkers.',
  },
  {
    id: 'split-pane',
    name: 'Split-Pane Sidebar',
    tagline: 'Sticky profile card on the left with scrollable work, projects, and education on the right.',
    bestFor: 'Balanced resumes where contact details and links stay visible while scrolling.',
  },
  {
    id: 'custom-ai',
    name: 'Custom AI Template (BYO-AI)',
    tagline: 'Generate a prompt with your data, design custom HTML/CSS in ChatGPT/Claude/Gemini, and drop it back in.',
    bestFor: 'Users who want a one-of-a-kind visual look crafted with their favorite AI.',
  },
];

function esc(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHexColor(color: string | undefined): string | null {
  if (!color) return null;
  const trimmed = color.trim();
  return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed : null;
}

function getFontOverrideCss(choice: FontChoice | undefined): string {
  switch (choice) {
    case 'sans':
      return `body, h1, h2, h3 { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif !important; }`;
    case 'serif':
      return `body { font-family: Georgia, 'Times New Roman', serif !important; } h1, h2, h3 { font-family: Georgia, 'Times New Roman', serif !important; }`;
    case 'mono':
      return `body, h1, h2, h3 { font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace !important; }`;
    default:
      return '';
  }
}

function getThemeCss(theme: ThemeId, customAccent: string | null): string {
  const accentOverride = customAccent ? `:root { --accent: ${customAccent} !important; }` : '';
  switch (theme) {
    case 'terminal':
      return `
        :root { --bg: #0b0f14; --surface: #131a22; --text: #e6edf3; --muted: #8b949e; --accent: #3fb950; --border: #26303c; --font: 'JetBrains Mono', 'Fira Code', monospace; --heading-font: 'JetBrains Mono', monospace; }
        ${accentOverride}
        body { background: var(--bg); color: var(--text); font-family: var(--font); }
        .card { border: 1px solid var(--border); background: var(--surface); border-radius: 6px; padding: 1.25rem; }
        h2::before { content: "$ "; color: var(--accent); }
      `;
    case 'bento':
      return `
        :root { --bg: #f4f6f9; --surface: #ffffff; --text: #111827; --muted: #4b5563; --accent: #2563eb; --border: #e5e7eb; --font: system-ui, -apple-system, sans-serif; --heading-font: system-ui, -apple-system, sans-serif; }
        ${accentOverride}
        body { background: var(--bg); color: var(--text); font-family: var(--font); }
        .grid-bento { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
      `;
    case 'editorial':
      return `
        :root { --bg: #faf8f5; --surface: #ffffff; --text: #1c1917; --muted: #57534e; --accent: #9a3412; --border: #e7e5e4; --font: system-ui, -apple-system, sans-serif; --heading-font: Georgia, 'Times New Roman', serif; }
        ${accentOverride}
        body { background: var(--bg); color: var(--text); font-family: var(--font); }
        h1, h2, h3 { font-family: var(--heading-font); }
        .card { border-left: 3px solid var(--accent); padding: 0.75rem 0 0.75rem 1.25rem; margin-bottom: 1.25rem; }
      `;
    case 'split-pane':
      return `
        :root { --bg: #ffffff; --surface: #f8fafc; --text: #0f172a; --muted: #475569; --accent: #0f766e; --border: #e2e8f0; --font: system-ui, -apple-system, sans-serif; --heading-font: system-ui, -apple-system, sans-serif; }
        ${accentOverride}
        body { background: var(--bg); color: var(--text); font-family: var(--font); }
        .layout-split { display: grid; grid-template-columns: 300px 1fr; gap: 2.5rem; align-items: start; }
        .sidebar { position: sticky; top: 2rem; background: var(--surface); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border); }
        .card { border-bottom: 1px solid var(--border); padding: 1.25rem 0; }
        @media (max-width: 800px) { .layout-split { grid-template-columns: 1fr; } .sidebar { position: static; } }
      `;
    case 'minimalist':
    default:
      return `
        :root { --bg: #ffffff; --surface: #fafafa; --text: #18181b; --muted: #52525b; --accent: #18181b; --border: #e4e4e7; --font: system-ui, -apple-system, sans-serif; --heading-font: system-ui, -apple-system, sans-serif; }
        ${accentOverride}
        body { background: var(--bg); color: var(--text); font-family: var(--font); }
        .card { border-bottom: 1px solid var(--border); padding: 1.25rem 0; }
      `;
  }
}

export function renderPortfolioHtml(
  data: PortfolioData,
  customOverride?: { html?: string; css?: string }
): string {
  if (data.meta.theme === 'custom-ai' && customOverride?.html) {
    return customOverride.html;
  }

  const customAccent = sanitizeHexColor(data.meta.accentColor);
  const themeCss = customOverride?.css || getThemeCss(data.meta.theme, customAccent);
  const fontCss = getFontOverrideCss(data.meta.fontChoice);
  const isSplit = data.meta.theme === 'split-pane';
  const isBento = data.meta.theme === 'bento';

  const navLinks = [
    `<a href="mailto:${esc(data.links.email)}">Email</a>`,
    data.links.github ? `<a href="${esc(data.links.github)}" target="_blank" rel="noopener">GitHub</a>` : '',
    data.links.linkedin ? `<a href="${esc(data.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : '',
    data.links.website ? `<a href="${esc(data.links.website)}" target="_blank" rel="noopener">Website</a>` : '',
    data.links.resumeUrl ? `<a href="${esc(data.links.resumeUrl)}" target="_blank" rel="noopener">Resume</a>` : '',
  ]
    .filter(Boolean)
    .join(' &middot; ');

  const headerBlock = `
    <header class="${isSplit ? 'sidebar' : 'hero'}">
      ${data.identity.avatarUrl ? `<img src="${esc(data.identity.avatarUrl)}" alt="${esc(data.identity.fullName)}" class="avatar" />` : ''}
      <h1>${esc(data.identity.fullName)}</h1>
      <p class="headline">${esc(data.identity.headline)}</p>
      <p class="muted">${esc(data.identity.location)}</p>
      <nav class="links">${navLinks}</nav>
    </header>
  `;

  const projectsHtml =
    data.sectionsEnabled.projects && data.projects.length
      ? `<section id="projects">
          <h2>Projects</h2>
          <div class="${isBento ? 'grid-bento' : 'stack'}">
            ${data.projects
              .map(
                (p) => `
              <article class="card">
                <h3>${esc(p.title)}</h3>
                <p>${esc(p.summary)}</p>
                <p class="muted"><strong>Outcome:</strong> ${esc(p.impact)}</p>
                <div class="tags">${p.techStack.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
                <div class="card-links">
                  ${p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" rel="noopener">Source Code &rarr;</a>` : ''}
                  ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener">Live Demo &rarr;</a>` : ''}
                </div>
              </article>`
              )
              .join('')}
          </div>
        </section>`
      : '';

  const experienceHtml =
    data.sectionsEnabled.experience && data.experience.length
      ? `<section id="experience">
          <h2>Experience</h2>
          <div class="stack">
            ${data.experience
              .map(
                (exp) => `
              <article class="card">
                <div class="row-between">
                  <h3>${esc(exp.role)} &mdash; ${esc(exp.organization)}</h3>
                  <span class="muted">${esc(exp.period)}</span>
                </div>
                <ul>${exp.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
              </article>`
              )
              .join('')}
          </div>
        </section>`
      : '';

  const educationHtml =
    data.sectionsEnabled.education && data.education.length
      ? `<section id="education">
          <h2>Education</h2>
          <div class="stack">
            ${data.education
              .map(
                (edu) => `
              <article class="card">
                <div class="row-between">
                  <h3>${esc(edu.degree)}</h3>
                  <span class="muted">${esc(edu.period)}</span>
                </div>
                <p>${esc(edu.institution)}</p>
                ${edu.highlights ? `<p class="muted">${esc(edu.highlights)}</p>` : ''}
              </article>`
              )
              .join('')}
          </div>
        </section>`
      : '';

  const achievementsHtml =
    data.sectionsEnabled.achievements && data.achievements?.length
      ? `<section id="achievements">
          <h2>Certifications &amp; Achievements</h2>
          <div class="${isBento ? 'grid-bento' : 'stack'}">
            ${data.achievements
              .map(
                (ach) => `
              <article class="card">
                <div class="row-between">
                  <h3>${esc(ach.title)}</h3>
                  <span class="muted">${esc(ach.year)}</span>
                </div>
                <p class="muted">${esc(ach.issuer)}</p>
                ${ach.url ? `<div class="card-links"><a href="${esc(ach.url)}" target="_blank" rel="noopener">Verify Credential &rarr;</a></div>` : ''}
              </article>`
              )
              .join('')}
          </div>
        </section>`
      : '';

  const skillsHtml =
    data.sectionsEnabled.skills && data.skills.length
      ? `<section id="skills">
          <h2>Skills &amp; Tools</h2>
          <div class="${isBento ? 'grid-bento' : 'stack'}">
            ${data.skills
              .map(
                (s) => `
              <article class="card">
                <h3>${esc(s.category)}</h3>
                <div class="tags">${s.items.map((item) => `<span class="tag">${esc(item)}</span>`).join('')}</div>
              </article>`
              )
              .join('')}
          </div>
        </section>`
      : '';

  const mainContent = `
    <main class="content">
      <section id="about" class="card">
        <h2>About</h2>
        <p>${esc(data.about.bio)}</p>
        ${data.about.lookingFor ? `<p class="highlight"><strong>Currently:</strong> ${esc(data.about.lookingFor)}</p>` : ''}
      </section>
      ${projectsHtml}
      ${experienceHtml}
      ${educationHtml}
      ${achievementsHtml}
      ${skillsHtml}
    </main>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(data.identity.fullName)} | Portfolio</title>
  <meta name="description" content="${esc(data.identity.headline)}" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { line-height: 1.65; padding: 2rem 1.25rem; }
    .container { max-width: 980px; margin: 0 auto; }
    .hero { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
    .avatar { width: 84px; height: 84px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 2px solid var(--accent); }
    h1 { font-size: 2rem; line-height: 1.2; margin-bottom: 0.4rem; }
    h2 { font-size: 1.25rem; margin: 2rem 0 0.85rem; color: var(--accent); }
    #about h2 { margin-top: 0; }
    h3 { font-size: 1.05rem; margin-bottom: 0.35rem; }
    p { margin-bottom: 0.65rem; }
    ul { padding-left: 1.25rem; margin-top: 0.4rem; }
    li { margin-bottom: 0.35rem; }
    a { color: var(--accent); text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
    .headline { font-size: 1.1rem; font-weight: 500; margin-bottom: 0.25rem; }
    .muted { color: var(--muted); font-size: 0.92rem; }
    .links { margin-top: 0.85rem; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.6rem; }
    .tag { font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 999px; border: 1px solid var(--border); background: var(--bg); }
    .card-links { display: flex; gap: 1rem; margin-top: 0.75rem; font-size: 0.9rem; }
    .row-between { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; }
    footer { margin-top: 3.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border); text-align: center; font-size: 0.85rem; color: var(--muted); }
    ${themeCss}
    ${fontCss}
  </style>
</head>
<body>
  <div class="container ${isSplit ? 'layout-split' : ''}">
    ${headerBlock}
    ${mainContent}
  </div>
  <footer>
    Built by ${esc(data.identity.fullName)} &middot; Last updated ${esc(data.meta.lastUpdated)}
  </footer>
</body>
</html>`;
}

export function buildCustomAiPrompt(data: PortfolioData): string {
  return `You are an expert front-end web designer. Build a single-file, responsive, accessible portfolio website (index.html with embedded <style> and optional lightweight <script>) using ONLY the exact profile data below.

STRICT RULES:
1. Output ONLY valid, complete HTML starting with <!DOCTYPE html> and ending with </html>. Do not omit any section or truncate code.
2. Preserve EVERY URL, email address, project title, date, and bullet point accurately from the JSON below.
3. Keep it 100% static (no external npm packages or build steps required) so it runs immediately on GitHub Pages.
4. Include responsive mobile styling, clean contrast, and smooth section navigation.

USER PORTFOLIO JSON:
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
`;
}

export function validateCustomAiHtml(html: string, data: PortfolioData): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const trimmed = html.trim();

  if (!trimmed.toLowerCase().includes('<!doctype html') || !trimmed.toLowerCase().includes('</html>')) {
    warnings.push('File does not look like a complete HTML document (missing <!DOCTYPE html> or </html>).');
  }
  if (!trimmed.includes(data.identity.fullName)) {
    warnings.push(`Your full name ("${data.identity.fullName}") was not found in the custom HTML.`);
  }
  if (data.links.email && !trimmed.includes(data.links.email)) {
    warnings.push(`Your email ("${data.links.email}") is missing from the custom HTML.`);
  }
  if (data.links.github && !trimmed.includes(data.links.github)) {
    warnings.push(`Your GitHub URL ("${data.links.github}") is missing from the custom HTML.`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
