# Free Roaming Commands Feature

## Problem Solved

Previously, the game was too restrictive - you could ONLY type the exact command for the next objective. This caused issues like:

### Example Scenario (The Bug)
1. You're working in Mission 1
2. You navigate to `/home/user/projects/website` to explore
3. You restart Mission 1 (which expects you to be in home directory)
4. Objective 1: "List the files in your home directory" (expects `ls`)
5. **Problem**: You can't run `cd ~` to get back home!
6. Result: You're stuck and can't complete the objective

### Root Cause
The game only allowed commands that exactly matched the current objective. Any other command would:
- Show in RED
- Not execute
- Display error: "Command does not match current objective"

This was frustrating and unrealistic - real terminals let you navigate freely!

## Solution: Free Roaming Commands

### What Are Free Roaming Commands?

Commands that are **always allowed** regardless of the current objective:
- `cd` - Navigate directories
- `pwd` - Check current location
- `ls` - List files (exploration)
- `clear` - Clear terminal screen
- `help` - Show available commands
- `man` - View manual pages

These are "navigation and exploration" commands that help you get oriented and move around the filesystem.

### How It Works

#### 1. Command Classification
When you type a command, the system now checks:
```javascript
const freeRoamingCommands = ['cd', 'pwd', 'ls', 'clear', 'help', 'man'];
if (freeRoamingCommands.includes(baseCommand)) {
  return true; // Always allow!
}
```

#### 2. Visual Feedback (3 Colors)
Commands now show in **three different colors**:

**🟢 GREEN** - Objective-completing command
- The exact command needed for the current objective
- Completes the objective and awards XP
- Example: Typing `ls` when objective is "List files"

**🟡 YELLOW** - Free roaming command
- Allowed anytime for navigation/exploration
- Executes successfully but doesn't complete objective
- Doesn't award XP (unless it's actually the objective)
- Example: Typing `cd ~` to navigate home during any mission

**🔴 RED** - Incorrect command
- Not the objective command AND not a free roaming command
- Does NOT execute
- Shows error message
- Example: Typing `cat file.txt` when objective is "Navigate to logs"

#### 3. Smart Objective Completion
- Free roaming commands CAN complete objectives if they match
- Example: If objective is "Check current directory" and you type `pwd`:
  - It's both a free roaming command AND the objective
  - Shows in GREEN (completes objective)
  - Awards XP

### Benefits

✅ **No More Getting Stuck** - Always can navigate back to where you need to be
✅ **Realistic Terminal Experience** - Feels like real Linux
✅ **Encourage Exploration** - Players can look around without penalty
✅ **Better Learning** - Can check location anytime with `pwd`
✅ **Less Frustration** - No artificial restrictions on basic commands

### Use Cases

#### Use Case 1: Restart After Exploration
```bash
# Scenario: Explored other directories, restarted mission
~/projects/website$ cd ~        # ← Yellow (free roaming)
~$ ls                            # ← Green (completes objective!)
```

#### Use Case 2: Check Location Anytime
```bash
# Scenario: Lost in filesystem during mission
~/projects/website/assets$ pwd  # ← Yellow (free roaming)
/home/user/projects/website/assets
~/projects/website/assets$ cd ~  # ← Yellow (free roaming)
~$ ls                            # ← Green (completes objective!)
```

#### Use Case 3: Read Documentation
```bash
# Scenario: Forgot how a command works
~$ man grep                      # ← Yellow (free roaming)
[Shows grep manual]
~$ grep ERROR server.log         # ← Green (completes objective!)
```

### Technical Implementation

**Modified Functions:**
- `willCommandMatchObjective()` - Added free roaming check
- Terminal input handler - Three-way color coding

**New CSS:**
- `.command-neutral` - Gold/yellow color for free roaming

**Code Changes:**
- game.js: +15 lines modified
- styles.css: +8 lines added

### Testing Scenarios

#### Scenario 1: Navigation During Mission ✅
1. Start Mission 1 (expects `ls` in home)
2. Type `cd documents` → Yellow, executes
3. Type `pwd` → Yellow, executes
4. Type `cd ~` → Yellow, executes
5. Type `ls` → Green, completes objective!

#### Scenario 2: Help Commands ✅
1. Any mission, any time
2. Type `help` → Yellow, shows commands
3. Type `man ls` → Yellow, shows manual
4. Type `clear` → Yellow, clears screen
5. Continue with actual objective → Green when correct

#### Scenario 3: Exploration ✅
1. Mission expects `cat message.txt`
2. Type `ls` → Yellow, list files
3. Type `pwd` → Yellow, check location
4. Type `cd documents` → Yellow, explore
5. Type `cd ~` → Yellow, back to home
6. Type `cat message.txt` → Green, completes objective!

### Future Enhancements

Potential additions to free roaming list:
- `echo` - Useful for testing
- `wc` - Quick file checks
- Basic read-only commands

Could add a "training mode" that allows even MORE commands.

## Impact

This change makes Terminal Quest feel much more like a real terminal while still maintaining the structured learning path. Players can:
- Fix mistakes (navigate back)
- Explore freely
- Learn naturally
- Not get frustrated

The three-color system provides clear visual feedback about what type of command they're using.

## Version
This feature will be part of **v2.7.0**
