# How to Extend Terminal Quest

Want to add your own missions, commands, or features? Here's how!

## Adding New Missions (Easy)

Open `game.js` and find the `missions` array (around line 60). Add your mission:

```javascript
{
  id: 6,
  title: 'Mission 6: Your Title Here',
  story: 'Your engaging story about why the player needs to do this task...',
  objectives: [
    { 
      text: 'What the player needs to do', 
      completed: false, 
      command: 'expected_command' 
    },
    { 
      text: 'Second objective', 
      completed: false, 
      command: 'another_command' 
    }
  ],
  hints: [
    'First helpful hint',
    'Second hint if they need more help',
    'Final hint with almost the answer'
  ],
  reference: {
    'command1': 'What it does',
    'command2': 'What this one does'
  },
  xpReward: 250  // How much XP they earn
}
```

**Tips:**
- Start story with context (who needs what and why)
- Make objectives clear and specific
- Write hints that progressively reveal more
- Give generous XP rewards (100-500 range)

## Adding New Commands (Medium)

### Step 1: Add to CommandProcessor

In `game.js`, find the `CommandProcessor` class (around line 200). Add your command to the `process()` method:

```javascript
switch (command) {
  case 'ls':
    return this.ls(args);
  // ... other commands
  case 'yourcommand':  // ADD THIS
    return this.yourCommand(args);
  default:
    return { error: `Command not found: ${command}` };
}
```

### Step 2: Implement the Command

Below the `process()` method, add your command function:

```javascript
yourCommand(args) {
  // Validate arguments
  if (args.length === 0) {
    return { error: 'yourcommand: missing operand' };
  }
  
  // Do something with the filesystem
  // this.fs has methods like:
  // - getCurrentDir()
  // - listFiles()
  // - readFile(name)
  // - createFile(name)
  // - etc.
  
  // Return result
  return { output: 'Your command output here' };
  // OR
  return { error: 'Error message if something wrong' };
}
```

### Step 3: Add to Help

Update the `help()` method:

```javascript
help() {
  return {
    output: `Available Commands:
  ls          - List files
  yourcommand - What your command does
  ...`
  };
}
```

### Step 4: Add Man Page (Optional)

In the `man()` method, add your command's documentation:

```javascript
const manPages = {
  ls: 'ls - list directory contents...',
  yourcommand: 'yourcommand - detailed description\n\nDESCRIPTION\n  What it does in detail.'
};
```

## Adding New Achievements (Easy)

Find the `achievements` array (around line 30). Add your achievement:

```javascript
{ 
  id: 'unique_id',
  name: 'Achievement Name',
  description: 'What the player did to earn this',
  icon: '🏆',  // Pick a fun emoji
  xp: 150,  // XP reward (50-500)
  unlocked: false
}
```

### Triggering Your Achievement

Find where you want it to unlock and add:

```javascript
unlockAchievement('unique_id');
```

**Common trigger points:**
- After specific command: In command processor
- After mission complete: In `completeMission()`
- After N uses: Track with command stats
- On specific action: In relevant function

## Adding Files to Filesystem (Easy)

In `game.js`, find the `VirtualFileSystem` constructor (around line 140):

```javascript
this.files = {
  '/home/user': {
    type: 'directory',
    contents: {
      'documents': {
        type: 'directory',
        contents: {
          'yourfile.txt': { 
            type: 'file', 
            content: 'File contents here' 
          }
        }
      },
      'newfile.txt': { 
        type: 'file', 
        content: 'Some text content' 
      }
    }
  }
};
```

## Adding New Skills (Medium)

### Step 1: Update Profile HTML

In `index.html`, find the skills grid (around line 120) and add:

```html
<div class="skill-item locked">
  <div class="skill-icon">🔥</div>
  <div class="skill-name">Your Skill</div>
  <div class="skill-progress">0%</div>
</div>
```

### Step 2: Track Skill Progress

In `game.js`, add to `gameState.player`:

```javascript
player: {
  // ... existing properties
  skillProgress: {
    yourSkill: 0
  }
}
```

### Step 3: Update Skill Progress

When relevant commands are used:

```javascript
gameState.player.skillProgress.yourSkill += 10;
if (gameState.player.skillProgress.yourSkill >= 100) {
  // Unlock skill achievement
  unlockAchievement('skill_master');
}
```

## Customizing UI Colors (Easy)

In `styles.css`, change the color variables (lines 10-20):

```css
:root {
  --bg-primary: #0a0e27;      /* Main background */
  --accent-primary: #00ff88;  /* Primary accent (green) */
  --accent-secondary: #00ccff; /* Secondary accent (blue) */
  /* Change these to any colors you want! */
}
```

## Adding Sound Effects (Medium)

### Step 1: Add Audio Files

Create a `sounds/` folder and add `.mp3` or `.ogg` files:
- `achievement.mp3`
- `level-up.mp3`
- `command.mp3`

