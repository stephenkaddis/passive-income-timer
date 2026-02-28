# Put Your Passive Income Timer on the Web (Simple Steps)

You’ll do two things: **create a repo on GitHub**, then **run one script** on your computer. Your app will get a link like `https://YOUR_USERNAME.github.io/passive-income-timer/`.

---

## Part 1: Create the repo on GitHub

### Step 1: Open GitHub and sign in

- Go to **https://github.com** and sign in (or create a free account).

### Step 2: Create a new repository

1. Click the **green “New”** button (or the **+** at the top right, then **New repository**).
2. **Repository name:** type something like **`passive-income-timer`** (no spaces; you can copy that).
3. Leave everything else as default:
   - **Public**
   - **Do not** check “Add a README” (your project already has files).
4. Click **Create repository**.

### Step 3: Turn on GitHub Pages

1. On your new repo page, click **Settings** (top menu).
2. In the left sidebar, click **Pages** (under “Code and automation”).
3. Under **Build and deployment**:
   - Where it says **Source**, choose **GitHub Actions** (from the dropdown).
4. You don’t need to click Save; just leave it like that.

You’re done on GitHub for now. Leave this tab open; you’ll need your **username** and **repo name** for the script.

---

## Part 2: Run the script on your computer

### Step 4: Open Terminal

- **Mac:** Open **Terminal** (search “Terminal” in Spotlight, or find it in Applications → Utilities).

### Step 5: Go to your project folder

In Terminal, type this (you can copy and paste) and press **Enter**:

```bash
cd "/Users/stephenkaddis/Passive income tracker"
```

### Step 6: Run the deploy script

Type this and press **Enter**:

```bash
bash deploy-to-github.sh
```

The script will ask you two things:

1. **Your GitHub username**  
   Type the username you use to sign in to GitHub (e.g. `stephenkaddis`) and press **Enter**.

2. **The repo name**  
   Type the same name you used for the repository (e.g. `passive-income-timer`) and press **Enter**.

It will then upload your project to GitHub. The first time you might be asked to sign in (browser or password/token).

### Step 7: Wait for the site to go live

1. On GitHub, open your repo and click the **Actions** tab.
2. You’ll see a workflow run. Wait until it shows a **green checkmark** (usually 1–2 minutes).
3. Your app is then live at:

   **`https://YOUR_USERNAME.github.io/REPO_NAME/`**

   Example: if your username is `stephenkaddis` and repo is `passive-income-timer`, the link is:

   **https://stephenkaddis.github.io/passive-income-timer/**

Open that link in your browser to see your Passive Income Timer.

---

## If something goes wrong

- **“Permission denied” or “could not read Username”**  
  Git doesn’t know how to log in to GitHub. You may need to set up an access token or use GitHub’s sign-in in the browser when it pops up.

- **“Repository not found”**  
  Double-check the username and repo name (spelling and no extra spaces). They must match the repo you created in Part 1.

- **Pages link shows 404**  
  Make sure in **Settings → Pages** the Source is set to **GitHub Actions**, then wait a couple of minutes after the green checkmark in Actions.

If you get a different error, you can copy the exact message and ask for help; someone can tell you what to do next.
