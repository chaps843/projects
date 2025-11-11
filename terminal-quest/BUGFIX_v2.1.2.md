# Bug Fixes - v2.1.2

## Issues Fixed

### 1. ✅ Mission Auto-Completing After 3 Commands
**Problem:** Typing just 3 commands would complete all 5 objectives because duplicate commands (like `ls` appearing twice) would all complete simultaneously.

**Root Cause:** The `checkObjectives()` function was completing ALL matching objectives at once:
- Type `ls` → completes objectives 1 AND 3 (both use `ls`)
- Type `pwd` → completes objectives 2 AND 4 (both use `pwd`)
- Type `help` → completes objective 5
- Result: 3 commands complete 5 objectives!

**Fix:** Modified `checkObjectives()` to only complete the FIRST uncompleted objective that matches:
```javascript
// Added flag to stop after first match
let foundMatch = false;
mission.objectives.forEach((obj, index) => {
  if (!foundMatch && !obj.completed && command.includes(obj.command.split(' ')[0])) {
    obj.completed = true;
    foundMatch = true;  // Stop checking after first match
    ...
  }
});
```

Now each command only completes ONE objective at a time, in order.

---

### 2. ✅ Grep Error Not Preventing Objective Completion
**Problem:** When grep (or any command) returned an error, objectives would still be checked and potentially completed.

**Root Cause:** `checkObjectives(command)` was called EVERY time, regardless of whether the command succeeded or failed.

**Fix:** Only check objectives when command succeeds (no error):
```javascript
const result = commandProcessor.process(command);

if (result.error) {
  writeToTerminal(result.error, 'terminal-error');
} else if (result.output) {
  writeToTerminal(result.output, 'terminal-text');
}

// Only check objectives if command succeeded
if (!result.error) {
  checkObjectives(command);
}
```

---

### 3. ℹ️ Grep Command Usage Clarification
**Note:** The grep error "pattern or file missing" occurs when you forget the pattern:
- ❌ Wrong: `grep error.log` (missing pattern)
- ✅ Correct: `grep ERROR error.log` (pattern + file)

The grep command requires TWO arguments:
1. **Pattern** - what to search for (e.g., ERROR)
2. **File** - which file to search in (e.g., error.log)

Example:
```bash
cd logs
grep ERROR error.log    # ✅ Finds lines with "ERROR"
grep WARNING server.log # ✅ Finds lines with "WARNING"
```

---

## Testing Checklist
- [x] Mission 1 requires all 5 commands to complete
- [x] Duplicate commands (ls, pwd) only complete one objective at a time
- [x] Errors prevent objective completion
- [x] Grep works correctly with pattern and file
- [x] All 5 objectives must be completed to finish mission

## Files Modified
- `game.js` - checkObjectives() and terminal input handler

---
**Version:** 2.1.2
**Date:** 2025-11-10