### Step 2: Create Audio Manager

In `game.js`, add:

```javascript
const sounds = {
  achievement: new Audio('sounds/achievement.mp3'),
  levelUp: new Audio('sounds/level-up.mp3'),
  command: new Audio('sounds/command.mp3')
};

function playSound(soundName) {
  if (sounds[soundName]) {
    sounds[soundName].currentTime = 0;
    sounds[soundName].play();
  }
}
```

### Step 3: Use in Game

```javascript
function unlockAchievement(achievementId) {
  // ... existing code
  playSound('achievement');
}

function addXP(amount) {
  // ... existing code
  if (leveledUp) {
    playSound('levelUp');
  }
}
```

## Advanced: New Command with Filesystem Modification

Example - Adding `echo` to write to files:

```javascript
echo(args) {
  // Parse: echo "text" > file.txt
  const input = args.join(' ');
  
  if (input.includes('>')) {
    const parts = input.split('>');
    const text = parts[0].trim().replace(/['"]/g, '');
    const filename = parts[1].trim();
    
    // Write to file
    const result = this.fs.createFile(filename);
    if (result.success) {
      const file = this.fs.getCurrentDir().contents[filename];
      file.content = text;
      return { output: '' };
    }
    return { error: result.error };
  }
  
  // Just echo text
  return { output: args.join(' ') };
}
```

## Testing Your Changes

1. **Save your files**
2. **Refresh browser** (Ctrl+Shift+R to hard refresh)
3. **Clear localStorage** if needed:
   - Open browser console (F12)
   - Type: `localStorage.clear()`
   - Refresh page

## Common Patterns

### Check if Command Used N Times

```javascript
if (this.commandStats['yourcommand'] === 10) {
  unlockAchievement('command_master');
}
```

### Add Timed Challenge

```javascript
// In mission objectives:
missionStartTime: Date.now(),

// When mission completes:
const timeElapsed = Date.now() - mission.missionStartTime;
if (timeElapsed < 60000) {  // 60 seconds
  unlockAchievement('speedrunner');
}
```

### Progressive Difficulty

```javascript
// Early missions
xpReward: 100,
objectives: 1-2,
hints: 3

// Mid missions  
xpReward: 200-300,
objectives: 3-4,
hints: 2

// Late missions
xpReward: 500+,
objectives: 5+,
hints: 1
```

## Best Practices

✅ **DO:**
- Test thoroughly before adding
- Keep missions focused on 1-2 concepts
- Give clear error messages
- Make achievements feel rewarding
- Comment your code

❌ **DON'T:**
- Make missions too long
- Give confusing hints
- Use cryptic command names
- Break existing functionality
- Add dependencies without reason

## Debugging Tips

**Terminal not working?**
- Check browser console (F12) for errors
- Verify command name in switch statement
- Make sure function returns `{ output: }` or `{ error: }`

**Mission not completing?**
- Check `objective.command` matches what player types
- Verify objective completion logic in `checkObjectives()`
- Console.log the command to see what's being checked

**Achievement not unlocking?**
- Check achievement ID is correct
- Verify `unlockAchievement()` is called
- Make sure achievement isn't already unlocked

**Filesystem issues?**
- Verify file structure in constructor
- Check `type: 'file'` or `type: 'directory'`
- Ensure `contents: {}` for directories

## Example: Complete New Feature

Let's add `grep` command:

```javascript
// 1. Add to switch statement
case 'grep':
  return this.grep(args);

// 2. Implement command
grep(args) {
  if (args.length < 2) {
    return { error: 'grep: missing pattern or file' };
  }
  
  const pattern = args[0];
  const filename = args[1];
  
  const result = this.fs.readFile(filename);
  if (result.error) return { error: result.error };
  
  const lines = result.content.split('\n');
  const matches = lines.filter(line => 
    line.toLowerCase().includes(pattern.toLowerCase())
  );
  
  if (matches.length === 0) {
    return { output: '' };
  }
  
  // Unlock achievement
  unlockAchievement('grep_guru');
  
  return { output: matches.join('\n') };
}

// 3. Add to help
grep <pattern> <file> - Search for pattern in file

// 4. Add to man pages
grep: 'grep - search for patterns\n\nDESCRIPTION\n  Search for PATTERN in FILE.'

// 5. Create mission using it
{
  id: 7,
  title: 'Mission 7: Search and Discover',
  story: 'A config file has an error. Find the line with "ERROR".',
  objectives: [
    { text: 'Use grep to find ERROR in config.txt', completed: false, command: 'grep ERROR config.txt' }
  ],
  hints: ['Use: grep PATTERN filename'],
  reference: { 'grep': 'Search for patterns in files' },
  xpReward: 200
}
```

## Need Help?

- Read through existing code
- Follow the patterns you see
- Start small, test often
- Comment your additions
- Share your creations!

---

**Happy coding! Make Terminal Quest even more awesome!** 🚀
