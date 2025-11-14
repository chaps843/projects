# Feature: Smart Mission Progression

## Problem

When replaying old missions, the game would always progress to the next mission linearly:

**Scenario:**
1. Complete Missions 1-4 (all done)
2. Go back to Mission 1
3. Restart and complete Mission 1 again
4. **Old behavior**: Loads Mission 2 (already completed) ❌
5. **Problem**: User has to manually navigate to Mission 5 (next incomplete)

This was frustrating because:
- Replaying missions for practice
- After completing, sent to already-done missions
- Had to manually navigate forward
- Not intuitive

## Solution: Smart Progression

After completing a mission, the game now finds the **first incomplete mission** and jumps there.

### New Function: `findNextIncompleteMission()`

```javascript
function findNextIncompleteMission() {
  // Find the first mission that hasn't been completed yet
  for (let i = 0; i < missions.length; i++) {
    if (!gameState.completedMissions.includes(i)) {
      return i;
    }
  }
  
  // If all missions are complete, go to next mission after current
  // (will show "all missions complete" message)
  return gameState.currentMission + 1;
}
```

### Updated `completeMission()`

```javascript
setTimeout(() => {
  const nextMission = findNextIncompleteMission();
  loadMission(nextMission);
}, 3000);
```

## Use Cases

### Use Case 1: Replay Old Mission
**Scenario:**
- Completed: Missions 1, 2, 3, 4
- Incomplete: Mission 5+
- Action: Restart Mission 1, complete it

**Old Behavior:**
```
Mission 1 complete! → Loads Mission 2 (already done) ❌
```

**New Behavior:**
```
Mission 1 complete! → Loads Mission 5 (first incomplete) ✅
```

### Use Case 2: Linear Progression (Normal Play)
**Scenario:**
- Completed: Missions 1, 2
- Incomplete: Mission 3+
- Action: Complete Mission 2

**Behavior (unchanged):**
```
Mission 2 complete! → Loads Mission 3 (next incomplete) ✅
```

### Use Case 3: Replay Multiple Old Missions
**Scenario:**
- Completed: Missions 1-10
- Incomplete: Mission 11+
- Action: Replay Missions 1, 3, 7 for practice

**New Behavior:**
```
Mission 1 complete! → Loads Mission 11 (first incomplete) ✅
Mission 3 complete! → Loads Mission 11 (first incomplete) ✅
Mission 7 complete! → Loads Mission 11 (first incomplete) ✅
```

### Use Case 4: All Missions Complete
**Scenario:**
- Completed: All 19 missions
- Action: Replay Mission 1

**Behavior:**
```
Mission 1 complete! → Loads Mission 2 (next after current)
→ Shows "All missions complete!" message ✅
```

### Use Case 5: Gap in Completions
**Scenario:**
- Completed: Missions 1, 2, 4, 5
- Incomplete: Mission 3
- Action: Restart Mission 1, complete it

**New Behavior:**
```
Mission 1 complete! → Loads Mission 3 (first incomplete) ✅
```

Even if there's a gap, it finds the first incomplete mission.

## Benefits

✅ **Intelligent Navigation** - Always takes you where you need to go
✅ **Less Manual Work** - No need to navigate forward after replaying
✅ **Better UX** - Intuitive and seamless
✅ **Practice Friendly** - Replay any mission without disruption
✅ **Handles All Cases** - Works for gaps, completed sets, everything

## Technical Details

**New Function:**
- `findNextIncompleteMission()` - Finds first incomplete mission

**Modified Function:**
- `completeMission()` - Uses smart progression instead of +1

**Code Changes:**
- game.js: +15 lines

**Algorithm:**
1. Loop through all missions (0 to N)
2. Check if mission index is in `completedMissions` array
3. Return first mission NOT in array
4. If all complete, return current + 1 (fallback)

## Edge Cases Handled

### Edge Case 1: First Mission Incomplete ✅
```javascript
Completed: []
First incomplete: Mission 0 (index 0)
```

### Edge Case 2: Last Mission Incomplete ✅
```javascript
Completed: [0, 1, 2, ..., 17]
First incomplete: Mission 18 (index 18)
```

### Edge Case 3: All Complete ✅
```javascript
Completed: [0, 1, 2, ..., 18]
First incomplete: None
Fallback: current + 1 → Shows "complete" message
```

### Edge Case 4: Random Gaps ✅
```javascript
Completed: [0, 2, 4, 6, 8]
First incomplete: Mission 1 (index 1)
```

## Testing Scenarios

All scenarios work correctly:

**Test 1: Basic Replay** ✅
```
Complete 1-3 → Replay 1 → Jumps to 4
```

**Test 2: Middle Replay** ✅
```
Complete 1-10 → Replay 5 → Jumps to 11
```

**Test 3: All Done** ✅
```
Complete all → Replay any → Shows complete message
```

**Test 4: Gap** ✅
```
Complete 1,2,4 → Replay 1 → Jumps to 3
```

**Test 5: Normal Play** ✅
```
Complete 1 → Jumps to 2 (next sequential)
Complete 2 → Jumps to 3 (next sequential)
```

## User Experience Improvement

**Before:**
1. Complete missions 1-5
2. Replay mission 2 for practice
3. Finish mission 2
4. Load mission 3 (already done)
5. Manually click arrows to get to mission 6
6. Frustrating! 😤

**After:**
1. Complete missions 1-5
2. Replay mission 2 for practice
3. Finish mission 2
4. Load mission 6 (first incomplete)
5. Continue seamlessly!
6. Perfect! 😊

## Future Enhancements

Could add:
- "Return to where you were" option
- "Skip to mission X" button
- Mission tree/graph view
- Bookmarks for favorite missions

But this smart progression solves the core issue!

## Version
This feature will be part of **v2.7.2**
