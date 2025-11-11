# Sequential Objective Enforcement - v2.1.7

## Problem Identified

**Objectives could be completed out of order!**

### Example Scenario:
```
Mission objectives:
1. Navigate to logs directory (cd logs)
2. List files in logs (ls)
3. Search for errors (grep ERROR server.log)
```

**Previous Behavior (WRONG):**
```
~$ grep ERROR logs/server.log  ← Objective 3 command
✓  ← Completes objective 1 (first uncompleted)!
~$ cd logs
✓  ← Completes objective 2!
~$ ls
✓  ← Completes objective 3!
```

This was confusing and didn't enforce proper learning order.

---

## Solution: Sequential Enforcement

**New Behavior (CORRECT):**
```
~$ grep ERROR logs/server.log  ← Tries objective 3
   (no checkmark - must do objective 1 first!)
~$ cd logs  ← Objective 1 ✓
✓
~$ grep ERROR server.log  ← Still wrong, need objective 2
   (no checkmark - must do objective 2 next!)
~$ ls  ← Objective 2 ✓
✓
~$ grep ERROR server.log  ← Objective 3 ✓
✓
```

**Only the NEXT objective in sequence can be completed!**

---

## Technical Implementation

### Previous Logic (Broken)
```javascript
// Found the FIRST uncompleted objective and checked if command matched
mission.objectives.forEach((obj, index) => {
  if (!foundMatch && !obj.completed && command.includes(obj.command)) {
    // This would match ANY uncompleted objective!
    obj.completed = true;
    foundMatch = true;
  }
});
```

**Problem:** If objectives 1-2 are complete and you type the command for objective 5, it would complete objective 3 (first uncompleted), not 5!

---

### New Logic (Fixed)
```javascript
// Find the NEXT uncompleted objective (in order)
let nextObjectiveIndex = -1;
for (let i = 0; i < mission.objectives.length; i++) {
  if (!mission.objectives[i].completed) {
    nextObjectiveIndex = i;
    break;  // Stop at first uncompleted
  }
}

// Only check if command matches THIS specific objective
const nextObj = mission.objectives[nextObjectiveIndex];
if (commandBase === nextObj.commandBase) {
  // Complete it
  nextObj.completed = true;
  // ... update UI
}
```

**Benefits:**
- ✅ Only the next objective in sequence can be completed
- ✅ No skipping ahead
- ✅ Enforces proper learning progression
- ✅ Clear feedback - command must match current objective

---

## User Experience

### Before (Confusing):
- ❌ Commands complete wrong objectives
- ❌ Order doesn't matter
- ❌ Can skip steps
- ❌ Checkmarks appear unexpectedly

### After (Clear):
- ✅ Only next objective completes
- ✅ Order enforced
- ✅ Cannot skip ahead
- ✅ Checkmarks only when correct command in correct order
- ✅ Teaches proper workflow

---

## Example Walkthroughs

### Mission 2: Exploration

**Correct Order:**
1. `cd logs` ✓ (Objective 1)
2. `ls` ✓ (Objective 2)
3. `cd ~` ✓ (Objective 3)
4. `cd projects/website` ✓ (Objective 4)
5. `ls` ✓ (Objective 5) → Mission Complete!

**Wrong Order (Now Prevented):**
1. `ls` ← No checkmark (need cd logs first)
2. `cd projects/website` ← No checkmark (need cd logs first)
3. `cd logs` ✓ (Objective 1 - correct!)
4. `cd ~` ← No checkmark (need ls in logs first)
5. `ls` ✓ (Objective 2 - correct!)
6. ... continues in order

---

## Edge Cases Handled

### 1. All Objectives Complete
```javascript
if (nextObjectiveIndex === -1) {
  completeMission();  // Trigger completion
  return;
}
```

### 2. Command Doesn't Match Next Objective
```javascript
if (commandBase === objectiveCommandBase) {
  // Complete it
} else {
  // Silently ignore - no error, just no checkmark
}
```

### 3. Mission Already Complete
- Mission completion triggered once all objectives done
- No further checking after mission complete

---

## Files Modified
- `game.js` - Completely rewrote `checkObjectives()` function

## Changes Summary
- **Removed:** Loop through all objectives checking for matches
- **Added:** Find next uncompleted objective
- **Added:** Only check if command matches THAT specific objective
- **Added:** Sequential enforcement logic

---

## Testing Checklist
- [x] Objectives complete in order
- [x] Cannot skip objectives
- [x] Wrong command = no checkmark
- [x] Right command in wrong order = no checkmark
- [x] Right command in right order = checkmark ✓
- [x] Mission completes when all objectives done in sequence

---

**Version:** 2.1.7
**Date:** 2025-11-10
**Impact:** Critical - Enforces proper learning progression
**Breaking Changes:** None (makes game stricter, not more lenient)
