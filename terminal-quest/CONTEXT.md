# Terminal Quest - Development Context

## Project Overview

**Terminal Quest** is a gamified, browser-based Linux terminal learning platform. Players complete story-driven missions to master command-line skills through interactive gameplay.

## 🚨 IMPORTANT: Development Guidelines for AI Agents

### GitHub Backup Protocol

**ALWAYS ask the user at project completion:**
> "Would you like me to commit this to git and push to your GitHub projects repository?"

**Never assume** - always confirm before:
- Creating git repositories
- Committing code
- Pushing to GitHub
- Making any Git-related actions

This ensures:
- User maintains control over their repositories
- Nothing is missed or forgotten
- Proper backup procedures are followed
- User can decide timing of commits/pushes

### Launch Script Protocol

**For any web-based project, ALWAYS create a launch script:**
- Named `./launch` in project root
- Makes starting the project easy
- Includes proper port handling
- Documents in README how to use it

Example for user:
```bash
./launch        # Start the project
./launch stop   # Stop the project
```

## Current Status: v2.10.0 (Per-Objective XP System with Hint/Copy Penalties)

### Session History

#### Session 1: Initial Build (v1.0)
- Created complete web-based game with virtual terminal
- Implemented 5 beginner missions
- Built virtual filesystem with 10 commands
- Added XP/leveling system with achievements
- Created beautiful cyberpunk UI
- Zero dependencies - pure HTML/CSS/JS

#### Session 2: Major Expansion (v2.0)
- Added 10 new missions (6-15)
- Implemented 7 new commands (grep, find, head, tail, wc)
- Added pipe operator (|) support
- Added output redirection (>, >>)
- Added wildcard (*) support
- Expanded filesystem with logs/, projects/, more files
- Fixed filesystem navigation bugs
- Improved error messages with usage examples
- Created comprehensive documentation

#### Session 3: UI/UX Enhancement (v2.1-2.2.1)
- Removed $_ from title, cleaner branding
- Removed standalone hints section from UI
- Converted "Details" to "Hint" buttons per objective
- Implemented 50% XP penalty for using hints
- Removed exact commands from all objective text
- Expanded all 15 missions to exactly 5 objectives each
- Added 35 new objectives across missions
- Increased playtime from ~2 hours to ~4 hours
- Made learning more challenging and rewarding

#### Session 4: Command Variety (v2.3.0)
- Added command variety to 8 missions (4, 5, 6, 7, 8, 9, 10, 12)
- Introduced 10+ command variations previously in reference but unused
- Added rm (file deletion) - was completely missing
- Added grep flags: -c (count), -i (case-insensitive), -n (line numbers), -v (inverse)
- Added find types: -type f (files only), -type d (directories only)
- Added wc -w (word count) in addition to wc -l
- Fixed Mission 7 bug (incomplete objective)
- 100% alignment between reference sections and taught commands
- Enhanced learning variety - no more repetitive commands

#### Session 5: Review Missions (v2.4.0)
- Added 4 review missions for comprehensive skill verification
- Review 1 after Mission 5: 12 objectives testing basics (navigation, file viewing, operations)
- Review 2 after Mission 11: 15 objectives testing search/analysis (grep, find, pipes, redirection)
- Review 3 after Mission 17: 15 objectives testing advanced operations (wildcards, complex navigation)
- Final Review (Mission 19): 25 objectives comprehensive mastery assessment
- Total missions increased from 15 to 19
- Total objectives increased from 75 to 142
- Reviews reinforce learning after every 5 missions
- Higher XP rewards for reviews (500-1500 XP)
- Improved knowledge retention and skill validation

