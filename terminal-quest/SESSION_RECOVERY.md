# Session Recovery Guide

If you're starting a new session and want to continue working on Terminal Quest, follow these steps:

## 🔄 Quick Recovery (30 seconds)

```bash
# 1. Navigate to project
cd /home/chaps/terminal-quest

# 2. Start the game server
python3 -m http.server 8081

# 3. Open browser to http://localhost:8081

# 4. Read CONTEXT.md for full project details
cat CONTEXT.md
```

That's it! The game is running and ready.

---

## 📖 What To Tell Your AI Assistant

When starting a new session, say:

> "Please read /home/chaps/terminal-quest/CONTEXT.md and /home/chaps/terminal-quest/ROADMAP.md to understand the Terminal Quest project we've been building. It's a browser-based Linux learning game with 15 missions. I want to continue development."

The AI will then have full context of:
- What Terminal Quest is
- How it's architected
- What features exist
- What bugs were fixed
- What's planned next

---

## 📂 Project Structure Quick Reference

```
/home/chaps/terminal-quest/
├── index.html          # Main game interface
├── styles.css          # UI styling
├── game.js             # Game engine (1,345 lines)
│
├── CONTEXT.md          # ⭐ READ THIS FIRST
├── README.md           # Project overview
├── ROADMAP.md          # Future plans
├── EXTEND.md           # Developer guide
│
├── WHATS_NEW.txt       # v2.0 changelog
├── MISSION_GUIDE.md    # All missions
├── COMMAND_USAGE.txt   # Command reference
│
└── [other docs...]
```

---

## 🎯 Current Status

**Version:** 2.0
**Status:** Fully functional, production-ready
**Missions:** 15 complete
**Commands:** 17 working
**Total XP:** 5,000
**Gameplay:** ~2 hours

**Latest Changes:**
- Added 10 new missions (6-15)
- Implemented grep, find, head, tail, wc
- Added pipe (|) support
- Added redirection (>, >>)
- Added wildcard (*) support
- Fixed subdirectory navigation bugs
- Improved error messages

---

## 🔍 Common Tasks

### Run the Game
```bash
cd /home/chaps/terminal-quest
python3 -m http.server 8081
# Visit http://localhost:8081
```

### Edit Game Code
```bash
# Main game logic
nano game.js

# Styling
nano styles.css

# HTML structure
nano index.html
```

### Test Changes
1. Edit files
2. Refresh browser (Ctrl+Shift+R)
3. Test in game
4. Commit if working

### Add New Mission
See EXTEND.md for detailed guide:
```bash
cat EXTEND.md | grep -A 30 "Adding New Missions"
```

### View Git History
```bash
cd /home/chaps/terminal-quest
git log --oneline
git show HEAD
```

---

## 🐛 Known Issues

None currently! All bugs from previous session were fixed:
- ✅ Subdirectory navigation
- ✅ Error messages improved
- ✅ Objective tracking working

---

## 🚀 Next Steps (If Continuing Development)

Based on ROADMAP.md, potential next features:

**High Priority:**
- Add 5 more missions (16-20)
- Implement chmod/chown
- Add more achievements
- Improve pipe handling for edge cases

**Medium Priority:**
- Add ps/kill commands
- Implement tab completion
- Add command history (up/down arrows)
- Mobile UI improvements

**Low Priority:**
- Sound effects
- Theme switcher
- Export progress
- Leaderboards

---

## 🔐 Git & Backup

**Current Git Status:**
```
Repository: /home/chaps/terminal-quest/.git
Branch: master
Latest commit: Terminal Quest v2.0
Files tracked: 16
Status: Clean working directory
```

**To Push to GitHub:**
```bash
# Create repo on GitHub first, then:
cd /home/chaps/terminal-quest
git remote add origin https://github.com/YOUR_USERNAME/terminal-quest.git
git branch -M main
git push -u origin main
```

**To Create Backup:**
```bash
# Tar backup
tar -czf terminal-quest-backup.tar.gz terminal-quest/

# Or copy to another location
cp -r /home/chaps/terminal-quest /path/to/backup/
```

---

## 📞 Getting Help

**If Something Breaks:**
1. Read error message carefully
2. Check browser console (F12)
3. Review CONTEXT.md for architecture
4. Check git log for recent changes
5. Ask AI for help with specific error

**If You Forget How Something Works:**
1. Read CONTEXT.md (architecture)
2. Read EXTEND.md (development guide)
3. Read relevant section in ROADMAP.md
4. Check inline comments in game.js

---

## ✅ Verification Checklist

Before considering project "recovered":

- [ ] Can navigate to /home/chaps/terminal-quest
- [ ] Can start server with python3 -m http.server 8081
- [ ] Game loads in browser at localhost:8081
- [ ] Can read CONTEXT.md successfully
- [ ] Git repository intact (git log works)
- [ ] Can complete Mission 1-5 (original missions)
- [ ] Can start Mission 6 (new content)

If all checked, you're ready to continue!

---

## 📝 Session Notes Template

When starting work, create a note:

```markdown
# Session [DATE]

## Goals Today
- [ ] Goal 1
- [ ] Goal 2

## Changes Made
- Change 1
- Change 2

## Issues Encountered
- Issue 1 and how solved

## Next Session
- What to work on next
```

---

## 🎮 Quick Test Commands

To verify game works:

```bash
# In terminal
cd /home/chaps/terminal-quest
python3 -m http.server 8081

# In browser at http://localhost:8081
ls              # Should list files
pwd             # Should show /home/user
cd documents    # Should work
ls              # Should show report.txt, notes.txt
cd ..           # Go back
grep ERROR logs/server.log  # Should show error lines
```

If all work, game is functioning correctly.

---

## 💾 Save Points

**Auto-saved:**
- Player progress (localStorage)
- XP and level
- Mission completion
- Achievements

**Manually saved:**
- All code files (git)
- Documentation (git)
- Project structure (filesystem)

**Not saved:**
- Server state (restart each session)
- Browser cache (can clear)

---

## 🎯 Remember

**The game is complete and functional as-is!**

You can:
- Play all 15 missions
- Learn real Linux commands
- Share with others
- Deploy publicly
- Continue development (optional)

**Location:** `/home/chaps/terminal-quest/`
**Key File:** `CONTEXT.md` (read this first in new sessions)
**Status:** Production-ready v2.0

---

**Good luck, and happy coding!** 🚀
