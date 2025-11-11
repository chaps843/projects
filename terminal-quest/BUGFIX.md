# Bug Fixes - Terminal Quest v2.1

## Issues Reported
1. ❌ Profile and Achievements buttons not working
2. ❌ Hint buttons still showing "Details" instead of "Hint"
3. ❌ Hint bubbles not opening when clicked

## Root Causes Identified

### Issue 1: Navigation Buttons Not Working
**Cause:** The "Keep terminal input focused" event listener was capturing ALL clicks on the page and immediately refocusing the terminal input, preventing button clicks from working.

**Fix:** Modified the click handler to exclude buttons, links, and input elements:
```javascript
// Before
document.addEventListener('click', () => {
  terminalInput.focus();
});

// After
document.addEventListener('click', (e) => {
  if (!e.target.closest('button') && !e.target.closest('a') && !e.target.closest('input')) {
    terminalInput.focus();
  }
});
```

### Issue 2 & 3: Hint Buttons and Bubbles Not Working
**Cause:** The hint button event listener was trying to find `.objective-hint` div using `li.querySelector()`, but the hintDiv was created AFTER the event listener was attached and was a sibling element, not a child.

**Fix:** 
1. Created the hintDiv BEFORE the button
2. Captured hintDiv in the button's click closure
3. Added `e.stopPropagation()` to prevent event bubbling
4. Button correctly says "Hint" (was already in code but not rendering due to event issue)

```javascript
// Before (broken)
hintBtn.addEventListener('click', () => {
  const hintDiv = li.querySelector('.objective-hint'); // Can't find sibling!
  ...
});

// After (working)
const hintDiv = document.createElement('div'); // Create first
hintDiv.className = 'objective-hint';
...
hintBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isVisible = hintDiv.classList.contains('visible'); // Use closure
  ...
});
```

## Files Modified
- `game.js` - loadMission() function and event listeners

## Testing Checklist
- [x] Profile button opens Profile page
- [x] Achievements button opens Achievements page
- [x] Play button returns to Game page
- [x] Hint buttons say "Hint" not "Details"
- [x] Clicking Hint opens the hint bubble
- [x] Clicking Hint shows XP penalty warning (first time only)
- [x] Hint bubbles toggle open/closed correctly
- [x] Only one hint bubble open at a time

## Status
✅ All bugs fixed and tested
