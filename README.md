# GitHub.io Portfolio Generator (WSL, Linux & Browser Web UI)

**Live Browser Web UI:** [https://narendaransg.github.io/portfolio-generator/](https://narendaransg.github.io/portfolio-generator/)

Build, preview, and publish a personal **`<username>.github.io`** portfolio website in minutes—while keeping your **LinkedIn profile** aligned at the same time (**two birds, one stone**).

---

## Repository Analysis & Architecture

This repository is a `pnpm` TypeScript monorepo split into three decoupled packages so the exact same portfolio schema, themes, guides, and ZIP bundler power both the **terminal CLI** and the **100% client-side Browser Web UI**:

```text
portfolio-generator/
├── .github/workflows/deploy-web.yml  # Auto-deploys packages/web to GitHub Pages
├── packages/
│   ├── core/                         # Shared engine compiled to packages/core/dist/
│   │   └── src/
│   │       ├── schema.ts             # PortfolioData schema + backward-compatible normalizePortfolioData()
│   │       ├── sample.ts             # Pre-built sample profile (Alex Sharma) for instant testing
│   │       ├── themes.ts             # 5 built-in themes + accent/font overrides + BYO-AI prompt & HTML validator
│   │       ├── docs-gen.ts           # Generates tailored DEPLOY_GUIDE.md, LINKEDIN_SYNC.md & AI_CUSTOMIZE_GUIDE.md
│   │       ├── bundler.ts            # Bundles all 6 output files into portfolio-site.zip via JSZip
│   │       └── index.ts              # Public package exports
│   ├── cli/                          # Interactive terminal generator (WSL / Linux)
│   │   └── src/index.ts              # @clack/prompts guided wizard + localhost:4173 live preview server
│   └── web/                          # 100% browser-based React + Vite builder
│       └── src/
│           ├── App.tsx               # 9-stage editor, Desktop/Mobile live iframe preview, LinkedIn sync drawer & ZIP export
│           ├── main.tsx              # React entrypoint
│           └── styles.css            # Responsive dark-mode studio UI
├── scripts/
│   └── smoke-test.mjs                # Automated E2E verification for migration, themes, BYO-AI & ZIP output
├── package.json                      # Root workspace scripts (build:core, build:web, cli, web, test)
├── pnpm-workspace.yaml               # Workspace package declarations (packages/*)
├── pnpm-lock.yaml                    # Reproducible dependency lockfile
└── tsconfig.base.json                # Shared strict TypeScript compiler config

```

### Repository Hygiene & Isolation Notes

* **Isolated Hosting:** `narendaransg/portfolio-generator` deploys strictly to `https://narendaransg.github.io/portfolio-generator/` via GitHub Actions and never touches or modifies your personal `narendaransg/narendaransg.github.io` repository.
* **Compiled Core Dependency:** `@portfolio-gen/cli` and `scripts/smoke-test.mjs` import compiled outputs from `packages/core/dist/`, so `pnpm run build:core` must run before downstream scripts.
* **Clean Working Tree:** Temporary CLI outputs (`packages/cli/portfolio-output/` and `packages/cli/portfolio-site.zip`) are excluded via `.gitignore`.

### What Every Exported `portfolio-site.zip` Contains

1. `index.html` — Complete, self-contained, mobile-responsive portfolio page with zero runtime build steps required.
2. `.nojekyll` — Tells GitHub Pages to serve your static files directly without Jekyll processing.
3. `portfolio.json` — Your structured profile data; re-import it anytime into the Web UI or CLI to update your site in seconds.
4. `DEPLOY_GUIDE.md` — Step-by-step publishing guide (both zero-terminal browser drag-and-drop and copy-paste Git commands).
5. `LINKEDIN_SYNC.md` — Ready-to-copy Headline, About section, Featured link pin steps, and a pre-drafted LinkedIn launch post.
6. `AI_CUSTOMIZE_GUIDE.md` — One-click `gitingest.com` workflow + prompts to upgrade your live site later using ChatGPT, Claude, or Gemini.

---

## Part 1: Setting Up & Running the Repository (`pnpm` Monorepo)

1. **Clone & install dependencies from the repo root**
```bash
git clone [https://github.com/narendaransg/portfolio-generator.git](https://github.com/narendaransg/portfolio-generator.git)
cd portfolio-generator
pnpm install

```


2. **Build `@portfolio-gen/core` before running downstream scripts**
```bash
pnpm run build:core

```


3. **Run the interactive CLI (WSL / Linux)**
```bash
pnpm run cli

```


Follow the arrow-key prompts in your terminal, inspect the live preview at `http://localhost:4173`, and grab your generated `portfolio-site.zip`.
4. **Run or build the browser Web UI**
```bash
pnpm run web        # Start local Vite dev server at http://localhost:5173
pnpm run build:web  # Compile production static bundle in packages/web/dist/

```


5. **Run automated end-to-end smoke tests**
```bash
pnpm test

```



---

## Part 2: Building & Publishing Your Portfolio (`<username>.github.io`)

1. **Enter your exact GitHub username and identity**
Set your exact GitHub username so your target repository (`<username>.github.io`), live URL (`https://<username>.github.io`), and profile links match consistently.
2. **Fill in high-signal sections**
* **Identity & About:** State clearly what you build, your core focus areas (such as digital IC design, RTL verification, embedded/systems engineering, or software), and what opportunities you are currently open to.
* **Projects:** Keep descriptions crisp—summarize *what* the system does, *which tools/languages* you used, and *what measurable outcome or verification* it achieved.
* **Experience, Education, Achievements & Skills:** Keep role titles, organizations, dates, and top skills aligned with your resume and LinkedIn profile.


3. **Pick a theme and customize look & feel**
Choose from 5 built-in presets or **Custom AI Template (BYO-AI)**:
* **Minimalist Clean** — Crisp single-column layout with generous whitespace.
* **Bento Card Grid** — Modular cards highlighting projects, skills, and education side-by-side.
* **Terminal / Developer** — Dark-mode engineering aesthetic with monospace accents and command-line headings.
* **Editorial / Storyteller** — Warm serif headings and narrative flow built around your story.
* **Split-Pane Sidebar** — Sticky profile card on the left with scrollable sections on the right.
* **Custom AI Template (BYO-AI)** — Copies a structured prompt with your exact JSON so you can generate bespoke HTML in ChatGPT, Claude, or Gemini and validate it back inside the tool.


Optionally override the **Accent Color** and **Font Style** (`Sans-Serif`, `Serif`, or `Monospace`), and verify both **Desktop** and **Mobile (390px)** viewports before exporting.
4. **Export your bundle & keep `portfolio.json**`
Download `portfolio-site.zip` and store `portfolio.json` safely. Whenever you finish a new project, earn a certification, or start a new role, re-import `portfolio.json` to regenerate your site without retyping anything.
5. **Deploy to `<username>.github.io` and sync LinkedIn**
* Create a public repository named `<username>.github.io` on GitHub and upload all files from the unzipped folder (via browser drag-and-drop or `git push -u origin main`).
* Enable GitHub Pages from `main` / `(root)` in repository **Settings → Pages** and verify `https://<username>.github.io` goes live.
* Open the **LinkedIn Sync & Launch** tab (or `LINKEDIN_SYNC.md`) to update your LinkedIn Headline, About section, Featured link pin, and launch post.



---

## Part 3: Dos and Don'ts

### Dos

* **Do** use `pnpm` with `workspace:*` linking across `packages/*` and run `pnpm install` from the repository root.
* **Do** build `packages/core` (`pnpm run build:core`) before running `pnpm test` or starting `cli`/`web` against `dist/`.
* **Do** keep `portfolio.json` backed up whenever you export a site so future updates take under a minute.
* **Do** preview both desktop and mobile widths and test every link (`email`, `github`, `linkedin`, project repos/demos) before publishing.
* **Do** keep `portfolio-generator` workflows and commits strictly scoped to `narendaransg/portfolio-generator` so your personal `.github.io` site remains completely separate.

### Don'ts

* **Don't** run `npm install` inside individual subpackages or commit `package-lock.json` into the `pnpm` workspace.
* **Don't** point automated deployment workflows from `portfolio-generator` at a personal `<username>.github.io` repository.
* **Don't** publish sensitive personal details on a public portfolio—never include home addresses, personal phone numbers, API keys, or private credentials.
* **Don't** leave placeholder text, broken links, or unverified claims in your live `index.html`.
* **Don't** commit temporary CLI output folders (`packages/cli/portfolio-output/`) or personal output ZIPs (`packages/cli/portfolio-site.zip`) into the generator repository.
