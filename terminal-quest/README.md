# Terminal Quest 🎮

An interactive, game-based Linux terminal learning experience. Master Linux commands through story-driven missions, earn achievements, level up, and become a Terminal Master!

## Features

### 🎯 Story-Driven Missions
- 5 progressive missions (more coming!)
- Real-world scenarios at TechCorp
- Learn by doing, not just reading

### 🏆 Gamification
- XP and leveling system
- 12 unique achievements to unlock
- Skill tree progression
- Day streak tracking
- Profile customization

### 💻 Fully Functional Terminal
- Virtual filesystem that persists
- Real Linux command parsing
- Support for pipes, arguments, and options
- Command history
- Accurate error messages

### 📚 Built-in Learning Tools
- Contextual hints for each mission
- Command reference guides
- Man pages (use `man <command>`)
- Progressive difficulty

### 🎨 Beautiful UI
- Dark terminal theme
- Smooth animations
- Achievement notifications
- Responsive design
- Profile and stats tracking

## Quick Start

### Option 1: Launch Script (Recommended)
```bash
cd /home/chaps/projects/terminal-quest
./launch              # Start the game
./launch stop         # Stop the server
./launch restart      # Restart the server
./launch status       # Check if running
```

Then open: **http://localhost:8081**

### Option 2: Manual
1. **Open the game**: Simply open `index.html` in any modern web browser
2. **Start typing**: The terminal is ready - just start typing commands!
3. **Complete objectives**: Each mission has objectives to complete
4. **Level up**: Earn XP, unlock achievements, and progress through missions
5. **Have fun!**: Learning Linux has never been this engaging

## Supported Commands

### Basic Navigation
- `ls` - List files and directories
- `pwd` - Print working directory
- `cd <directory>` - Change directory
- `cd ..` - Go to parent directory
- `cd ~` - Go to home directory

### File Operations
- `cat <file>` - Display file contents
- `touch <file>` - Create empty file
- `mkdir <dir>` - Create directory
- `cp <source> <dest>` - Copy file
- `mv <source> <dest>` - Move/rename file
- `rm <file>` - Remove file

### Utilities
- `echo <text>` - Print text to terminal
- `man <command>` - Show manual page
- `help` - Display available commands
- `clear` - Clear terminal screen

## Missions Overview

### Mission 1: First Day
Learn the absolute basics - `ls` and `pwd`

### Mission 2: Exploration
Navigate the filesystem with `cd`

### Mission 3: File Creation
Create files and directories with `touch` and `mkdir`

### Mission 4: Reading Files
Learn to read file contents with `cat`

### Mission 5: File Operations
Master copying, moving, and deleting files

## Achievements

Unlock 12 different achievements:
- 👋 **Hello, Terminal!** - Execute your first command
- 📋 **List Master** - Use ls 10 times
- 🧭 **Navigator** - Change directories 5 times
- 📄 **File Creator** - Create your first file
- ⭐ **First Day Complete** - Complete Mission 1
- 🌟 **Rising Star** - Complete 5 missions
- ⚡ **Speedrunner** - Complete a mission in under 60 seconds
- 📚 **RTFM** - Use the man command
- 🔧 **Pipe Master** - Use pipes in a command
- 🚫 **Permission Denied** - Try to access a restricted file
- 🔍 **Grep Guru** - Use grep successfully
- 🧠 **Self Taught** - Complete a mission without hints

## Progress Tracking

Your progress is automatically saved to browser localStorage:
- Current mission
- XP and level
- Unlocked achievements
- Command statistics
- Skills progress

## Customization & Extension

Want to add more missions? Edit `game.js`:

```javascript
const missions = [
  {
    id: 6,
    title: 'Your Mission Title',
    story: 'Your story here...',
    objectives: [
      { text: 'Objective description', completed: false, command: 'expected_command' }
    ],
    hints: ['Hint 1', 'Hint 2'],
    reference: {
      'command': 'Description'
    },
    xpReward: 300
  }
];
```

## Technical Details

- **Pure vanilla JavaScript** - No frameworks or build tools required
- **Virtual filesystem** - Runs entirely in browser memory
- **Command parser** - Validates and executes Linux-like commands
- **LocalStorage persistence** - Your progress is saved automatically
- **Responsive design** - Works on desktop, tablet, and mobile

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Future Enhancements

Planned features:
- [ ] More missions (20+ total planned)
- [ ] Advanced commands (grep, find, pipes, redirects)
- [ ] Networking commands (ping, curl, ssh simulation)
- [ ] Permissions and users
- [ ] Bash scripting challenges
- [ ] Multiplayer leaderboards
- [ ] Dark/light theme toggle
- [ ] Mobile app version

## Educational Value

This game teaches:
- Command-line interface basics
- Linux/Unix command syntax
- Filesystem navigation
- File manipulation
- Problem-solving skills
- Terminal confidence

## Credits

Created with ❤️ for anyone wanting to master the Linux terminal.

## License

Free to use, modify, and distribute. If you make improvements, consider sharing them!

---

**Ready to become a Terminal Master? Open index.html and start your journey!** 🚀
