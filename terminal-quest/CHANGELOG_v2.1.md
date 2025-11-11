# Terminal Quest v2.1 - Changelog

## 🎯 Major UI/UX Improvements

### Changes Implemented

#### 1. **Removed $_from Title**
- Cleaned up the navbar branding
- Now shows just "Terminal Quest" without the terminal icon

#### 2. **Removed Hints Section from Main View**
- Eliminated the standalone hints panel that showed below objectives
- Makes the interface cleaner and less cluttered

#### 3. **Hint System Overhaul**
- Renamed "Details" button to "Hint" button
- Each objective now has a dedicated "Hint" button
- Clicking "Hint" reveals helpful information about that specific objective
- **XP Penalty**: Using ANY hint reduces mission XP reward by 50%
- Warning message appears when first hint is used
- Hint border changed to warning color (orange) to indicate XP penalty

#### 4. **Removed Commands from Objectives**
- All 15 missions updated
- Objectives now describe **what to do**, not **how to do it**
- Examples:
  - Before: "Type 'ls' to list files"
  - After: "List the files in the current directory"
  - Before: "Go to the logs directory: cd logs"
  - After: "Navigate to the logs directory"
- Makes the game more challenging and educational

#### 5. **Expanded All Missions to 5 Objectives**
- Every mission now has exactly 5 objectives (previously 1-5)
- Added relevant objectives that fit each mission's theme
- Missions now take longer to complete (better pacing)
- More practice with each command set

### Mission Breakdown

| Mission | Before | After | Objectives Added |
|---------|--------|-------|------------------|
| 1 | 2 | 5 | 3 |
| 2 | 3 | 5 | 2 |
| 3 | 3 | 5 | 2 |
| 4 | 1 | 5 | 4 |
| 5 | 3 | 5 | 2 |
| 6 | 3 | 5 | 2 |
| 7 | 3 | 5 | 2 |
| 8 | 2 | 5 | 3 |
| 9 | 2 | 5 | 3 |
| 10 | 2 | 5 | 3 |
| 11 | 3 | 5 | 2 |
| 12 | 2 | 5 | 3 |
| 13 | 4 | 5 | 1 |
| 14 | 3 | 5 | 2 |
| 15 | 5 | 5 | 0 |

**Total objectives**: 40 → 75 (+35 objectives)

### Technical Changes

#### Files Modified
- `index.html` - Removed hints section, removed $_ icon
- `game.js` - Updated hint system, XP penalty logic, all mission objectives
- `styles.css` - Renamed `.objective-details-*` to `.objective-hint-*`

#### New Features
- `gameState.hintUsedThisMission` - Tracks if user clicked any hint button
- XP calculation includes 50% penalty when hints used
- Achievement "Self Taught" now based on `hintUsedThisMission` flag

#### CSS Updates
- `.objective-hint-btn` - Replaced `.objective-details-btn`
- `.objective-hint` - Replaced `.objective-details` with orange border

### Impact

**User Experience:**
- More challenging (no commands shown upfront)
- Cleaner UI (no hints section)
- Better pacing (5 objectives per mission)
- Risk/reward for using hints (50% XP penalty)

**Gameplay:**
- Estimated playtime: ~2 hours → ~4 hours
- More practice per command
- Encourages memorization and learning
- Rewards players who don't use hints

### Version Info

- **Previous Version**: 2.0
- **Current Version**: 2.1
- **Date**: 2025-11-10
- **Lines of Code**: ~2,500+ (increased from mission expansions)

---

**Note**: All changes are backward compatible. Existing save games will continue to work.