#### Session 6: UX Polish & Navigation (v2.4.1-2.5.2)
- **v2.4.1**: Fixed review mission starting directories - removed redundant "navigate home" objectives
- **v2.4.1**: Clarified objective text to specify exact filenames (e.g., "Create config_backup.txt" instead of "Create a backup")
- **v2.4.2**: Implemented scrollable objectives section with fixed command reference at bottom
- **v2.4.3-2.4.4**: Added mission navigation arrows (< 2/19 >) to revisit completed missions
- **v2.4.5**: Auto-scroll objectives to top when loading new missions
- **v2.4.6**: Multi-column command reference layout (2 columns) for better space utilization
- **v2.4.7**: Auto-scroll to next objective as you complete them
- **v2.4.8**: Added tilde (~) shortcut to command references (Review 1 & Mission 7)
- **v2.4.9**: Fixed tilde path expansion bug - `cd ~/logs` now works correctly
- **v2.5.0**: Implemented grep flags (-c, -i, -n, -v) - all grep commands now functional
- **v2.5.1**: Redesigned Mission 8 - replaced redundant head/tail with wc (word count) command
- **v2.5.2**: Added "Restart Mission" button below mission panel for quick mission retry
- Total objectives reduced to 138 (cleaned up redundant navigation steps)
- Mission audit completed - eliminated redundancy while teaching new concepts
- Dramatically improved UX for review missions with many objectives
- Clean, intuitive navigation system

#### Session 7: TAB Autocompletion (v2.6.0)
- **v2.6.0**: Implemented full TAB autocompletion functionality
- Command completion: Type `gr` + TAB → `grep `
- File/directory completion: Type `cd doc` + TAB → `cd documents/`
- Path completion: Works with relative and absolute paths
- Multiple match handling: Shows all options when multiple matches found
- Smart directory detection: Adds trailing slash for directories
- Tilde expansion support: `~/doc` + TAB works correctly
- Authentic terminal experience with real bash-like autocompletion

#### Session 8: Restart Mission Bug Fix (v2.6.1)
- **v2.6.1**: Fixed restart mission bug that was resetting all future missions
- Added `gameState.completedMissions` array to track specific completed missions
- Created new `restartMission()` function for proper mission reset
- Updated `loadMission()` to preserve completion status of finished missions
- Updated save/load system to persist completed missions array
- Restarting a mission now only affects that mission, not future ones
- Navigating to completed missions shows all objectives as done
- Major UX improvement for mission replay and review

