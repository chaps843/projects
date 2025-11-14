# Terminal Quest v2.9.0 - Objective Clarity Audit & Fixes

## Issue Summary
**Critical UX Problem**: 36 out of 199 objectives (18%) don't explicitly specify which file to use, causing user confusion.

**Example from Review 2 (Mission 12):**
- Objectives 1-2: Use server.log ✓
- Objective 3: Suddenly switches to access.log ✗ (no warning!)
- Objectives 4-5: Back to server.log ✗ (confusing!)

---

## Complete Fix List (36 Objectives)

### Mission 4: Reading Files (5 fixes) ✅ DONE
1. "Display the full contents of message.txt" → "...message.txt (in home)"
2. "Preview just the first 3 lines of users.txt" → "...users.txt (in home)"
3. "Check the last 4 lines of data.txt..." → "...data.txt (in home)..."
4. "Read the complete config.txt file" → "...config.txt (in home)"
5. "View the first 5 lines of test.txt" → "...test.txt (in home)"

### Mission 6: Review 1 (3 fixes) - NEEDS FIXING
Obj 2 (line 300): "View the complete contents of notes.txt"
→ "View the complete contents of notes.txt (in current directory)"

Obj 3 (line 301): "Check just the first 2 lines of report.txt"
→ "Check just the first 2 lines of report.txt (in current directory)"

Obj 11 (line 310): "View the last 3 lines of data.txt"
→ "View the last 3 lines of data.txt (in home)"

### Mission 7: Search and Discover (3 fixes) - NEEDS FIXING
Obj 2 (line 327): "Search for ERROR entries in server.log"
→ "Search for ERROR entries in server.log (in logs directory)"

Obj 4 (line 339): "Find 'user' in access.log (case-insensitive)"
→ "Find 'user' in access.log (in logs directory, case-insensitive)"

Obj 5 (line 345): "Show Permission errors with line numbers in error.log"
→ "Show Permission errors with line numbers in error.log (in logs directory)"

### Mission 8: Counting & Analysis (4 fixes) - NEEDS FIXING
Obj 1 (line 372): "Count the total lines in data.txt"
→ "Count the total lines in data.txt (in home)"

Obj 2 (line 378): "Count the words in message.txt"
→ "Count the words in message.txt (in home)"

Obj 3 (line 384): "Count the characters in config.txt"
→ "Count the characters in config.txt (in home)"

Obj 4 (line 390): "Get full statistics for users.txt"
→ "Get full statistics for users.txt (in home)"

### Mission 9: Power Search (2 fixes) - NEEDS FIXING
Obj 1 (line 422): "Find all lines with 'developer' in users.txt"
→ "Find all lines with 'developer' in users.txt (in home)"

Obj 4 (line 440): "Find lines in config.txt that don't contain 'port'"
→ "Find lines in config.txt (in home) that don't contain 'port'"

### Mission 11: Pipes (1 fix) - NEEDS FIXING
Obj 5 (line 535): "Count how many developers exist in users.txt"
→ "Count how many developers exist in users.txt (in home)"

### Mission 12: Review 2 (5 fixes) - NEEDS FIXING **CRITICAL**
Obj 1 (line 561): "Search for ERROR in server.log"
→ "Search for ERROR in server.log (in logs directory)"

Obj 3 (line 563): "Find all lines with 'user' (case-insensitive)"
→ "Find all lines with 'user' in access.log (case-insensitive)"

Obj 4 (line 564): "Show WARNING lines with line numbers"
→ "Show WARNING lines with line numbers in server.log"

Obj 5 (line 565): "Show lines NOT containing ERROR"
→ "Show lines NOT containing ERROR in server.log"

Obj 10 (line 570): "Count how many developers exist in users.txt"
→ "Count how many developers exist in users.txt (in home)"

Obj 12 (line 572): "Count total words in message.txt"
→ "Count total words in message.txt (in home)"

### Mission 17: The Final Challenge (1 fix) - NEEDS FIXING
Obj 3 (line 793): "Save developer user list to audit directory"
→ "Save developer user list from users.txt (in home) to audit directory"

### Mission 18: Review 3 (1 fix) - NEEDS FIXING
Obj 9 (line 838): "Search all log files for ERROR"
→ "Search all log files for ERROR (in current directory)"

### Mission 19: Final Review (5 fixes) - NEEDS FIXING
Obj 5 (line 858): "View the last 5 lines of server.log"
→ "View the last 5 lines of server.log (in current directory)"

Obj 7 (line 860): "Find all lines with error (case-insensitive)"
→ "Find all lines with error (case-insensitive) in server.log"

Obj 10 (line 863): "Show admin activity with line numbers"
→ "Show admin activity with line numbers in access.log (in current directory)"

Obj 11 (line 864): "Show all non-ERROR lines from server.log"
→ "Show all non-ERROR lines from server.log (in current directory)"

Obj 21 (line 874): "Count how many developer accounts exist"
→ "Count how many developer accounts exist in users.txt (in home)"

---

## Pattern of File Location Markers

**Use these consistently:**

1. **In home directory**: `(in home)`
   - Example: "Count words in message.txt (in home)"

2. **In current directory**: `(in current directory)`  
   - Example: "Search for ERROR in server.log (in current directory)"

3. **Explicit subdirectory**: `(in logs directory)`
   - Example: "Find errors in server.log (in logs directory)"

4. **With path in command**: No marker needed
   - Example: "Search logs/server.log" - path is clear!

---

## Impact

- **Fixes**: 36 objectives across 10 missions
- **User confusion**: Eliminated
- **Clarity**: Significantly improved
- **Learning**: Users know exactly which file to use

---

## Next Steps

1. Apply all remaining 31 fixes (5 already done)
2. Test each mission to ensure clarity
3. Update version to 2.9.0
4. Create release notes

---

**Status**: Mission 4 complete (5/36), 31 objectives remaining  
**Priority**: HIGH - This affects 18% of all objectives  
**User Impact**: Critical for learning experience
