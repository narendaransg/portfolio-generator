import { PortfolioData } from './schema.js';

export function generateDeployGuide(data: PortfolioData): string {
  const user = data.meta.githubUsername || 'YOUR-USERNAME';
  const repo = data.meta.repoName || `${user}.github.io`;
  const liveUrl = `https://${user}.github.io`;

  return `# How to Publish Your Portfolio Live (${liveUrl})

Welcome! Everything inside this folder is already built and ready to go live for **free** on GitHub Pages. Pick **Option A** (no terminal needed) or **Option B** (using your WSL / Linux terminal).

---

## Step 1: Create Your GitHub Pages Repository
1. Log in to [GitHub.com](https://github.com) with your account (**${user}**).
2. Click the **+** icon in the top-right corner and choose **New repository**.
3. Name the repository **exact match**: \`${repo}\`
   > **Important:** The repository name MUST be \`${repo}\` for your site to appear at \`${liveUrl}\`.
4. Set visibility to **Public** and click **Create repository**.

---

## Step 2: Upload Your Website Files

### Option A: Zero-Terminal Method (Easiest — Drag & Drop in Browser)
1. Unzip \`portfolio-site.zip\` on your computer.
2. Open your new empty repository page at \`https://github.com/${user}/${repo}\`.
3. Click the **"uploading an existing file"** link on the page.
4. Drag **all files** from the unzipped folder (\`index.html\`, \`.nojekyll\`, \`portfolio.json\`, and the guide files) into the browser window.
5. Scroll down, type \`Initial portfolio launch\` in the commit box, and click **Commit changes**.

### Option B: WSL / Linux Terminal Method (Copy & Paste)
Open your terminal inside the unzipped folder and run:

\`\`\`bash
git init
git branch -M main
git add .
git commit -m "feat: initial portfolio launch"
git remote add origin https://github.com/${user}/${repo}.git
git push -u origin main
\`\`\`
*(If you use SSH keys on GitHub, replace the \`https://...\` URL with \`git@github.com:${user}/${repo}.git\`.)*

---

## Step 3: Verify Your Live Link
1. Go to \`https://github.com/${user}/${repo}/settings/pages\`.
2. Under **Build and deployment**, ensure **Source** is set to **Deploy from a branch**, and **Branch** is set to **main** / **(root)**.
3. Wait **1–2 minutes**, then open **${liveUrl}** in your browser!

---

## Updating Your Site Later
Keep the \`portfolio.json\` file included in this folder! Whenever you want to update your projects, skills, or theme later, open the Portfolio Generator, load your \`portfolio.json\`, make edits, and upload the updated files.
`;
}

