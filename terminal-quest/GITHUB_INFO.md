# Terminal Quest - GitHub Repository Info

## 🌐 Live on GitHub!

**Repository:** https://github.com/chaps843/projects

**Direct Link:** https://github.com/chaps843/projects/tree/main/terminal-quest

**Status:** ✅ Pushed and available

---

## 📁 Location

**Local Path:** `/home/chaps/projects/terminal-quest/`

**GitHub Path:** `chaps843/projects/terminal-quest/`

**Parent Repo:** chaps843/projects (contains file-organizer and other projects)

---

## 🔄 Git Workflow

### Making Changes

```bash
cd /home/chaps/projects/terminal-quest

# Edit files...
nano game.js

# Stage changes
cd ..
git add terminal-quest/

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### Pulling Updates

```bash
cd /home/chaps/projects
git pull origin main
```

---

## 🚀 Running the Game

### Local Development

```bash
cd /home/chaps/projects/terminal-quest
python3 -m http.server 8081
# Visit http://localhost:8081
```

### Stop Server

```bash
kill $(cat /tmp/terminal-quest-server.pid)
```

---

## 🌍 Deploying to GitHub Pages

If you want to host the game publicly:

1. **Enable GitHub Pages:**
   - Go to repository settings
   - Scroll to "Pages"
   - Source: Deploy from branch
   - Branch: main
   - Folder: /terminal-quest

2. **Game will be live at:**
   `https://chaps843.github.io/projects/terminal-quest/`

3. **No changes needed** - game works as static files!

---

## 📋 What's in the Repository

```
terminal-quest/
├── index.html              # Main game
├── styles.css              # Styling
├── game.js                 # Game engine
├── CONTEXT.md             # Full project context
├── SESSION_RECOVERY.md    # Recovery guide
├── GITHUB_INFO.md         # This file
└── [14 other docs]        # Documentation
```

**Total:** 17 files, 5,701 lines

---

## 🔐 Access & Permissions

**Repository Type:** Private (assumed)
**Owner:** chaps843
**Collaborators:** (add as needed)

**To clone elsewhere:**
```bash
git clone https://github.com/chaps843/projects.git
cd projects/terminal-quest
python3 -m http.server 8081
```

---

## 📝 Commit History

**Initial Commit:**
```
Add Terminal Quest v2.0 - Browser-based Linux learning game

- 15 story-driven missions teaching Linux fundamentals
- 17 working terminal commands
- Virtual filesystem with realistic structure
- XP/leveling system with 12 achievements
- Beautiful cyberpunk terminal UI
- Pipes, redirection, and wildcard support
- Zero dependencies - pure HTML/CSS/JS
- ~2 hours of gameplay, 5000 XP total
```

**View full history:**
```bash
cd /home/chaps/projects
git log --oneline -- terminal-quest/
```

---

## 🎯 For Future Sessions

**Recovery Steps:**

1. Navigate to project:
   ```bash
   cd /home/chaps/projects/terminal-quest
   ```

2. Read context:
   ```bash
   cat CONTEXT.md
   ```

3. Start server:
   ```bash
   python3 -m http.server 8081
   ```

4. Pull latest from GitHub (if working from another machine):
   ```bash
   cd /home/chaps/projects
   git pull origin main
   ```

---

## 🔗 Related Projects in Repository

In the same `projects` repo:
- `file-organizer/` - CLI file organizer
- `file-organizer-web/` - Web UI file organizer
- `terminal-quest/` - This game!

All in one place on GitHub!

---

## 🎮 Quick Links

**Local Game:** http://localhost:8081
**GitHub Repo:** https://github.com/chaps843/projects
**Terminal Quest:** https://github.com/chaps843/projects/tree/main/terminal-quest

**Documentation:**
- [Context & Architecture](CONTEXT.md)
- [Session Recovery Guide](SESSION_RECOVERY.md)
- [What's New in v2.0](WHATS_NEW.txt)
- [Mission Guide](MISSION_GUIDE.md)
- [Extension Guide](EXTEND.md)

---

## ✅ Verification

To verify everything is backed up:

```bash
# Check local files exist
ls -la /home/chaps/projects/terminal-quest/

# Check git status
cd /home/chaps/projects
git status

# Check GitHub (requires internet)
git remote -v
git fetch origin
git status
```

If all pass, your work is safely backed up!

---

**Last Updated:** 2025-11-09
**Commit:** 1dcb261
**Status:** ✅ Live on GitHub
