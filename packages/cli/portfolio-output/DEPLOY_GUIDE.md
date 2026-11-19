# How to Publish Your Portfolio Live (https://hellonigga.github.io)

Welcome! Everything inside this folder is already built and ready to go live for **free** on GitHub Pages. Pick **Option A** (no terminal needed) or **Option B** (using your WSL / Linux terminal).

---

## Step 1: Create Your GitHub Pages Repository
1. Log in to [GitHub.com](https://github.com) with your account (**hellonigga**).
2. Click the **+** icon in the top-right corner and choose **New repository**.
3. Name the repository **exact match**: `hellonigga.github.io`
   > **Important:** The repository name MUST be `hellonigga.github.io` for your site to appear at `https://hellonigga.github.io`.
4. Set visibility to **Public** and click **Create repository**.

---

## Step 2: Upload Your Website Files

### Option A: Zero-Terminal Method (Easiest — Drag & Drop in Browser)
1. Unzip `portfolio-site.zip` on your computer.
2. Open your new empty repository page at `https://github.com/hellonigga/hellonigga.github.io`.
3. Click the **"uploading an existing file"** link on the page.
4. Drag **all files** from the unzipped folder (`index.html`, `.nojekyll`, `portfolio.json`, and the guide files) into the browser window.
5. Scroll down, type `Initial portfolio launch` in the commit box, and click **Commit changes**.

### Option B: WSL / Linux Terminal Method (Copy & Paste)
Open your terminal inside the unzipped folder and run:

```bash
git init
git branch -M main
git add .
git commit -m "feat: initial portfolio launch"
git remote add origin https://github.com/hellonigga/hellonigga.github.io.git
git push -u origin main
```
*(If you use SSH keys on GitHub, replace the `https://...` URL with `git@github.com:hellonigga/hellonigga.github.io.git`.)*

---

## Step 3: Verify Your Live Link
1. Go to `https://github.com/hellonigga/hellonigga.github.io/settings/pages`.
2. Under **Build and deployment**, ensure **Source** is set to **Deploy from a branch**, and **Branch** is set to **main** / **(root)**.
3. Wait **1–2 minutes**, then open **https://hellonigga.github.io** in your browser!

---

## Updating Your Site Later
Keep the `portfolio.json` file included in this folder! Whenever you want to update your projects, skills, or theme later, open the Portfolio Generator, load your `portfolio.json`, make edits, and upload the updated files.
