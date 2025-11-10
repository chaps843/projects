# Terminal Quest - Complete Mission Guide

## 🎯 Mission Overview

### Beginner Track (Missions 1-5) - 850 XP
**Time:** ~20 minutes | **Difficulty:** ⭐

**Mission 1: First Day** (100 XP)
- Learn: `ls`, `pwd`
- Objectives: List files, show current directory
- Key Skill: Basic navigation

**Mission 2: Exploration** (150 XP)
- Learn: `cd`, `cd ..`
- Objectives: Navigate into directories and back
- Key Skill: Directory traversal

**Mission 3: File Creation** (200 XP)
- Learn: `touch`, `mkdir`
- Objectives: Create files and directories
- Key Skill: File system manipulation

**Mission 4: Reading Files** (150 XP)
- Learn: `cat`
- Objectives: View file contents
- Key Skill: File inspection

**Mission 5: File Operations** (250 XP)
- Learn: `cp`, `mv`, `rm`
- Objectives: Copy, rename, delete files
- Key Skill: File management

---

### Intermediate Track (Missions 6-10) - 1,500 XP
**Time:** ~40 minutes | **Difficulty:** ⭐⭐

**Mission 6: Search and Discover** (300 XP)
- Learn: `grep`
- Objectives: Search for ERROR in logs
- Key Skill: Pattern matching
- Example: `grep ERROR logs/server.log`

**Mission 7: File Viewing** (250 XP)
- Learn: `head`, `tail`
- Objectives: View first/last lines of files
- Key Skill: Selective file viewing
- Example: `head -n 3 data.txt`

**Mission 8: Power Search** (300 XP)
- Learn: Advanced `grep`
- Objectives: Filter users and configs
- Key Skill: Text filtering
- Example: `grep developer users.txt`

**Mission 9: Finding Files** (350 XP)
- Learn: `find`
- Objectives: Search for files by name
- Key Skill: File discovery
- Example: `find . -name "*.txt"`

**Mission 10: Pipes - The Power Combo** (400 XP)
- Learn: `|` (pipe operator), `wc`
- Objectives: Chain commands together
- Key Skill: Command composition
- Example: `grep ERROR logs/server.log | wc -l`

---

### Advanced Track (Missions 11-15) - 2,650 XP
**Time:** ~60 minutes | **Difficulty:** ⭐⭐⭐

**Mission 11: Output Redirection** (350 XP)
- Learn: `>`, `>>`
- Objectives: Save output to files
- Key Skill: Data persistence
- Example: `ls > filelist.txt`

**Mission 12: Wildcards** (300 XP)
- Learn: `*` pattern matching
- Objectives: Work with multiple files
- Key Skill: Batch operations
- Example: `ls *.txt`

**Mission 13: Working Directory Mastery** (350 XP)
- Learn: Absolute vs relative paths
- Objectives: Navigate complex structures
- Key Skill: Path manipulation
- Example: `cd /home/user/projects/website`

**Mission 14: Combining Skills** (500 XP)
- Learn: Real-world scenarios
- Objectives: Investigate server incident
- Key Skill: Problem solving
- Example: `grep ERROR logs/*.log | wc -l > report.txt`

**Mission 15: The Final Challenge** (1000 XP) 🏆
- Learn: Everything combined
- Objectives: Complete company audit
- Key Skill: Mastery
- Multi-step complex task using all commands

---

## 📚 Command Reference by Mission

### Commands Unlocked by Track

**Beginner (1-5):**
- `ls` - List files
- `pwd` - Print working directory
- `cd` - Change directory
- `cat` - Display file contents
- `touch` - Create empty file
- `mkdir` - Make directory
- `cp` - Copy file
- `mv` - Move/rename file
- `rm` - Remove file

**Intermediate (6-10):**
- `grep` - Search patterns
- `find` - Find files
- `head` - View file start
- `tail` - View file end
- `wc` - Count lines/words
- `|` - Pipe commands

**Advanced (11-15):**
- `>` - Redirect output
- `>>` - Append output
- `*` - Wildcards
- Complex command chains

---

## 🎓 Learning Progression

### Mission 1-3: Foundation
You'll learn basic navigation and file creation. These are the building blocks.

### Mission 4-5: File Management
Master reading and manipulating files. You can now handle basic sysadmin tasks.

### Mission 6-8: Search & Filter
Discover how to find information in files. Real-world data analysis begins here.

### Mission 9-10: Power Tools
Combine commands for incredible power. This is where Linux really shines.

### Mission 11-13: Automation
Learn to save work and batch operations. Efficiency multiplies.

### Mission 14-15: Mastery
Apply everything in realistic scenarios. You're now a Linux power user!

---

## 💡 Pro Tips

### General Strategy
1. **Read the story** - It provides context
2. **Check objectives** - Know what to accomplish
3. **Use hints wisely** - They're there to help
4. **Try man pages** - `man <command>` for details
5. **Experiment freely** - You can't break anything!

### Command Patterns to Master

**Search Pattern:**
```bash
grep PATTERN file     # Find text
find . -name PATTERN  # Find files
```

**Viewing Pattern:**
```bash
cat file          # Full file
head -n 5 file    # First 5 lines
tail -n 5 file    # Last 5 lines
```

**Pipe Pattern:**
```bash
command1 | command2   # Send output →
grep X file | wc -l   # Count matches
```

**Redirection Pattern:**
```bash
command > file    # Save output
command >> file   # Append output
```

**Wildcard Pattern:**
```bash
*.txt             # All .txt files
file*             # Files starting with "file"
```

---

## 🏆 Achievement Hunting

Complete missions efficiently to unlock:
- **List Master** - Use ls 10 times
- **Navigator** - Change directories 5 times
- **Grep Guru** - Successfully use grep
- **Pipe Master** - Use pipes in command
- **Rising Star** - Complete 5 missions
- **Self Taught** - Complete mission without hints
- **Speedrunner** - Complete mission under 60s

---

## 🎯 Mission Checklist

Track your progress:

- [ ] Mission 1: First Day
- [ ] Mission 2: Exploration
- [ ] Mission 3: File Creation
- [ ] Mission 4: Reading Files
- [ ] Mission 5: File Operations
- [ ] Mission 6: Search and Discover
- [ ] Mission 7: File Viewing
- [ ] Mission 8: Power Search
- [ ] Mission 9: Finding Files
- [ ] Mission 10: Pipes
- [ ] Mission 11: Output Redirection
- [ ] Mission 12: Wildcards
- [ ] Mission 13: Directory Mastery
- [ ] Mission 14: Combining Skills
- [ ] Mission 15: Final Challenge

**Total XP Possible:** 5,000
**Estimated Time:** 2 hours

---

## 🚀 After Completion

Once you finish all 15 missions, you'll have mastered:
- File system navigation
- File manipulation
- Text search and filtering
- Command piping
- Output redirection
- Wildcard patterns
- Real-world Linux workflows

**You'll be ready for:**
- Linux server administration basics
- DevOps entry-level tasks
- Command-line productivity
- Further advanced Linux learning

---

**Good luck, and welcome to the world of Linux mastery!** 💪