export function generateLinkedInSyncGuide(data: PortfolioData): string {
  const user = data.meta.githubUsername || 'YOUR-USERNAME';
  const liveUrl = `https://${user}.github.io`;
  const topSkills = data.skills.flatMap((s) => s.items).slice(0, 8).join(', ');
  const topProjects = data.projects.slice(0, 3);

  const projectBullets = topProjects.length
    ? topProjects.map((p) => `- ${p.title}: ${p.summary}`).join('\n')
    : '- Highlighted hands-on projects and technical write-ups';

  return `# Two Birds, One Stone: Sync Your LinkedIn & Launch Your Portfolio

Recruiters and collaborators almost always check both your **LinkedIn** and your **Portfolio**. Use this checklist right after deploying **${liveUrl}** so both profiles tell the exact same story.

---

## 1. Update Your LinkedIn Headline
Click the **pencil icon** on your LinkedIn top profile card and paste this Headline:

\`\`\`text
${data.identity.headline}
\`\`\`

---

## 2. Update Your LinkedIn "About" Section
Make sure the first 3 lines hook the reader before LinkedIn's *"see more"* fold:

\`\`\`text
${data.about.bio}

${data.about.lookingFor ? `Currently: ${data.about.lookingFor}` : ''}

Explore my projects and work here: ${liveUrl}
\`\`\`

---

## 3. Align Experience, Education & Top Skills
- **Experience & Education:** Verify that your role titles, organizations, and dates match what you entered in \`portfolio.json\`.
- **Top Skills to Pin on LinkedIn:** ${topSkills || 'Add your core domain skills'}
- **Contact Info:** Click **Contact info** on your LinkedIn profile -> **Edit** -> add **${liveUrl}** as your Personal Website.

---

## 4. Pin Your Portfolio to LinkedIn "Featured" (High Visibility!)
Make your live website impossible to miss on your LinkedIn profile:
1. Go to your LinkedIn profile and click **Add profile section** -> **Recommended** -> **Add featured**.
2. Click the **+** icon and choose **Add a link**.
3. Paste: \`${liveUrl}\`
4. Set Title to: \`${data.identity.fullName} — Portfolio & Projects\`
5. Click **Save**. It will now appear visually near the top of your LinkedIn profile!

---

## 5. Publish Your LinkedIn Launch Post (Ready-to-Copy Draft)
Share your new portfolio with your network so people actually click it:

\`\`\`text
Excited to share my new personal portfolio website! 🚀

I put together a clean home for my projects, background, and what I'm currently building:
${projectBullets}

Take a look here: ${liveUrl}

Always open to feedback, ideas, and connecting with folks working in similar areas!

#Portfolio #Projects #LearningInPublic #Career
\`\`\`
`;
}

export function generateAiCustomizeGuide(data: PortfolioData): string {
  const user = data.meta.githubUsername || 'YOUR-USERNAME';
  const repo = data.meta.repoName || `${user}.github.io`;
  const githubUrl = `https://github.com/${user}/${repo}`;
  const gitingestUrl = `https://gitingest.com/${user}/${repo}`;

  return `# Upgrade Your Live Portfolio Anytime Using Gitingest + Any AI

Once your site is live at **https://${user}.github.io**, you don't need to be a web developer to add animations, dark/light mode toggles, new project filters, or custom visual themes.

You can feed your **entire repository** into ChatGPT, Claude, Gemini, or any AI in one click using **Gitingest**.

---

## Step 1: Turn Your GitHub Repo into an AI-Ready Prompt
1. Your repository URL is:
   \`${githubUrl}\`
2. Change \`github.com\` to \`gitingest.com\` (or open this link directly):
   **${gitingestUrl}**
3. Click **Ingest** and then click **Copy all** (this copies your entire codebase cleanly formatted for an AI).

---

## Step 2: Paste into Your Favorite AI with One of These Prompts

Open ChatGPT, Claude, or Gemini, paste what you copied from Gitingest, and add one of these prompts:

### Prompt Option 1: Add Dark/Light Mode + Smooth Animations
> "Above is my complete GitHub Pages portfolio repository. Please update \`index.html\` to add a clean Dark/Light theme toggle button in the header (saved in localStorage) and subtle scroll fade-in animations, while keeping all my existing links, text, and sections 100% intact. Return the complete updated \`index.html\` file."

### Prompt Option 2: Add Interactive Project Filtering by Tech Tag
> "Above is my complete GitHub Pages portfolio repository. Please add clickable skill/tech filter pills above the Projects section so visitors can filter projects by technology (with an 'All' button selected by default). Return the complete updated \`index.html\` file."

### Prompt Option 3: Complete Visual Redesign
> "Above is my complete GitHub Pages portfolio repository. Redesign the visual styling and layout of \`index.html\` to look like a modern interactive engineering showcase, while keeping every single project, link, email, and bio detail intact. Return the complete updated \`index.html\` file."

---

## Step 3: Save & Publish Your Upgrade
1. Replace your local \`index.html\` with the updated code from the AI.
2. Open \`index.html\` in your browser first to verify it looks great.
3. Upload the updated \`index.html\` to \`${githubUrl}\` (or run \`git add index.html && git commit -m "style: upgrade portfolio" && git push\`).
`;
}
