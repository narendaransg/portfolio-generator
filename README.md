# GitHub.io Portfolio Generator (WSL, Linux & Browser Web UI)

Build, preview, and publish a personal **\`<username>.github.io\`** portfolio website in minutes—while keeping your **LinkedIn profile** aligned at the same time (**two birds, one stone**).

Designed for complete beginners and engineers alike:
- **Zero-Backend Browser Web UI:** Guided 8-step builder, instant Desktop/Mobile live preview, one-click LinkedIn copy blocks, and \`portfolio-site.zip\` download.
- **Interactive WSL & Linux Terminal CLI:** Arrow-key guided setup with a built-in \`localhost\` live preview server that automatically opens your browser.
- **5 Built-In Themes + Custom AI Template (BYO-AI):** Pick from *Minimalist Clean*, *Bento Card Grid*, *Terminal / Developer*, *Editorial / Storyteller*, or *Split-Pane Sidebar*—or generate a prompt for ChatGPT, Claude, or Gemini and drop your custom HTML right back in.
- **Complete Beginner Manuals Bundled Inside Every ZIP:**
  - \`DEPLOY_GUIDE.md\` — Zero-terminal browser drag-and-drop instructions **and** copy-paste Git commands.
  - \`LINKEDIN_SYNC.md\` — Copy-paste Headline/About blocks, **Featured** pin steps, and a ready-to-publish LinkedIn launch post.
  - \`AI_CUSTOMIZE_GUIDE.md\` — One-click **Gitingest** (\`gitingest.com\`) workflow + prompts to upgrade your live site later in any AI.
  - \`portfolio.json\` — Re-importable anytime so you can update your site in 30 seconds without starting over.

---

## Quick Start (WSL & Linux)

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/narendaransg/portfolio-generator.git
cd portfolio-generator
pnpm install
pnpm run build:core
\`\`\`

### 2. Option A: Run the Interactive Terminal CLI (WSL / Linux)
\`\`\`bash
pnpm run cli
\`\`\`
Follow the on-screen prompts, preview your site live at \`http://localhost:4173\`, and grab your generated \`portfolio-site.zip\` and \`./portfolio-output/\` folder.

### 3. Option B: Run the Browser Web UI
\`\`\`bash
pnpm run web
\`\`\`
Opens \`http://localhost:5173\` with side-by-side editing, Desktop/Mobile live preview, LinkedIn sync checklist, and instant ZIP download.

---

## Project Architecture
\`\`\`text
portfolio-generator/
├── packages/
│   ├── core/   # Shared TypeScript schema, 5 themes, BYO-AI validator, Markdown guides & JSZip bundler
│   ├── cli/    # Interactive WSL/Linux terminal prompts + localhost live preview server
│   └── web/    # 100% client-side Vite + React web interface (can also be hosted on GitHub Pages)
\`\`\`