#### Session 9: Free Roaming Commands (v2.7.0-2.7.6)
- **v2.7.0**: Implemented free roaming commands for navigation flexibility
- Always allow: `cd`, `pwd`, `ls`, `clear`, `help`, `man` regardless of objective
- Three-color command feedback system:
  - 🟢 Green: Completes objective (awards XP)
  - 🟡 Yellow: Free roaming (executes but doesn't complete objective)
  - 🔴 Red: Incorrect command (doesn't execute)
- Solves "stuck in wrong directory" problem after mission restart
- Players can navigate freely while still following structured learning
- More realistic terminal experience
- Encourages exploration without penalty
- Major UX improvement for mission flexibility
- **v2.7.1**: Fixed TAB completion trailing slash bug
- Created `normalizeCommand()` function to strip trailing slashes
- TAB-completed directories now match objectives correctly
- `cd documents/` now matches objective expecting `cd documents`
- Users can freely use TAB completion without penalty
- Updated `changeDirectory()` to strip trailing slashes before filesystem lookup
- Complete end-to-end TAB completion functionality
- **v2.7.2**: Implemented smart mission progression
- Created `findNextIncompleteMission()` function
- After completing mission, jumps to first incomplete mission (not just +1)
- Replaying old missions now seamlessly returns to current progress
- Perfect for practice and skill review
- **v2.7.3**: Implemented path equivalence matching
- Created `commandsAreEquivalent()` function for flexible path comparison
- `cd logs` now matches objectives expecting `cd ~/logs`
- Handles relative vs absolute paths intelligently
- Tilde expansion normalized for comparison
- Users can navigate using any valid path format
- **v2.7.4**: Complete mission restart with filesystem snapshots
- Added `filesystemSnapshots` to gameState for mission-specific filesystem backups
- Created `saveFilesystemSnapshot()` to capture state before each mission starts
- Created `restoreFilesystemSnapshot()` to restore filesystem when restarting
- Restarting a mission now:
  - Resets filesystem to state before that mission (preserves previous work)
  - Resets current directory to mission's starting directory
  - Updates prompt to reflect new location
  - Auto-focuses terminal for immediate play
- Preserves work done in previous missions while fully resetting current mission
- Perfect mission restart experience
- **v2.7.5**: Mission cleanup and polish
- Removed 4 redundant "return home" objectives (Missions 9, 10, 14, 17)
- Fixed Mission 9 objective 2 text clarity ("manager" vs "managers")
- Made Mission 10 objective 1 more intuitive and clear
- Reduced total objectives from 138 to 134
- Streamlined mission flow
- Eliminated busywork navigation steps
- **v2.7.6**: Find command -type flag support
- Implemented `-type` flag for `find` command (was missing!)
- `find . -type d` now works correctly (find directories only)
- `find . -type f` now works correctly (find files only)
- Updated `find()` function to handle both `-name` and `-type` flags
- Updated `man find` documentation to include `-type` option
- Fixed Mission 10 Objective 2 bug (was showing error despite completing)
- Complete find command functionality matching real Linux behavior
- **v2.7.7**: Mission 11 pedagogy improvement (pipes tutorial)
- Completely redesigned Mission 11 for beginner-friendly pipe learning
- Changed from 5 complex objectives to step-by-step learning progression
- Objective 1-2: Learn grep alone, then grep with pipe (see transformation)
- Objective 3-4: Learn find alone, then find with pipe (understand limiting)
- Objective 5: Practice combining commands with confidence
- Enhanced story to explain pipes conceptually before using them
- Improved all objective details to guide learners step-by-step
- Better hints explaining "command1 | command2" mental model
- Major improvement for first-time pipe users
- Addresses feedback: "No way as a beginner I would know this command"
- **v2.7.8**: Mission 11 fix & hint UX improvement
- Added `startDir: '/home/user'` to Mission 11 to fix "No such directory" error
- Mission 11 Objective 1 now works correctly from the start
- Created `closeHintPopup()` function for consistent hint closing behavior
- Added auto-focus to terminal input after closing hint popup
- Clicking X or overlay background now both focus terminal automatically
- Same UX behavior as "Restart Mission" button
- Improved workflow: View hint → Close popup → Immediately type command
- No more manual clicking back to terminal after viewing hints
- **v2.7.9**: REVERTED - Accidentally re-added redundant navigation objective
- **v2.8.0**: Mission 11 filesystem validation (proper fix)
- Removed redundant `cd ~` objective (we eliminated those in v2.7.5!)
- Added filesystem validation when Mission 11 loads
- Checks if `logs/` directory exists before mission starts
- If logs directory is missing/corrupted, restores fresh filesystem automatically
- Displays "Filesystem restored for this mission" message when restoration occurs
- Mission 11 back to 5 objectives (proper pipe tutorial)
- Proper fix without adding busywork navigation steps
- Works reliably regardless of previous mission modifications
- **v2.8.1**: readFile path support - THE ACTUAL ROOT CAUSE FIX!
- **FOUND THE BUG**: `readFile()` only looked in current directory, didn't handle paths
- `grep ERROR logs/server.log` failed because readFile couldn't parse `logs/server.log`
- Fixed `readFile()` to handle relative paths like `logs/server.log` and `documents/report.txt`
- Now uses `getNode()` to navigate directory structure when path contains `/`
- Handles both absolute paths (`/home/user/logs/server.log`) and relative (`logs/server.log`)
- Simple filenames still work as before (`server.log` when in logs directory)
- **This was the real issue all along** - not filesystem corruption, but path parsing!
- Mission 11 and ALL commands using files with paths now work correctly
- **v2.8.2**: Mission 11 objective text polish
- Changed Objective 5 from "Count how many developer users exist" to "Count how many developers exist"
- More natural and clearer phrasing
- Prevents confusion (user tried `grep -c developer users users.txt` with "users" as pattern)
- **v2.9.0**: Complete objective clarity overhaul - MAJOR UX IMPROVEMENT
- Conducted comprehensive audit of all 199 objectives across 19 missions
- **Found 36 objectives (18%) with unclear file references**
- Fixed ALL 36 objectives to explicitly specify file locations
- Added location markers: "(in home)", "(in current directory)", "(in logs directory)"
- Mission 4: 5 objectives fixed (all files in home)
- Mission 6: 3 objectives fixed (documents directory context)
- Mission 7: 3 objectives fixed (logs directory context)
- Mission 8: 4 objectives fixed (all files in home)
- Mission 9: 2 objectives fixed (file location clarity)
- Mission 11: 1 objective fixed (users.txt location)
- Mission 12 (Review 2): 5 objectives fixed - **addresses user's reported confusion!**
- Mission 17: 1 objective fixed (users.txt source clarity)
- Mission 18: 1 objective fixed (current directory context)
- Mission 19: 5 objectives fixed (multiple file switches clarified)
- **Eliminates confusion when objectives switch between files without warning**
- Players now always know exactly which file to use
- Major improvement to learning experience and reduces frustration
- **v2.9.1**: Mission 7 & 12 location context corrections
- Fixed Mission 7: Changed "(in logs directory)" to "(in current directory)" after cd
- Fixed Mission 12: Changed "(in logs directory)" to "(in current directory)" since mission starts there
- Extended filesystem validation to Mission 7 and 12 (not just Mission 11)
- Added missionsNeedingLogs array [6, 10, 11] for Mission 7, 11, 12 validation
- Ensures logs directory exists before missions that need it start
- More accurate location descriptions matching actual starting directory
- User reported: "it mentions logs directory but I'm already in logs" - FIXED!
- **v2.9.2**: Review 2 (Mission 12) Objective 6 text clarity
- Changed from "Return home and find all .txt files" to simply "Return home"
- Objective 6 is just `cd ~` navigation, Objective 7 does the actual find
- Prevents confusion about what the objective expects
- User feedback: objective text was describing next objective, not current one
- **v2.9.3**: Review 2 (Mission 12) Objective 12 pipe practice clarity
- Changed from "Count total words in message.txt" to "Use cat and pipe to count words in message.txt"
- Makes it explicit that the objective is testing pipe skills, not just word counting
- User feedback: "wc -w message.txt would work but it wants cat | wc -w - should be clearer"
- This is a Review mission testing pipes from Mission 11, so objective should be explicit about practicing pipes
- Updated details to explain: "Practice piping! Use cat to output, then pipe to wc -w"
- **v2.9.4**: Review 2 (Mission 12) Objectives 13-14 detailed guidance for redirection preview
- **FOUND MAJOR ISSUE**: Objectives 13-14 test output redirection (Mission 13 content) BEFORE Mission 13!
- User feedback: "needs way more explanation on how to accomplish that. Uses things we haven't covered"
- Command uses wildcards with paths (logs/*.log) and output redirection (>) - NOT taught yet!
- Added comprehensive step-by-step explanations in details
- Labeled as "NEW SKILL - Output Redirection!" to set expectations
- Breaks down: 1) wildcard matching, 2) pipe, 3) redirect operator
- Updated mission story to mention "last two objectives preview Mission 13"
- Teaches ahead with excellent guidance rather than removing objectives
- Students now understand they're learning something new, not just reviewing
- **v2.9.5**: Add wildcard expansion to grep + copy button in hints
- **CRITICAL BUG FIX**: `grep ERROR logs/*.log` failed - grep couldn't handle wildcards!
- User feedback: "second to last objective returned error 'cat: logs/*.log: No such file or directory'"
- Root cause: grep() only read single files, treated "logs/*.log" as literal filename
- Implemented wildcard expansion in grep - now expands *.log to all matching files
- Searches across multiple files, prefixes output with filename (like real grep)
- Added copy button to hint popup - click 📋 to copy command to clipboard
- Button shows "Copied!" feedback for 2 seconds, supports Ctrl+V paste
- Improved UX: no need to manually type long commands from hints
- **v2.10.0**: Complete XP system redesign with per-objective rewards and penalties
- **MAJOR SYSTEM OVERHAUL**: Each objective now has individual baseXP value
- User feedback: "each objective should be worth XP, hint loses 50%, copy loses 75%"
- Added baseXP field to all 134 objectives across 19 missions
- XP values: simple commands (10-20), file ops (15-25), grep (25-40), pipes (40-55), complex (50-60)
- Hint usage: 50% XP penalty per objective (not per mission!)
- Copy usage: 75% XP penalty per objective
- Per-objective tracking: hintUsed and copyUsed flags
- Real-time feedback: "⚠️ Hint used for objective X - will lose Y XP"
- Completion messages show earned XP with penalty explanation
- Mission completion bonus now separate from objective XP (always full bonus)
- Updated "no_hints" achievement to check both hints AND copy buttons
- Fixed copy button escaping bug for commands with quotes (used data attributes)
- Removed global `hintUsedThisMission` flag - now tracked per objective
- System encourages learning without help while still providing support when needed

### Project Stats

**Code:**
- game.js: 2,635 lines
- styles.css: 1,251 lines
- index.html: 222 lines
- **Total:** 4,108 lines of code

**Content:**
- 19 missions (134 total objectives)
- 17 working commands
- 12 achievements
- 8,000 total XP
- ~6-7 hours gameplay

**Size:**
- Total project: ~160KB
- Zero dependencies
- Works offline

## Technical Architecture

### Core Components

**1. VirtualFileSystem (game.js:152-301)**
- Simulates Linux filesystem in browser memory
- Methods: getNode, listFiles, readFile, changeDirectory, createFile, etc.
- Supports nested directories
- Handles all file operations

**2. CommandProcessor (game.js:572-900+)**
- Parses and executes terminal commands
- Handles pipes (|) and redirection (>, >>)
- Tracks command usage statistics
- Validates arguments and provides helpful errors

**3. Mission System (game.js:38-367)**
- 15 story-driven missions
- Objective tracking with completion detection
- Hint system (3 hints per mission)
- Progressive XP rewards

**4. Achievement System (game.js:30-37)**
- 12 unlockable achievements
- Triggered by specific actions
- Popup notifications
- XP rewards

**5. UI System (game.js:1000+)**
- Terminal input/output
- Mission panel with objectives
- Profile and stats tracking
- Achievement gallery
- Save/load with localStorage

### Commands Implemented

**Navigation:**
- `ls` (with wildcard support)
- `pwd`
- `cd`

**File Operations:**
- `cat`
- `touch`
- `mkdir`
- `cp` (with wildcards)
- `mv`
- `rm`

**Search & Filter:**
- `grep` (pattern search)
- `find` (file search)
- `head` (view start)
- `tail` (view end)
- `wc` (count lines/words)

**Advanced:**
- `|` (pipe operator)
- `>` (output redirection)
- `>>` (append redirection)
- `*` (wildcard matching)
- `man` (manual pages)
- `help` (command list)
- `echo` (print text)
- `clear` (clear screen)

### Filesystem Structure

```
/home/user/
├── documents/
│   ├── report.txt
│   └── notes.txt
├── logs/
│   ├── server.log (contains ERROR entries)
│   ├── access.log (user login data)
│   └── error.log
├── projects/
│   └── website/
│       ├── index.html
│       └── style.css
├── message.txt
├── test.txt
├── users.txt (user role data)
├── config.txt (server config)
└── data.txt (10 lines of data)
```

## Known Issues & Fixes Applied

### Bug Fixes in Session 2

**Issue 1: Subdirectory Navigation**
- Problem: `cd documents` worked, but `ls` and `touch` failed inside subdirectories
- Cause: getNode() wasn't properly handling nested paths
- Fix: Rewrote getNode() to start at /home/user and parse relative paths correctly
- Status: ✅ Fixed

**Issue 2: Confusing Error Messages**
- Problem: `cp test.txt` gave generic "missing file operand" error
- Cause: No usage examples in error messages
- Fix: Added detailed error messages with syntax and examples for all commands
- Status: ✅ Fixed

**Issue 3: Mission Objective Tracking**
- Problem: Some objectives weren't completing
- Cause: Strict command matching
- Fix: More flexible matching that checks command base
- Status: ✅ Fixed

## Mission Progression

### Beginner Track (M1-5) - 850 XP
1. **First Day**: ls, pwd
2. **Exploration**: cd, navigation
3. **File Creation**: touch, mkdir
4. **Reading Files**: cat
5. **File Operations**: cp, mv, rm

### Intermediate Track (M6-10) - 1,500 XP
6. **Search and Discover**: grep basics
7. **File Viewing**: head, tail
8. **Power Search**: advanced grep
9. **Finding Files**: find command
10. **Pipes**: Command chaining

### Advanced Track (M11-15) - 2,650 XP
11. **Output Redirection**: >, >>
12. **Wildcards**: * patterns
13. **Directory Mastery**: Complex paths
14. **Combining Skills**: Real-world scenario
15. **Final Challenge**: Complete audit (1000 XP)

## Files in Project

**Core Game Files:**
- `index.html` - Main game interface
- `styles.css` - UI styling
- `game.js` - Game engine and logic

**Documentation:**
- `README.md` - Project overview
- `QUICKSTART.md` - 30-second tutorial
- `FEATURES.md` - Feature highlights
- `ROADMAP.md` - Future development plans
- `EXTEND.md` - Developer guide
- `PRESENTATION.md` - Complete presentation
- `LAUNCH.txt` - Quick reference
- `START_HERE.txt` - Getting started card
- `WHATS_NEW.txt` - v2.0 changelog
- `MISSION_GUIDE.md` - Mission walkthrough
- `COMMAND_USAGE.txt` - Command reference
- `CONTEXT.md` - This file

**Testing:**
- `test-filesystem.html` - Filesystem unit tests

## How to Run

### Local Development
```bash
cd /home/chaps/terminal-quest
python3 -m http.server 8081
# Open browser to http://localhost:8081
```

### Production Deployment
- Upload all files to web server
- OR use GitHub Pages
- OR use Netlify/Vercel
- No build process needed - pure static files

## Development Guidelines

### Adding New Missions
See `EXTEND.md` for detailed instructions.

Quick template:
```javascript
{
  id: 16,
  title: 'Mission Title',
  story: 'Story context...',
  objectives: [
    { text: 'Do something', completed: false, command: 'command' }
  ],
  hints: ['Hint 1', 'Hint 2'],
  reference: {
    'command': 'Description'
  },
  xpReward: 300
}
```

### Adding New Commands
1. Add case to switch statement in process()
2. Implement command method
3. Update help() text
4. Add man page entry
5. Test thoroughly

### Code Style
- 2-space indentation
- camelCase for functions
- Clear comments
- ES6+ JavaScript
- No external dependencies

## Future Enhancements (Roadmap)

### Phase 2 (Planned)
- chmod/chown (permissions)
- ln (symbolic links)
- ps/kill (process management)
- More advanced grep options
- Environment variables

### Phase 3 (Planned)
- Bash scripting challenges
- sed/awk text processing
- tar/gzip compression
- ssh simulation
- User management

### Phase 4 (Ideas)
- Multiplayer leaderboards
- Custom mission creator
- Mobile app version
- Achievements expansion
- Dark/light themes

## Testing Checklist

Before deploying:
- [ ] All 15 missions completable
- [ ] All commands work correctly
- [ ] Error messages are helpful
- [ ] Filesystem navigation works
- [ ] Pipes work correctly
- [ ] Redirection works correctly
- [ ] Wildcards work correctly
- [ ] Save/load preserves progress
- [ ] XP and leveling work
- [ ] Achievements unlock properly
- [ ] Responsive on mobile
- [ ] Works in all major browsers

## Browser Compatibility

Tested and working:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ⚠️ Safari (should work, not tested)
- ⚠️ Mobile browsers (should work, not fully tested)

## Performance Metrics

- Load time: <1 second
- Command execution: <50ms
- Memory usage: <50MB
- Works on 5-year-old hardware

## Credits

**Created by:** AI Agent (OpenCode)
**For:** Linux terminal education
**License:** Free to use and modify
**Purpose:** Make learning Linux fun and engaging

## Session Recovery

If continuing development in a new session:

1. **Navigate to project:**
   ```bash
   cd /home/chaps/terminal-quest
   ```

2. **Start server:**
   ```bash
   python3 -m http.server 8081
   ```

3. **Review this file** for context

4. **Check ROADMAP.md** for next features

5. **Read EXTEND.md** for development guide

## Important Notes

- All player progress saves to localStorage
- Clearing browser cache resets progress
- No server-side code needed
- Works completely offline
- Safe to share - no sensitive data

## Quick Commands Reference

**Development:**
```bash
# Start game
python3 -m http.server 8081

# Count lines of code
wc -l *.js *.css *.html

# Test filesystem
open test-filesystem.html
```

**Git:**
```bash
# Initialize (already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - v2.0"

# Push to GitHub (if desired)
git remote add origin <url>
git push -u origin master
```

## Contact & Support

This is an educational project. Feel free to:
- Modify and extend
- Use in teaching
- Deploy publicly
- Share with others
- Create derivatives

No attribution required, but appreciated!

---

**Last Updated:** 2025-11-13
**Version:** 2.9.3
**Status:** Fully functional, production-ready, precise objective expectations
**Next Steps:** See ROADMAP.md

## Recent UX Improvements (v2.4.1-2.5.2)

### Mission Navigation System
- Clean navigation arrows appear only when usable: `< 5/19 >`
- Go back to replay any completed mission
- Cannot skip ahead to uncompleted missions
- Smooth transitions with terminal feedback

### Scrollable Objectives
- Objectives section scrolls independently
- Command Reference always visible at bottom (no scrolling needed)
- Auto-scrolls to top when loading new missions
- Auto-scrolls to next objective as you complete them
- Perfect for review missions with 10-15+ objectives

### Multi-Column Command Reference
- 2-column layout for space efficiency
- Review missions with 11 commands now take ~7 lines instead of 12
- More room for objectives to be visible
- Responsive: single column on smaller screens

### Clear Objective Text
- All objectives specify exact filenames when needed
- Example: "Create config_backup.txt" not "Create a backup"
- Reduces confusion and unnecessary hint usage
- Users know exactly what's expected

### TAB Autocompletion (v2.6.0)
- Press TAB to autocomplete commands and paths
- **Command completion**: Type partial command + TAB (e.g., `gr` → `grep`)
- **File completion**: Type partial filename + TAB (e.g., `cat mes` → `cat message.txt`)
- **Directory completion**: Auto-adds trailing slash (e.g., `cd doc` → `cd documents/`)
- **Path navigation**: Works with relative paths (`./doc` → `./documents/`)
- **Absolute paths**: Works with full paths (`/home/us` → `/home/user/`)
- **Tilde expansion**: Supports `~` shortcut (`~/doc` → `~/documents/`)
- **Multiple matches**: Shows all matching options when ambiguous
- **Smart context**: Knows when to complete commands vs. file arguments
- Authentic bash-like terminal experience
