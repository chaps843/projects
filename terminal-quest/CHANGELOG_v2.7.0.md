# Terminal Quest v2.7.0 - Free Roaming Commands

## Release Date: November 13, 2025

## 🗺️ New Feature: Free Roaming Navigation

This release adds free roaming navigation, allowing players to explore and navigate freely during missions without getting stuck!

### The Problem

The game was too restrictive - you could ONLY type the exact command for the next objective:

**Example of getting stuck:**
1. You're in `/home/user/projects/website`
2. You restart Mission 1
3. Objective: "List files in home directory" (expects `ls` in `/home/user`)
4. **Problem**: You can't run `cd ~` to get back home!
5. Result: Stuck and frustrated ❌

### The Solution: Free Roaming Commands

Certain "navigation and exploration" commands are now **always allowed**, regardless of the current objective.

#### Free Roaming Commands
- `cd` - Navigate directories
- `pwd` - Check current location
- `ls` - List files (exploration)
- `clear` - Clear terminal screen
- `help` - Show available commands
- `man` - View manual pages

These commands execute successfully and help you explore, but they don't complete objectives (unless they ARE the objective).

### Three-Color Command System

Commands now display in **three different colors** for clear feedback:

#### 🟢 Green - Objective-Completing Command
- The exact command needed for the current objective
- **Completes the objective** and awards XP
- Example: Typing `ls` when objective is "List files in home directory"

#### 🟡 Yellow - Free Roaming Command
- Allowed anytime for navigation/exploration
- **Executes successfully** but doesn't complete objective
- No XP awarded (unless it's actually the objective)
- Example: Typing `cd ~` or `pwd` at any time

#### 🔴 Red - Incorrect Command
- Not the objective command AND not a free roaming command
- **Does NOT execute**
- Shows error: "Command does not match current objective"
- Example: Typing `cat file.txt` when objective is "Navigate to logs"

### How It Works

```javascript
// System checks if command is free roaming
const freeRoamingCommands = ['cd', 'pwd', 'ls', 'clear', 'help', 'man'];
if (freeRoamingCommands.includes(command)) {
  // Execute and show in yellow!
  return true;
}
```

### Benefits

✅ **Never Get Stuck** - Always navigate back to where you need to be
✅ **Realistic Terminal** - Feels like actual Linux command line
✅ **Encourage Exploration** - Look around without penalty
✅ **Better Learning** - Check location/files anytime
✅ **Less Frustration** - No artificial restrictions
✅ **Clear Feedback** - Three colors show command status instantly

### Use Case Examples

#### Example 1: Restart After Exploration
```bash
# You're lost in subdirectories, restart mission
~/projects/website/assets$ cd ~     # ← 🟡 Yellow (free roaming)
~$ pwd                               # ← 🟡 Yellow (checking location)
/home/user
~$ ls                                # ← 🟢 Green (completes objective!)
documents  logs  message.txt  ...
```

#### Example 2: Check Documentation Mid-Mission
```bash
# Forgot how grep works during Mission 6
~$ man grep                          # ← 🟡 Yellow (free roaming)
[Shows grep manual page]
~$ grep ERROR logs/server.log        # ← 🟢 Green (completes objective!)
```

#### Example 3: Explore Then Continue
```bash
# Curious about filesystem structure
~$ cd projects                       # ← 🟡 Yellow (exploration)
~/projects$ ls                       # ← 🟡 Yellow (seeing what's there)
website
~/projects$ cd ~                     # ← 🟡 Yellow (back to home)
~$ cat message.txt                   # ← 🟢 Green (completes objective!)
```

### Technical Details

**Modified Functions:**
- `willCommandMatchObjective()` - Added free roaming command check
- Terminal input handler - Three-way color classification based on command type

**New CSS:**
- `.command-neutral` - Gold/yellow color (#ffd700) for free roaming commands

**Code Changes:**
- game.js: +15 lines
- styles.css: +8 lines
- **Total:** 3,964 lines (+23)

**Lines of Code:**
- game.js: 2,491 lines (+15)
- styles.css: 1,251 lines (+8)
- index.html: 222 lines (unchanged)

### User Experience Improvements

**Before (v2.6.1):**
- Only exact objective command allowed
- Any other command = RED error
- Could get stuck in wrong directory
- Frustrating for exploration

**After (v2.7.0):**
- Navigation always available
- Clear visual feedback (3 colors)
- Exploration encouraged
- Never stuck, always can recover

### Testing Scenarios

All scenarios work correctly:

**Test 1: Mission Restart ✅**
1. Navigate to `/home/user/projects/website`
2. Restart Mission 1
3. Type `cd ~` → Yellow, executes
4. Type `ls` → Green, completes objective

**Test 2: Free Exploration ✅**
1. Mission expects `cat message.txt`
2. Type `pwd` → Yellow
3. Type `ls` → Yellow
4. Type `cd documents` → Yellow
5. Type `cd ..` → Yellow
6. Type `cat message.txt` → Green

**Test 3: Help Anytime ✅**
1. Any mission
2. Type `help` → Yellow, shows commands
3. Type `man cd` → Yellow, shows manual
4. Type `clear` → Yellow, clears terminal
5. Continue with objective → Green when complete

### Smart Objective Completion

Free roaming commands can STILL complete objectives when they match:

```bash
# Objective: "Check your current directory"
~$ pwd                    # ← 🟢 Green (both free roaming AND the objective!)
/home/user
# Objective completed! +25 XP
```

The system is smart enough to know when a free roaming command is also the answer to the objective.

### Future Enhancements

Potential additions:
- Add more free roaming commands (`echo`, `wc`, etc.)
- "Training mode" with even more freedom
- Configurable free roaming list per mission
- Command usage statistics and insights

### Migration Notes

- **No Breaking Changes**: Works with all existing saves
- **No Data Loss**: All progress preserved
- **Immediate Effect**: Active on all missions instantly
- **Backward Compatible**: Old missions work perfectly

### What's Next

See `ROADMAP.md` for upcoming features:
- More advanced commands (sed, awk)
- Bash scripting challenges
- Permissions system
- Network simulation

---

## Full Changelog

### Added
- Free roaming command system (cd, pwd, ls, clear, help, man)
- Three-color command feedback (green/yellow/red)
- `.command-neutral` CSS class for yellow commands
- Visual distinction between objective and exploration commands

### Changed
- `willCommandMatchObjective()` now allows free roaming commands
- Terminal input handler uses three-way color classification
- Command feedback more informative with color coding

### Fixed
- Can no longer get stuck in wrong directory
- Navigation always available during missions
- Better user experience for exploration

---

**Current Version:** v2.7.0
**Previous Version:** v2.6.1
**Lines Changed:** +23
**Impact:** Major UX improvement
**Breaking Changes:** None

Navigate freely and learn naturally! 🗺️🎮
