# Block Wrong Command Execution - v2.2.0

## Major Change: Commands Must Match Objectives

**Previous Behavior (Problematic):**
- ❌ Any command executed, even if wrong
- ❌ Wrong commands changed game state (cd to wrong directory)
- ❌ User had to undo mistakes (cd ..)
- ❌ Terminal filled with red incorrect attempts

**New Behavior (Fixed):**
- ✅ Only correct commands execute
- ✅ Wrong commands shown in red but DON'T run
- ✅ Game state unchanged by wrong commands
- ✅ Clean terminal with only successful commands

---

## Problem Example

### Mission 2, Objective 4: Navigate to projects/website

**Before (Broken):**
```
~$ cd projects          ← RED (wrong!) but EXECUTES
projects$               ← Now stuck in wrong directory!
projects$ cd website    ← Can't do this, wrong starting point
projects$ cd ..         ← RED (wrong!) Must undo mistake
~$ cd projects/website  ← Finally correct but 3 red attempts
```

**After (Fixed):**
```
~$ cd projects          ← RED (wrong!) DOESN'T EXECUTE
Command does not match current objective
~$ cd projects/website  ← GREEN (correct!) EXECUTES
projects/website$       ← Success on first try!
```

---

## How It Works

### Old Flow (Execute Then Check):
```
1. User types command
2. ✅ Execute command (changes state)
3. Check if matches objective
4. Color red if wrong
5. User has to undo changes
```

### New Flow (Check Then Execute):
```
1. User types command
2. Check if matches objective FIRST
3. IF matches:
   ✅ Execute command
   ✅ Show in green
4. IF doesn't match:
   ❌ DON'T execute
   ❌ Show in red
   ❌ Show error message
```

---

## Technical Implementation

### New Function: `willCommandMatchObjective()`

```javascript
function willCommandMatchObjective(command) {
  const mission = missions[gameState.currentMission];
  if (!mission) return false;
  
  // Find next uncompleted objective
  let nextObjectiveIndex = -1;
  for (let i = 0; i < mission.objectives.length; i++) {
    if (!mission.objectives[i].completed) {
      nextObjectiveIndex = i;
      break;
    }
  }
  
  // Check if command matches
  const nextObj = mission.objectives[nextObjectiveIndex];
  return command.trim() === nextObj.command || 
         command.trim().startsWith(nextObj.command + ' ');
}
```

### Terminal Input Handler (Rewritten):

```javascript
if (command) {
  const wouldMatchObjective = willCommandMatchObjective(command);
  
  if (wouldMatchObjective) {
    // EXECUTE: Command matches objective
    writeToTerminal(command, 'terminal-command');
    const result = commandProcessor.process(command);  // ✅ RUNS
    checkObjectives(command);
    colorCommandGreen();
    writeOutput(result);
  } else {
    // DON'T EXECUTE: Command doesn't match
    writeToTerminal(command, 'terminal-command');
    colorCommandRed();
    writeToTerminal('Command does not match current objective.', 'terminal-error');
    // ❌ DOESN'T RUN commandProcessor.process()
  }
}
```

---

## Examples

### Example 1: Wrong cd Command

**Before:**
```
~$ cd logs                           ← RED but executes
logs$                                ← Directory changed!
logs$ cd projects/website            ← Fails (not from home)
cd: projects/website: No such file...
logs$ cd ~                           ← Must go back
~$ cd projects/website               ← Finally works
```

**After:**
```
~$ cd logs                           ← RED, doesn't execute
Command does not match current objective
~$                                   ← Still in home!
~$ cd projects/website               ← GREEN, works first try
projects/website$
```

---

### Example 2: Wrong grep Pattern

**Objective:** `grep ERROR server.log`

**Before:**
```
~$ grep WARNING server.log           ← RED but executes
WARNING: High memory usage            ← Wrong output shown
~$ grep ERROR server.log              ← Correct
ERROR: Connection timeout
```

**After:**
```
~$ grep WARNING server.log           ← RED, doesn't execute
Command does not match current objective
~$ grep ERROR server.log              ← GREEN, executes
ERROR: Connection timeout
```

---

### Example 3: All Objectives Complete

**Special Case:** After mission complete, any command allowed

```
Mission Complete! 🎉
~$ ls                    ← GREEN (allowed - mission done)
~$ cat message.txt       ← GREEN (allowed - mission done)
~$ anything              ← Executes normally
```

---

## Error Message

When wrong command entered:
```
Command does not match current objective. Check the mission objectives.
```

**Styling:**
- Text color: Red (terminal-error)
- Clear, actionable message
- Reminds user to check objectives panel

---

## Benefits

### For Learning:
- ✅ **No state pollution** - game state only changes when correct
- ✅ **Immediate feedback** - see red = know it's wrong
- ✅ **No undo needed** - wrong commands don't execute
- ✅ **Clear path forward** - read objectives to see what's needed

### For User Experience:
- ✅ **Clean terminal** - only successful commands execute
- ✅ **Less frustration** - no fixing mistakes
- ✅ **Faster completion** - no time wasted undoing
- ✅ **Better flow** - focus on learning, not recovering

### For Future Features:
- ✅ **XP penalties ready** - can penalize red attempts without unfair state changes
- ✅ **Streak tracking** - can track consecutive correct commands
- ✅ **Perfect run achievements** - easier to track no-mistakes runs

---

## Edge Cases

### 1. Commands with Errors
```
~$ cd fakedir                        ← Doesn't match objective
Command does not match current objective
```
Even if command would fail, it doesn't execute if wrong.

### 2. Partial Matches
```
Objective: cd projects/website
User: cd projects                    ← Doesn't match
Command does not match current objective
```

### 3. Extra Arguments
```
Objective: ls
User: ls -la                         ← Matches! (extra args OK)
✅ Executes and shows green
```

---

## Files Modified

### game.js
- **Added:** `willCommandMatchObjective()` function
- **Rewrote:** Terminal input event handler
- **Changed:** Command execution now conditional on objective match
- **Removed:** Post-execution objective checking logic

---

## Testing Checklist

- [x] Wrong commands don't execute
- [x] Wrong commands show red
- [x] Wrong commands show error message
- [x] Correct commands execute
- [x] Correct commands show green
- [x] Game state unchanged by wrong commands
- [x] Directory doesn't change on wrong cd
- [x] No unwanted file changes
- [x] Completed missions allow any command

---

**Version:** 2.2.0
**Date:** 2025-11-10
**Impact:** MAJOR - Fundamentally changes how commands work
**Breaking Changes:** Commands that don't match objectives no longer execute
