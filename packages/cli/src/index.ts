#!/usr/bin/env node
import * as p from '@clack/prompts';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { exec } from 'node:child_process';
import {
  PortfolioData,
  SAMPLE_PORTFOLIO,
  THEME_CATALOG,
  ThemeId,
  buildCustomAiPrompt,
  buildPortfolioZip,
  generateSiteFiles,
  validateCustomAiHtml,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
} from '@portfolio-gen/core';

function abortIfCancelled<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Setup cancelled. Your progress was not saved.');
    process.exit(0);
  }
  return value as T;
}

function openBrowser(url: string): void {
  const cmd =
    process.platform === 'darwin'
      ? `open "${url}"`
      : process.platform === 'win32'
        ? `start "" "${url}"`
        : `wslview "${url}" 2>/dev/null || explorer.exe "${url}" 2>/dev/null || xdg-open "${url}" 2>/dev/null || true`;
  exec(cmd);
}

async function startPreviewServer(
  htmlContent: string,
  port = 4173
): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(htmlContent);
    });

    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function runGuidedQuestionnaire(): Promise<PortfolioData> {
  p.note(
    'We will walk through 7 quick stages.\n' +
      'Tip: Keep your LinkedIn profile open alongside this terminal—your answers will generate\n' +
      'both your live GitHub Pages site AND a copy-paste checklist to upgrade your LinkedIn!',
    'How This Works (2 Birds, 1 Stone)'
  );

  // Stage 1: GitHub & Identity
  p.log.step('Stage 1 of 7: GitHub Username & Identity (Your 3-Second Hook)');
  const githubUsername = abortIfCancelled(
    await p.text({
      message: 'What is your exact GitHub username? (Used to configure <username>.github.io)',
      placeholder: 'e.g., narendaransg',
      validate: (v) => (!v?.trim() ? 'GitHub username is required.' : undefined),
    })
  ).trim();

  const fullName = abortIfCancelled(
    await p.text({
      message: 'Your Full Name (as shown on your resume & LinkedIn):',
      placeholder: 'e.g., Narendaran S G',
      validate: (v) => (!v?.trim() ? 'Full name is required.' : undefined),
    })
  ).trim();

  const headline = abortIfCancelled(
    await p.text({
      message: 'Short Headline / Role (1 line describing what you do or study):',
      placeholder: 'e.g., Final-Year ECE Student | Digital IC Design & RTL Verification',
      validate: (v) => (!v?.trim() ? 'Headline is required.' : undefined),
    })
  ).trim();

  const location = abortIfCancelled(
    await p.text({
      message: 'City & Country:',
      placeholder: 'e.g., Chennai, India',
      defaultValue: 'Chennai, India',
    })
  ).trim();

  const avatarUrl = abortIfCancelled(
    await p.text({
      message: 'Profile Photo URL (Optional — press Enter to skip, or paste an image link):',
      placeholder: 'https://github.com/' + githubUsername + '.png',
      defaultValue: `https://github.com/${githubUsername}.png`,
    })
  ).trim();

  // Stage 2: About / Bio
  p.log.step('Stage 2 of 7: About / Bio (Your Story)');
  const bio = abortIfCancelled(
    await p.text({
      message: 'Write 2–3 sentences about who you are and what you enjoy building:',
      placeholder: 'I build hardware-software systems from first principles...',
      validate: (v) => (!v?.trim() ? 'A short bio helps visitors know who you are.' : undefined),
    })
  ).trim();

  const lookingFor = abortIfCancelled(
    await p.text({
      message: 'What opportunities are you currently open to? (Optional — press Enter to skip):',
      placeholder: 'e.g., Open to MS research opportunities and RTL/VLSI engineering roles',
      defaultValue: '',
    })
  ).trim();

  // Stage 3: Education
  p.log.step('Stage 3 of 7: Education & Credentials');
  const education: EducationItem[] = [];
  let addEdu = abortIfCancelled(
    await p.confirm({
      message: 'Add an Education entry (degree, college, or school)?',
      initialValue: true,
    })
  );

  while (addEdu) {
    const degree = abortIfCancelled(
      await p.text({
        message: 'Degree / Program:',
        placeholder: 'e.g., B.E. in Electronics and Communication Engineering',
        validate: (v) => (!v?.trim() ? 'Degree is required.' : undefined),
      })
    ).trim();

    const institution = abortIfCancelled(
      await p.text({
        message: 'Institution / University Name:',
        placeholder: 'e.g., Easwari Engineering College',
        validate: (v) => (!v?.trim() ? 'Institution is required.' : undefined),
      })
    ).trim();

    const period = abortIfCancelled(
      await p.text({
        message: 'Years / Period:',
        placeholder: 'e.g., 2023 – 2027',
        defaultValue: '2023 – 2027',
      })
    ).trim();

    const highlights = abortIfCancelled(
      await p.text({
        message: 'Relevant coursework, CGPA, or highlights (Optional):',
        placeholder: 'e.g., VLSI Design, Computer Architecture, Digital Logic',
        defaultValue: '',
      })
    ).trim();

    education.push({ degree, institution, period, highlights: highlights || undefined });

    addEdu = abortIfCancelled(
      await p.confirm({
        message: 'Add another Education entry?',
        initialValue: false,
      })
    );
  }

  // Stage 4: Experience
  p.log.step('Stage 4 of 7: Experience, Internships & Leadership Roles');
  const experience: ExperienceItem[] = [];
  let addExp = abortIfCancelled(
    await p.confirm({
      message: 'Add an Experience / Internship / Club Leadership entry?',
      initialValue: true,
    })
  );

  while (addExp) {
    const role = abortIfCancelled(
      await p.text({
        message: 'Role / Title:',
        placeholder: 'e.g., RTL Design Intern / Project Lead',
        validate: (v) => (!v?.trim() ? 'Role is required.' : undefined),
      })
    ).trim();

    const organization = abortIfCancelled(
      await p.text({
        message: 'Company / Lab / Organization:',
        placeholder: 'e.g., Open Silicon Lab',
        validate: (v) => (!v?.trim() ? 'Organization is required.' : undefined),
      })
    ).trim();

    const period = abortIfCancelled(
      await p.text({
        message: 'Timeframe:',
        placeholder: 'e.g., May 2026 – Jul 2026',
      })
    ).trim();

    const bulletsRaw = abortIfCancelled(
      await p.text({
        message: 'Key outcomes/bullets (separate multiple points with a semicolon ";"):',
        placeholder: 'Designed AXI4 DMA engine; Automated regression tests in Python',
        validate: (v) => (!v?.trim() ? 'Add at least one bullet.' : undefined),
      })
    );

    const bullets = bulletsRaw
      .split(';')
      .map((b) => b.trim())
      .filter(Boolean);

    experience.push({ role, organization, period, bullets });

    addExp = abortIfCancelled(
      await p.confirm({
        message: 'Add another Experience entry?',
        initialValue: false,
      })
    );
  }

  // Stage 5: Projects
  p.log.step('Stage 5 of 7: Projects (Your Proof of Work)');
  const projects: ProjectItem[] = [];
  let addProj = abortIfCancelled(
    await p.confirm({
      message: 'Add a Project? (Highly recommended — recruiters love concrete projects!)',
      initialValue: true,
    })
  );

  while (addProj) {
    const title = abortIfCancelled(
      await p.text({
        message: 'Project Name:',
        placeholder: 'e.g., Custom AXI4 iDMA Engine in SystemVerilog',
        validate: (v) => (!v?.trim() ? 'Project name is required.' : undefined),
      })
    ).trim();

    const summary = abortIfCancelled(
      await p.text({
        message: '1-Line Summary (What does it do?):',
        placeholder: 'High-throughput memory-to-memory DMA engine verified with UVM.',
        validate: (v) => (!v?.trim() ? 'Summary is required.' : undefined),
      })
    ).trim();

    const techRaw = abortIfCancelled(
      await p.text({
        message: 'Tools / Languages used (comma-separated):',
        placeholder: 'SystemVerilog, UVM, Git, Linux',
      })
    );
    const techStack = techRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const impact = abortIfCancelled(
      await p.text({
        message: 'Outcome / Result / What you learned:',
        placeholder: 'Verified zero-wait-state burst transfers and synthesized at 32nm.',
        defaultValue: 'Built and tested end-to-end.',
      })
    ).trim();

    const repoUrl = abortIfCancelled(
      await p.text({
        message: 'GitHub Repo URL (Optional — press Enter to skip):',
        placeholder: `https://github.com/${githubUsername}/my-project`,
        defaultValue: '',
      })
    ).trim();

    const liveUrl = abortIfCancelled(
      await p.text({
        message: 'Live Demo / Write-up URL (Optional — press Enter to skip):',
        defaultValue: '',
      })
    ).trim();

    projects.push({
      title,
      summary,
      techStack,
      impact,
      repoUrl: repoUrl || undefined,
      liveUrl: liveUrl || undefined,
    });

    addProj = abortIfCancelled(
      await p.confirm({
        message: 'Add another Project?',
        initialValue: projects.length < 2,
      })
    );
  }

  // Stage 6: Skills
  p.log.step('Stage 6 of 7: Skills & Tools');
  const skills: SkillGroup[] = [];
  const coreSkillsRaw = abortIfCancelled(
    await p.text({
      message: 'Core Domain Skills (comma-separated):',
      placeholder: 'e.g., RTL Design, Digital Logic, Computer Architecture, Problem Solving',
      validate: (v) => (!v?.trim() ? 'Enter at least 2–3 skills.' : undefined),
    })
  );
  skills.push({
    category: 'Core Skills',
    items: coreSkillsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  });

  const toolsRaw = abortIfCancelled(
    await p.text({
      message: 'Languages, Software & Tools (comma-separated, or Enter to skip):',
      placeholder: 'e.g., SystemVerilog, Python, Git, Linux / WSL',
      defaultValue: '',
    })
  );
  if (toolsRaw.trim()) {
    skills.push({
      category: 'Tools & Technologies',
      items: toolsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
  }

  // Stage 7: Links & Contact
  p.log.step('Stage 7 of 7: Contact & Social Links');
  p.note(
    'Privacy Tip: Avoid putting personal phone numbers or home street addresses on public websites.\n' +
      'Email + LinkedIn + GitHub is the industry gold standard.',
    'Public Privacy Check'
  );

  const email = abortIfCancelled(
    await p.text({
      message: 'Public Contact Email:',
      placeholder: 'you@example.com',
      validate: (v) => (!v?.includes('@') ? 'Enter a valid email address.' : undefined),
    })
  ).trim();

  const linkedin = abortIfCancelled(
    await p.text({
      message: 'LinkedIn Profile URL:',
      placeholder: `https://www.linkedin.com/in/${githubUsername}`,
      defaultValue: `https://www.linkedin.com/in/${githubUsername}`,
    })
  ).trim();

  const resumeUrl = abortIfCancelled(
    await p.text({
      message: 'Resume PDF Link (Google Drive / GitHub link — Optional, Enter to skip):',
      defaultValue: '',
    })
  ).trim();

  return {
    meta: {
      githubUsername,
      repoName: `${githubUsername}.github.io`,
      theme: 'bento',
      stack: 'static-html',
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    identity: {
      fullName,
      headline,
      location,
      avatarUrl: avatarUrl || undefined,
    },
    about: {
      bio,
      lookingFor,
    },
    education,
    experience,
    projects,
    skills,
    links: {
      email,
      github: `https://github.com/${githubUsername}`,
      linkedin,
      resumeUrl: resumeUrl || undefined,
    },
    sectionsEnabled: {
      education: education.length > 0,
      experience: experience.length > 0,
      projects: projects.length > 0,
      skills: skills.length > 0,
    },
  };
}

async function main() {
  console.clear();
  p.intro('GitHub.io Portfolio Generator — WSL & Linux Terminal Edition');

  const mode = abortIfCancelled(
    await p.select({
      message: 'How would you like to start?',
      options: [
        {
          value: 'guided',
          label: 'Guided Step-by-Step Setup (Recommended for Beginners)',
          hint: '7 simple stages + LinkedIn sync checklist',
        },
        {
          value: 'import',
          label: 'Load Existing portfolio.json',
          hint: 'Update a portfolio you created earlier',
        },
        {
          value: 'sample',
          label: 'Quick Demo Mode (Sample Profile)',
          hint: 'Test themes & live preview in 5 seconds',
        },
      ],
    })
  );

  let data: PortfolioData;

  if (mode === 'sample') {
    data = structuredClone(SAMPLE_PORTFOLIO);
    const customUser = abortIfCancelled(
      await p.text({
        message: 'Enter your GitHub username for the sample preview:',
        defaultValue: 'alex-builder',
      })
    ).trim();
    data.meta.githubUsername = customUser;
    data.meta.repoName = `${customUser}.github.io`;
    data.links.github = `https://github.com/${customUser}`;
  } else if (mode === 'import') {
    const jsonPath = abortIfCancelled(
      await p.text({
        message: 'Path to your portfolio.json file:',
        defaultValue: './portfolio.json',
      })
    ).trim();
    const raw = await fs.readFile(path.resolve(jsonPath), 'utf-8');
    data = JSON.parse(raw) as PortfolioData;
    data.meta.lastUpdated = new Date().toISOString().split('T')[0];
    p.log.success(`Loaded profile for ${data.identity.fullName}!`);
  } else {
    data = await runGuidedQuestionnaire();
  }

  // Output Stack Information (Plain-English Comparison)
  p.note(
    '• Pure Static HTML/CSS/JS (Active Default): Zero build errors, works out-of-the-box on\n' +
      '  GitHub Pages, and any AI (ChatGPT/Claude/Gemini) can customize it cleanly.\n' +
      '• Astro / React-Vite: Best for devs wanting multi-page blogs or custom npm components\n' +
      '  (requires a build step). Your bundle uses Pure Static HTML so it deploys in 60 seconds.',
    'Output Stack Info'
  );

  // Theme Selection Loop (Allows trying themes in live preview!)
  let customOverride: { html?: string } | undefined;
  let satisfied = false;

  while (!satisfied) {
    const selectedTheme = abortIfCancelled(
      await p.select({
        message: 'Choose a visual theme (you will preview it live in your browser next!):',
        options: THEME_CATALOG.map((t) => ({
          value: t.id,
          label: t.name,
          hint: t.tagline,
        })),
      })
    ) as ThemeId;

    data.meta.theme = selectedTheme;
    customOverride = undefined;

    if (selectedTheme === 'custom-ai') {
      const promptPath = path.resolve('AI_PROMPT.txt');
      await fs.writeFile(promptPath, buildCustomAiPrompt(data), 'utf-8');

      p.note(
        `1. We saved your personalized prompt to:\n   ${promptPath}\n` +
          '2. Copy the contents of AI_PROMPT.txt into ChatGPT, Claude, or Gemini.\n' +
          '3. Save the HTML response from the AI as "custom-index.html" in this folder.',
        'Custom AI Template (BYO-AI) Instructions'
      );

      const customHtmlPath = abortIfCancelled(
        await p.text({
          message: 'Enter path to your AI-generated HTML file once ready:',
          defaultValue: './custom-index.html',
        })
      ).trim();

      const customHtml = await fs.readFile(path.resolve(customHtmlPath), 'utf-8');
      const check = validateCustomAiHtml(customHtml, data);

      if (!check.valid) {
        p.log.warn('Sanity Check Warnings on your AI-generated HTML:');
        for (const w of check.warnings) {
          p.log.warn(`  - ${w}`);
        }
        const proceedAnyway = abortIfCancelled(
          await p.confirm({
            message: 'Use this custom HTML anyway? (Choose No to pick a built-in theme instead)',
            initialValue: true,
          })
        );
        if (!proceedAnyway) continue;
      } else {
        p.log.success('Custom AI HTML passed all sanity checks!');
      }

      customOverride = { html: customHtml };
    }

    // Live Preview Server
    const files = generateSiteFiles(data, customOverride);
    const previewUrl = 'http://localhost:4173'\;
    const server = await startPreviewServer(files['index.html'], 4173);

    p.log.info(`Live preview running at ${previewUrl} — opening your browser now...`);
    openBrowser(previewUrl);

    satisfied = abortIfCancelled(
      await p.confirm({
        message: 'Do you like how the website looks in your browser? (Choose No to switch themes)',
        initialValue: true,
      })
    );

    server.close();
  }

  // Export ZIP + Unpacked Folder
  const spinner = p.spinner();
  spinner.start('Packaging portfolio-site.zip and layman guides...');

  const outDir = path.resolve('portfolio-output');
  await fs.mkdir(outDir, { recursive: true });

  const files = generateSiteFiles(data, customOverride);
  for (const [filename, content] of Object.entries(files)) {
    await fs.writeFile(path.join(outDir, filename), content, 'utf-8');
  }

  const zipBytes = await buildPortfolioZip(data, customOverride);
  const zipPath = path.resolve('portfolio-site.zip');
  await fs.writeFile(zipPath, zipBytes);

  spinner.stop('Build complete!');

  // Final Guided Action Summary
  const user = data.meta.githubUsername;
  const repo = data.meta.repoName;

  p.note(
    `ZIP Archive:     ${zipPath}\n` +
      `Unpacked Folder: ${outDir}\n\n` +
      `STEP 1 — PUBLISH TO GITHUB PAGES (https://${user}.github.io):\n` +
      `  • Create a public repo named "${repo}" on GitHub.com\n` +
      `  • Either drag-and-drop all files from "${outDir}" on GitHub.com,\n` +
      `    OR run these commands:\n` +
      `      cd "${outDir}"\n` +
      `      git init && git branch -M main && git add .\n` +
      `      git commit -m "feat: launch portfolio"\n` +
      `      git remote add origin https://github.com/${user}/${repo}.git\n` +
      `      git push -u origin main\n\n` +
      `STEP 2 — TWO BIRDS, ONE STONE (LINKEDIN SYNC):\n` +
      `  • Open "${path.join(outDir, 'LINKEDIN_SYNC.md')}"\n` +
      `  • Paste your updated Headline & About, pin https://${user}.github.io to\n` +
      `    LinkedIn "Featured", and publish the pre-written Launch Post!\n\n` +
      `STEP 3 — UPGRADE ANYTIME WITH GITINGEST + AI:\n` +
      `  • Open "${path.join(outDir, 'AI_CUSTOMIZE_GUIDE.md')}" to turn your repo into an\n` +
      `    AI digest at https://gitingest.com/${user}/${repo}`,
    'Your Next 3 Steps (Full Guides Saved Inside Your ZIP!)'
  );

  p.outro(`All set, ${data.identity.fullName}! Your portfolio is ready to ship.`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
