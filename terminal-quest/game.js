// ===========================
// GAME STATE & DATA
// ===========================

const gameState = {
  player: {
    name: 'Terminal Novice',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    title: 'Junior Sysadmin',
    missionsCompleted: 0,
    commandsUsed: 0,
    streak: 0,
    unlockedSkills: [],
    achievements: []
  },
  currentMission: 0,
  hintsUsed: 0,
  hintUsedThisMission: false,
  commandHistory: [],
  filesystem: null,
  currentDirectory: '/home/user',
  completedMissions: [], // Track which specific missions have been completed
  filesystemSnapshots: {} // Store filesystem state before each mission starts
};

// Achievement definitions
const achievements = [
  { id: 'first_command', name: 'Hello, Terminal!', description: 'Execute your first command', icon: '👋', xp: 50, unlocked: false },
  { id: 'list_master', name: 'List Master', description: 'Use ls 10 times', icon: '📋', xp: 100, unlocked: false, progress: 0, goal: 10 },
  { id: 'navigator', name: 'Navigator', description: 'Change directories 5 times', icon: '🧭', xp: 100, unlocked: false, progress: 0, goal: 5 },
  { id: 'file_creator', name: 'File Creator', description: 'Create your first file', icon: '📄', xp: 75, unlocked: false },
  { id: 'mission_1', name: 'First Day Complete', description: 'Complete Mission 1', icon: '⭐', xp: 200, unlocked: false },
  { id: 'mission_5', name: 'Rising Star', description: 'Complete 5 missions', icon: '🌟', xp: 500, unlocked: false },
  { id: 'speedrunner', name: 'Speedrunner', description: 'Complete a mission in under 60 seconds', icon: '⚡', xp: 300, unlocked: false },
  { id: 'rtfm', name: 'RTFM', description: 'Use the man command', icon: '📚', xp: 100, unlocked: false },
  { id: 'pipe_master', name: 'Pipe Master', description: 'Use pipes in a command', icon: '🔧', xp: 150, unlocked: false },
  { id: 'permission_denied', name: 'Permission Denied', description: 'Try to access a file without permission', icon: '🚫', xp: 50, unlocked: false },
  { id: 'grep_guru', name: 'Grep Guru', description: 'Use grep successfully', icon: '🔍', xp: 150, unlocked: false },
  { id: 'no_hints', name: 'Self Taught', description: 'Complete a mission without using hints', icon: '🧠', xp: 250, unlocked: false }
];

// Mission definitions
const missions = [
  {
    id: 1,
    title: 'Mission 1: First Day',
    story: 'Welcome to TechCorp! You\'ve just been hired as a junior sysadmin. Your first task is to familiarize yourself with the terminal. Let\'s start with the basics - navigation and exploration.',
    objectives: [
      { 
        text: 'List the files in your home directory', 
        completed: false, 
        command: 'ls',
        details: 'The \'ls\' command stands for "list". It shows you what files and folders are in your current location.'
      },
      { 
        text: 'Check where you are in the filesystem', 
        completed: false, 
        command: 'pwd',
        details: 'The \'pwd\' command means "print working directory". It tells you exactly where you are in the filesystem.'
      },
      { 
        text: 'Navigate to the documents directory', 
        completed: false, 
        command: 'cd documents',
        details: 'Use \'cd documents\' to change into the documents directory. The cd command (change directory) is how you navigate between folders.'
      },
      { 
        text: 'List files in the documents directory', 
        completed: false, 
        command: 'ls',
        details: 'See what\'s inside documents. Using ls in different locations shows different files - always check your surroundings!'
      },
      { 
        text: 'Return to your home directory', 
        completed: false, 
        command: 'cd ..',
        details: 'The .. notation means "parent directory". Use \'cd ..\' to go back up one level in the directory tree.'
      }
    ],
    hints: [
      'The \'ls\' command stands for "list". It shows you what files and folders are in your current location.',
      'The \'pwd\' command means "print working directory". It tells you exactly where you are in the filesystem.',
      'Use \'cd documents\' to navigate into a directory, and \'cd ..\' to go back.'
    ],
    reference: {
      'ls': 'List directory contents',
      'pwd': 'Print working directory',
      'cd': 'Change directory'
    },
    xpReward: 100
  },
  {
    id: 2,
    title: 'Mission 2: Exploration',
    story: 'Great job! Your manager is impressed. Now she wants you to explore the entire filesystem structure, including the projects and logs directories.',
    objectives: [
      { 
        text: 'Navigate to the logs directory', 
        completed: false, 
        command: 'cd logs',
        details: 'Use \'cd logs\' to change into the logs directory. This is where system log files are stored.'
      },
      { 
        text: 'List the log files to see what\'s available', 
        completed: false, 
        command: 'ls',
        details: 'After moving to a directory, use \'ls\' to see what\'s inside. You should find several log files here.'
      },
      { 
        text: 'Jump directly back to home using the tilde shortcut', 
        completed: false, 
        command: 'cd ~',
        details: 'The tilde (~) is a shortcut for your home directory (/home/user). This is a quick way to jump back home from anywhere.'
      },
      { 
        text: 'Navigate to projects/website in one command', 
        completed: false, 
        command: 'cd projects/website',
        details: 'You can navigate through multiple directories in one command. Goes into projects, then into the website subfolder.'
      },
      { 
        text: 'List the website files', 
        completed: false, 
        command: 'ls',
        details: 'See what files are in the website directory. Different locations contain different files relevant to that area.'
      }
    ],
    hints: [
      'Use \'cd logs\' to change into the logs directory.',
      'The tilde ~ is a shortcut to home: \'cd ~\'.',
      'You can navigate multiple levels at once: \'cd projects/website\'.'
    ],
    reference: {
      'cd': 'Change directory (cd <directory>)',
      'cd ..': 'Go to parent directory',
      'cd ~': 'Go to home directory',
      'ls': 'List files'
    },
    xpReward: 150
  },
  {
    id: 3,
    title: 'Mission 3: File Creation',
    story: 'A developer needs you to set up a new project structure. Time to learn file and directory creation!',
    objectives: [
      { 
        text: 'Create a new file called README.md', 
        completed: false, 
        command: 'touch README.md',
        details: 'Use \'touch README.md\' to create a new empty file. The touch command creates files without any content.'
      },
      { 
        text: 'Create a directory called src', 
        completed: false, 
        command: 'mkdir src',
        details: 'Use \'mkdir src\' to create a new directory (folder). mkdir stands for "make directory".'
      },
      { 
        text: 'Navigate into the src directory', 
        completed: false, 
        command: 'cd src',
        details: 'Move into the new directory you just created. Always good to test that your directory creation worked.'
      },
      { 
        text: 'Create a file called index.js inside src', 
        completed: false, 
        command: 'touch index.js',
        details: 'Create a file in the current directory (src). You can create files anywhere you are in the filesystem.'
      },
      { 
        text: 'Create a file called package.json in the src directory', 
        completed: false, 
        command: 'touch package.json',
        details: 'Practice creating another file. You\'re building a complete project structure!'
      }
    ],
    hints: [
      'Use \'touch <filename>\' to create a new empty file.',
      'Use \'mkdir <dirname>\' to create a new directory (folder).',
      'Use \'cd src\' to navigate into the new directory.',
      'Create files wherever you currently are in the filesystem.'
    ],
    reference: {
      'touch': 'Create an empty file',
      'mkdir': 'Make directory (create folder)',
      'cd': 'Change directory',
      'ls': 'List files to verify'
    },
    xpReward: 200
  },
  {
    id: 4,
    title: 'Mission 4: Reading Files',
    story: 'Important information is scattered across files. You need to read them using different viewing techniques - sometimes you need the whole file, sometimes just the beginning or end.',
    objectives: [
      { 
        text: 'Display the full contents of message.txt (in home)', 
        completed: false, 
        command: 'cat message.txt',
        details: 'The \'cat\' command displays entire file contents. Use \'cat message.txt\' to read the complete welcome message.'
      },
      { 
        text: 'Preview just the first 3 lines of users.txt (in home)', 
        completed: false, 
        command: 'head -n 3 users.txt',
        details: 'Use \'head -n 3 users.txt\' to see just the beginning. head is perfect when you only need a quick preview of a file.'
      },
      { 
        text: 'Check the last 4 lines of data.txt (in home) for recent entries', 
        completed: false, 
        command: 'tail -n 4 data.txt',
        details: 'Use \'tail -n 4 data.txt\' to see the end. tail is commonly used to check the most recent entries in log files.'
      },
      { 
        text: 'Read the complete config.txt file (in home)', 
        completed: false, 
        command: 'cat config.txt',
        details: 'Use cat again to view the full configuration. Different situations call for different viewing commands.'
      },
      { 
        text: 'View the first 5 lines of test.txt (in home)', 
        completed: false, 
        command: 'head -n 5 test.txt',
        details: 'Practice with head again. You\'re learning when to use each command - full view with cat, preview with head, recent data with tail!'
      }
    ],
    hints: [
      'cat shows the entire file: \'cat filename.txt\'.',
      'head shows the beginning: \'head -n 3 filename.txt\'.',
      'tail shows the end: \'tail -n 4 filename.txt\'.',
      'All files are in your home directory.'
    ],
    reference: {
      'cat': 'Display file contents',
      'less': 'View file with scrolling',
      'head': 'View first lines',
      'tail': 'View last lines'
    },
    xpReward: 150
  },
  {
    id: 5,
    title: 'Mission 5: File Operations',
    story: 'Files are disorganized and there\'s unnecessary junk cluttering the workspace! Practice copying, moving, and removing files to clean everything up.',
    objectives: [
      { 
        text: 'Create a backup copy of config.txt called config_backup.txt', 
        completed: false, 
        command: 'cp config.txt config_backup.txt',
        details: 'Use \'cp config.txt config_backup.txt\' to copy the file. cp stands for "copy" and creates a duplicate with a new name.'
      },
      { 
        text: 'List files to verify the backup was created', 
        completed: false, 
        command: 'ls',
        details: 'Use ls to see all files including your new config_backup.txt. Always good to verify your operations worked!'
      },
      { 
        text: 'Delete the unnecessary junk.txt file', 
        completed: false, 
        command: 'rm junk.txt',
        details: 'Use \'rm junk.txt\' to remove the file. rm stands for "remove" - be careful, there\'s no undo! Always double-check before deleting.'
      },
      { 
        text: 'Rename old.txt to archive.txt', 
        completed: false, 
        command: 'mv old.txt archive.txt',
        details: 'Use \'mv old.txt archive.txt\' to rename (move) the file. mv changes the filename while keeping the same content.'
      },
      { 
        text: 'Move config_backup.txt into the documents directory', 
        completed: false, 
        command: 'mv config_backup.txt documents/',
        details: 'Move the backup file into documents for organization. mv can both rename and move files to different locations.'
      }
    ],
    hints: [
      'Use \'cd ~\' to return home.',
      'Use \'cp source destination\' to copy files.',
      'Use \'rm filename\' to delete files - be careful!',
      'Use \'mv old new\' to rename, or \'mv file directory/\' to move.'
    ],
    reference: {
      'cp': 'Copy files (cp source dest)',
      'mv': 'Move/rename files (mv old new)',
      'rm': 'Remove files (CAREFUL!)',
      'mkdir': 'Create directory'
    },
    xpReward: 250
  },
  {
    id: 6,
    title: 'Review 1: Foundations Checkpoint',
    story: 'Time to prove your skills! Your manager wants to verify you\'ve mastered the basics. Complete these tasks without hints to show you\'re ready for advanced training.',
    startDir: '/home/user/documents',
    objectives: [
      { text: 'List all files in the current directory', completed: false, command: 'ls', details: 'Show what files exist here. Core command for seeing directory contents.' },
      { text: 'View the complete contents of notes.txt (in current directory)', completed: false, command: 'cat notes.txt', details: 'Use cat to display the entire file. Mission 4 taught viewing commands.' },
      { text: 'Check just the first 2 lines of report.txt (in current directory)', completed: false, command: 'head -n 2 report.txt', details: 'Use head to preview the beginning. Shows only what you need.' },
      { text: 'Return to your home directory', completed: false, command: 'cd ~', details: 'Use the tilde shortcut to jump home from anywhere.' },
      { text: 'Check your current location', completed: false, command: 'pwd', details: 'Verify where you are. Always good to confirm location.' },
      { text: 'Create a new file called review1.txt', completed: false, command: 'touch review1.txt', details: 'Use touch to create an empty file from Mission 3.' },
      { text: 'Make a copy called review1_backup.txt', completed: false, command: 'cp review1.txt review1_backup.txt', details: 'Use cp to duplicate the file from Mission 5.' },
      { text: 'Create a directory called review_files', completed: false, command: 'mkdir review_files', details: 'Use mkdir to create a new directory from Mission 3.' },
      { text: 'Move review1_backup.txt into review_files', completed: false, command: 'mv review1_backup.txt review_files/', details: 'Use mv to relocate the file from Mission 5.' },
      { text: 'Delete the original review1.txt file', completed: false, command: 'rm review1.txt', details: 'Use rm carefully to remove files from Mission 5.' },
      { text: 'View the last 3 lines of data.txt (in home)', completed: false, command: 'tail -n 3 data.txt', details: 'Use tail to check the end from Mission 4.' }
    ],
    hints: ['Review commands from Missions 1-5', 'Navigation: cd, pwd, ls', 'Viewing: cat, head, tail', 'Operations: touch, mkdir, cp, mv, rm', 'Use ~ as shortcut for home'],
    reference: {'cd': 'Change directory', 'cd ~': 'Go home (~ = home directory)', 'ls': 'List files', 'pwd': 'Print working directory', 'cat': 'Display file', 'head': 'View beginning', 'tail': 'View end', 'touch': 'Create file', 'mkdir': 'Create directory', 'cp': 'Copy', 'mv': 'Move/rename', 'rm': 'Remove'},
    xpReward: 500
  },
  {
    id: 7,
    title: 'Mission 7: Search and Discover',
    story: 'The server logs are filling up with messages. Your manager needs you to find specific entries and analyze patterns. Time to master grep with different search techniques!',
    objectives: [
      { 
        text: 'Navigate to the logs directory from home', 
        completed: false, 
        command: 'cd ~/logs',
        details: 'Use absolute path ~/logs to navigate directly. The tilde expands to your home directory path.'
      },
      { 
        text: 'Search for ERROR entries in server.log (in current directory)', 
        completed: false, 
        command: 'grep ERROR server.log',
        details: 'Searches for the text "ERROR" in server.log file. grep is case-sensitive by default. Each matching line will be displayed. You\'re now in the logs directory.'
      },
      { 
        text: 'Count how many times ERROR appears in server.log', 
        completed: false, 
        command: 'grep -c ERROR server.log',
        details: 'Use \'grep -c ERROR server.log\' to count matches. The -c flag counts matching lines instead of displaying them. Great for quick statistics.'
      },
      { 
        text: 'Find "user" in access.log (case-insensitive)', 
        completed: false, 
        command: 'grep -i user access.log',
        details: 'Use \'grep -i user access.log\' for case-insensitive search. The -i flag matches "user", "User", "USER", etc. Essential for flexible searching. access.log is in current directory.'
      },
      { 
        text: 'Show Permission errors with line numbers in error.log', 
        completed: false, 
        command: 'grep -n Permission error.log',
        details: 'Use \'grep -n Permission error.log\' to show line numbers. The -n flag helps you locate exactly where in the file each match occurs. error.log is in current directory.'
      }
    ],
    hints: [
      'Use \'cd ~/logs\' to navigate to logs from anywhere.',
      'grep -c counts matching lines: \'grep -c PATTERN file\'.',
      'grep -i ignores case: \'grep -i pattern file\'.',
      'grep -n shows line numbers: \'grep -n PATTERN file\'.'
    ],
    reference: {
      'cd ~/': 'Navigate directly to directory',
      'grep': 'Search for patterns in files',
      'grep -i': 'Case-insensitive search',
      'grep -n': 'Show line numbers',
      'grep -c': 'Count matching lines'
    },
    xpReward: 300
  },
  {
    id: 8,
    title: 'Mission 8: Counting & Analysis',
    story: 'Sometimes you need statistics about files, not just their contents. Learn to count lines, words, and characters - essential for analyzing log files and documents!',
    objectives: [
      { 
        text: 'Count the total lines in data.txt (in home)', 
        completed: false, 
        command: 'wc -l data.txt',
        details: 'Use \'wc -l data.txt\' to count lines. The -l flag counts lines. wc stands for "word count" but does much more!'
      },
      { 
        text: 'Count the words in message.txt (in home)', 
        completed: false, 
        command: 'wc -w message.txt',
        details: 'Use \'wc -w message.txt\' to count words. The -w flag counts words separated by spaces. Useful for analyzing text length.'
      },
      { 
        text: 'Count the characters in config.txt (in home)', 
        completed: false, 
        command: 'wc -c config.txt',
        details: 'Use \'wc -c config.txt\' to count characters (bytes). The -c flag gives you file size in bytes. Great for checking file sizes.'
      },
      { 
        text: 'Get full statistics for users.txt (in home)', 
        completed: false, 
        command: 'wc users.txt',
        details: 'Use \'wc users.txt\' without flags to see everything: lines, words, and characters all at once. Complete file statistics!'
      },
      { 
        text: 'Count how many users are in users.txt (each line = one user)', 
        completed: false, 
        command: 'wc -l users.txt',
        details: 'Each line is one user account. Counting lines tells you how many users exist. Real-world use: auditing accounts!'
      }
    ],
    hints: [
      'wc -l counts lines: \'wc -l filename\'.',
      'wc -w counts words: \'wc -w filename\'.',
      'wc -c counts characters: \'wc -c filename\'.',
      'wc without flags shows all statistics.'
    ],
    reference: {
      'wc': 'Word count - show all stats',
      'wc -l': 'Count lines',
      'wc -w': 'Count words',
      'wc -c': 'Count characters (bytes)'
    },
    xpReward: 250
  },
  {
    id: 9,
    title: 'Mission 9: Power Search',
    story: 'Your team needs specific information from files, including finding what\'s NOT there. Master advanced grep techniques including inverse matching!',
    objectives: [
      { 
        text: 'Find all lines with "developer" in users.txt (in home)', 
        completed: false, 
        command: 'grep developer users.txt',
        details: 'Searches users.txt for any line containing "developer". Perfect for filtering lists and finding specific entries.'
      },
      { 
        text: 'Show all users whose role is NOT "manager"', 
        completed: false, 
        command: 'grep -v manager users.txt',
        details: 'Use \'grep -v manager users.txt\' to invert the match. The -v flag shows lines that DON\'T contain the pattern. Powerful for exclusion filtering.'
      },
      { 
        text: 'Find "admin" in users.txt (any case)', 
        completed: false, 
        command: 'grep -i admin users.txt',
        details: 'Use \'grep -i admin users.txt\' for case-insensitive search. Finds "admin", "Admin", "ADMIN", etc. Essential for flexible searching.'
      },
      { 
        text: 'Find lines in config.txt (in home) that don\'t contain "port"', 
        completed: false, 
        command: 'grep -v port config.txt',
        details: 'Practice inverse matching with -v. This shows all configuration lines except those related to ports. Great for filtering out noise.'
      }
    ],
    hints: [
      'grep searches for text: \'grep PATTERN filename\'.',
      'grep -v shows lines NOT matching: \'grep -v PATTERN file\'.',
      'grep -i ignores case: \'grep -i pattern file\'.'
    ],
    reference: {
      'grep': 'Search text in files',
      'grep word file': 'Find "word" in file',
      'grep -v': 'Show lines NOT matching',
      'grep -i': 'Ignore case'
    },
    xpReward: 300
  },
  {
    id: 10,
    title: 'Mission 10: Finding Files',
    story: 'Files and directories are scattered everywhere! You need to locate specific items by name, pattern, and type. Master find with different search techniques.',
    objectives: [
      { 
        text: 'Find all files matching the pattern "*.txt" using find command', 
        completed: false, 
        command: 'find . -name "*.txt"',
        details: 'Use find with -name flag to search by filename pattern. The dot (.) means current directory. The pattern "*.txt" matches all files ending in .txt.'
      },
      { 
        text: 'Find only directories (not files)', 
        completed: false, 
        command: 'find . -type d',
        details: 'Use \'find . -type d\' to list only directories. The -type d flag filters for directories, ignoring regular files. Great for seeing folder structure.'
      },
      { 
        text: 'Find only regular files (not directories)', 
        completed: false, 
        command: 'find . -type f',
        details: 'Use \'find . -type f\' to list only regular files. The -type f flag filters for files, ignoring directories. Opposite of -type d.'
      },
      { 
        text: 'Find all .log files specifically', 
        completed: false, 
        command: 'find . -name "*.log"',
        details: 'Back to pattern matching - find log files by extension. You can combine -name and -type for even more precise searches!'
      }
    ],
    hints: [
      'Use \'cd ~\' to start from home.',
      'find . -name "PATTERN" searches by name.',
      'find . -type d finds only directories.',
      'find . -type f finds only files.',
      'The dot (.) means "current directory and below".'
    ],
    reference: {
      'find': 'Search for files',
      'find . -name': 'Find by name pattern',
      'find . -type f': 'Find only files',
      'find . -type d': 'Find only directories'
    },
    xpReward: 350
  },
  {
    id: 11,
    title: 'Mission 11: Pipes - The Power Combo',
    story: 'Real power comes from combining commands! The pipe operator (|) lets you send the output of one command as input to another. Think of it like a chain: command1 finds data, then | passes it to command2 for processing. Let\'s learn this step by step!',
    startDir: '/home/user',
    objectives: [
      { 
        text: 'First, see all ERROR lines in logs/server.log', 
        completed: false, 
        command: 'grep ERROR logs/server.log',
        details: 'Start simple - just search for ERROR in the server log. You should see several error lines displayed. This is step 1 of understanding pipes.'
      },
      { 
        text: 'Count those ERROR lines using a pipe', 
        completed: false, 
        command: 'grep ERROR logs/server.log | wc -l',
        details: 'Here\'s the magic! The pipe | takes grep\'s output (all those ERROR lines) and sends it to "wc -l" which counts the lines. Format: grep finds errors | wc counts them.'
      },
      { 
        text: 'Find all .txt files in your home directory', 
        completed: false, 
        command: 'find . -name "*.txt"',
        details: 'Before using pipes, see what find outputs. You\'ll get a long list of .txt files. Too many to read easily! This sets up the next objective.'
      },
      { 
        text: 'Limit that .txt file list to just the first 5 results', 
        completed: false, 
        command: 'find . -name "*.txt" | head -n 5',
        details: 'Use a pipe to limit the output! find lists ALL .txt files | head shows only first 5. The pipe sends find\'s long list to head, which cuts it short.'
      },
      { 
        text: 'Count how many developers exist in users.txt (in home)', 
        completed: false, 
        command: 'grep developer users.txt | wc -l',
        details: 'Combine what you\'ve learned! grep finds lines with "developer" | wc -l counts how many lines matched. Two commands working together!'
      }
    ],
    hints: [
      'The pipe | sends output from command1 to command2.',
      'Think: command1 | command2 means "do command1, then process with command2"',
      'Example: grep ERROR file | wc -l means "find errors, then count them"',
      'Pipes let you combine simple commands into powerful operations!'
    ],
    reference: {
      '|': 'Pipe: send output to another command',
      'grep | wc -l': 'Search then count',
      'find | head': 'Search then limit results',
      'command1 | command2': 'Chain commands together'
    },
    xpReward: 400
  },
  {
    id: 12,
    title: 'Review 2: Search & Analysis Checkpoint',
    story: 'You\'ve learned powerful search and analysis tools. Time to demonstrate your grep, find, and piping skills on real-world tasks!',
    startDir: '/home/user/logs',
    objectives: [
      { text: 'Search for ERROR in server.log (in current directory)', completed: false, command: 'grep ERROR server.log', details: 'Basic grep search from Mission 7. You start in the logs directory.' },
      { text: 'Count how many ERROR entries exist in server.log', completed: false, command: 'grep -c ERROR server.log', details: 'Use grep -c to count matches from Mission 7.' },
      { text: 'Find all lines with "user" in access.log (case-insensitive)', completed: false, command: 'grep -i user access.log', details: 'Use grep -i for case-insensitive search from Mission 7. access.log is in current directory.' },
      { text: 'Show WARNING lines with line numbers in server.log', completed: false, command: 'grep -n WARNING server.log', details: 'Use grep -n to show line numbers from Mission 7.' },
      { text: 'Show lines NOT containing ERROR in server.log', completed: false, command: 'grep -v ERROR server.log', details: 'Use grep -v for inverse matching from Mission 9.' },
      { text: 'Return home', completed: false, command: 'cd ~', details: 'Navigate back to your home directory before the next tasks.' },
      { text: 'List all .txt files in your home tree', completed: false, command: 'find . -name "*.txt"', details: 'Use find with pattern matching from Mission 10.' },
      { text: 'Find only directories (not files)', completed: false, command: 'find . -type d', details: 'Use find -type d to filter directories from Mission 10.' },
      { text: 'Find only regular files', completed: false, command: 'find . -type f', details: 'Use find -type f to filter files from Mission 10.' },
      { text: 'Count how many developers exist in users.txt (in home)', completed: false, command: 'grep developer users.txt | wc -l', details: 'Combine grep and wc with pipe from Mission 11.' },
      { text: 'Find .txt files and show first 3', completed: false, command: 'find . -name "*.txt" | head -n 3', details: 'Chain find and head with pipe from Mission 11.' },
      { text: 'Count total words in message.txt (in home)', completed: false, command: 'cat message.txt | wc -w', details: 'Use cat, pipe, and wc -w from Mission 11.' },
      { text: 'Save ERROR count to error_summary.txt', completed: false, command: 'grep ERROR logs/*.log | wc -l > error_summary.txt', details: 'Combine grep, pipe, wc, and redirect from Mission 11.' },
      { text: 'Append your current directory to error_summary.txt', completed: false, command: 'pwd >> error_summary.txt', details: 'Use >> to append instead of overwrite from Mission 11.' }
    ],
    hints: ['Review Missions 7-11', 'grep: search with -i, -c, -n, -v flags', 'find: search by -name or -type', 'Pipes: command1 | command2', 'Redirect: > (overwrite), >> (append)'],
    reference: {'grep': 'Search patterns', 'grep -i': 'Case-insensitive', 'grep -c': 'Count', 'grep -n': 'Line numbers', 'grep -v': 'Inverse', 'find': 'Find files', 'find -type': 'Filter by type', '|': 'Pipe', 'wc -l': 'Count lines', 'wc -w': 'Count words', '>': 'Redirect', '>>': 'Append'},
    xpReward: 600
  },
  {
    id: 13,
    title: 'Mission 13: Output Redirection',
    story: 'Instead of displaying results on screen, save them to files! Learn to redirect output - a crucial skill for automation and record-keeping.',
    objectives: [
      { 
        text: 'Save your current file listing to inventory.txt', 
        completed: false, 
        command: 'ls > inventory.txt',
        details: 'Redirects ls output to inventory.txt instead of screen. The > operator creates/overwrites the file. Essential for saving command results.'
      },
      { 
        text: 'Save your current location to location.txt', 
        completed: false, 
        command: 'pwd > location.txt',
        details: 'Redirect pwd output to a file. Any command output can be saved this way - great for logging and documentation.'
      },
      { 
        text: 'View the saved location file to verify', 
        completed: false, 
        command: 'cat location.txt',
        details: 'Displays the file you just created. Confirms the redirect worked and shows what pwd captured.'
      },
      { 
        text: 'Create status.txt and append "System Online" to it', 
        completed: false, 
        command: 'echo "System Online" >> status.txt',
        details: 'Appends text to status.txt (creates if doesn\'t exist). The >> operator adds to end without erasing existing content.'
      },
      { 
        text: 'Append "All checks passed" to status.txt', 
        completed: false, 
        command: 'echo "All checks passed" >> status.txt',
        details: 'Practice appending with >>. Unlike >, this adds new content while preserving what\'s already there. Perfect for building files incrementally.'
      }
    ],
    hints: [
      'Use > to redirect output to a file (overwrites).',
      'Use >> to append to a file (adds to end).',
      'Example: ls > output.txt saves the list to a file.',
      'echo "text" >> file.txt adds a line to file.'
    ],
    reference: {
      '>': 'Redirect output (overwrite)',
      '>>': 'Redirect output (append)',
      'echo': 'Print text',
      'command > file': 'Save output to file'
    },
    xpReward: 350
  },
  {
    id: 14,
    title: 'Mission 14: Wildcards',
    story: 'Working with multiple files at once is essential. Master wildcards to match file patterns and perform batch operations like a pro!',
    objectives: [
      { 
        text: 'Show all .txt files using wildcard pattern', 
        completed: false, 
        command: 'ls *.txt',
        details: 'Lists only files ending in .txt. The * wildcard matches any characters. Filters the listing to specific file types.'
      },
      { 
        text: 'Create an archives directory', 
        completed: false, 
        command: 'mkdir archives',
        details: 'Create a new directory to store archived files. Organization is key!'
      },
      { 
        text: 'Copy all .txt files to archives directory', 
        completed: false, 
        command: 'cp *.txt archives/',
        details: 'Copy all matching files at once! The wildcard expands to all .txt files. This is batch operation power.'
      },
      { 
        text: 'List all files to verify the copies', 
        completed: false, 
        command: 'ls archives/',
        details: 'List files in archives directory to verify your batch copy worked. Always check your work after batch operations!'
      }
    ],
    hints: [
      'Use \'cd ~\' to return home.',
      'The asterisk * matches any characters.',
      '*.txt matches all files ending in .txt.',
      'You can use wildcards with most commands: cp *.txt destination/.'
    ],
    reference: {
      '*': 'Match any characters',
      '*.txt': 'All files ending in .txt',
      'file*': 'Files starting with "file"',
      '?': 'Match single character'
    },
    xpReward: 300
  },
  {
    id: 15,
    title: 'Mission 15: Working Directory Mastery',
    story: 'Navigate complex directory structures like a ninja! Time to explore nested folders and master absolute vs relative paths.',
    objectives: [
      { 
        text: 'Start from home and navigate to projects/website', 
        completed: false, 
        command: 'cd ~',
        details: 'Jump to home directory first. Good practice to start from a known location.'
      },
      { 
        text: 'Navigate through multiple directories to website', 
        completed: false, 
        command: 'cd projects/website',
        details: 'Navigates through multiple directories in one command. Goes into projects, then into website subfolder.'
      },
      { 
        text: 'Verify your current location', 
        completed: false, 
        command: 'pwd',
        details: 'Check where you are. You should be at /home/user/projects/website. Always verify after complex navigation.'
      },
      { 
        text: 'Go up two levels to return to home', 
        completed: false, 
        command: 'cd ../..',
        details: 'Navigate up two directory levels at once. Each .. goes up one level. Efficient relative path navigation.'
      },
      { 
        text: 'Navigate to logs using absolute path', 
        completed: false, 
        command: 'cd /home/user/logs',
        details: 'Uses absolute path starting with /. Works from anywhere, unlike relative paths. Unambiguous navigation.'
      }
    ],
    hints: [
      'Use \'cd ~\' to jump home.',
      'You can navigate multiple levels: \'cd projects/website\'.',
      'Use pwd to check location.',
      'Go up levels with ../../ (each .. is one level up).',
      'Absolute paths start with /: /home/user/logs.'
    ],
    reference: {
      'cd path/to/dir': 'Navigate multiple levels',
      'cd /absolute/path': 'Use absolute path',
      'cd ../..': 'Go up two levels',
      'cd ~': 'Jump to home'
    },
    xpReward: 350
  },
  {
    id: 16,
    title: 'Mission 16: Combining Skills',
    story: 'A critical incident! The server is acting up. Use all your skills to investigate logs, find errors, and create a comprehensive report.',
    objectives: [
      { 
        text: 'Create an incident_report directory', 
        completed: false, 
        command: 'mkdir incident_report',
        details: 'Create a directory to organize your investigation. Professional incident response requires organization.'
      },
      { 
        text: 'Search for ERROR entries in all log files', 
        completed: false, 
        command: 'grep ERROR logs/*.log',
        details: 'Searches ALL .log files in logs/ for ERROR. Wildcard lets you search multiple files at once. See all errors first.'
      },
      { 
        text: 'Count errors and save count to incident_report/error_count.txt', 
        completed: false, 
        command: 'grep ERROR logs/*.log | wc -l > incident_report/error_count.txt',
        details: 'Combines grep, pipe, wc, and redirect! Counts errors and saves count to file. This is power!'
      },
      { 
        text: 'Save all ERROR lines to incident_report/errors.txt', 
        completed: false, 
        command: 'grep ERROR logs/*.log > incident_report/errors.txt',
        details: 'Redirect grep output to save all error lines. Creates a full error log for analysis. Essential for troubleshooting.'
      },
      { 
        text: 'Find all log files and save list to incident_report/files_checked.txt', 
        completed: false, 
        command: 'find logs -name "*.log" > incident_report/files_checked.txt',
        details: 'Document which files were analyzed. Complete incident reports show what was checked. Professional documentation.'
      }
    ],
    hints: [
      'Use mkdir to create incident_report directory.',
      'Use wildcards: logs/*.log searches all log files.',
      'Combine grep, pipes, wc, and redirection!',
      'Remember: grep finds patterns, | pipes, wc counts, > saves to file.',
      'You can save to subdirectories: > incident_report/file.txt'
    ],
    reference: {
      'grep pattern files': 'Search multiple files',
      '*.log': 'All .log files',
      '|': 'Pipe to another command',
      '>': 'Save output to file'
    },
    xpReward: 500
  },
  {
    id: 17,
    title: 'Mission 17: The Final Challenge',
    story: 'Congratulations on making it this far! Your final test: complete a complex real-world task using everything you\'ve learned. The company needs a complete system audit with full documentation.',
    objectives: [
      { 
        text: 'Create the system_audit directory', 
        completed: false, 
        command: 'mkdir system_audit',
        details: 'Creates directory for your audit results. Organization first!'
      },
      { 
        text: 'Find all .txt files and save inventory', 
        completed: false, 
        command: 'find . -name "*.txt" > system_audit/txt_inventory.txt',
        details: 'Finds all .txt files and saves list to audit folder. Complete file inventory across entire system.'
      },
      { 
        text: 'Save developer user list from users.txt (in home) to audit directory', 
        completed: false, 
        command: 'grep developer users.txt > system_audit/developers.txt',
        details: 'Extract specific user role information. Audit requires documenting who has what access.'
      },
      { 
        text: 'Count and document total ERROR entries across all logs', 
        completed: false, 
        command: 'grep ERROR logs/*.log | wc -l > system_audit/total_errors.txt',
        details: 'Combines multiple skills: wildcards, grep, pipes, wc, and redirection. This is the complete picture of system health!'
      }
    ],
    hints: [
      'Take it step by step - one objective at a time.',
      'Use \'cd ~\' to start from home.',
      'Use find with > to save file lists.',
      'Use grep to extract specific data.',
      'Combine grep, pipes (|), and wc to count matches.',
      'Save to subdirectory: > system_audit/filename.txt'
    ],
    reference: {
      'mkdir': 'Create directories',
      'find': 'Search for files',
      'grep': 'Search text patterns',
      '*.log': 'All log files',
      'cmd | wc -l > file': 'Count and save'
    },
    xpReward: 1000
  },
  {
    id: 18,
    title: 'Review 3: Advanced Operations Checkpoint',
    story: 'The final skill check before graduation! Show mastery of wildcards, complex navigation, and multi-command operations.',
    startDir: '/home/user',
    objectives: [
      { text: 'Show only .txt files using a pattern', completed: false, command: 'ls *.txt', details: 'Use wildcard to filter file listing from Mission 13.' },
      { text: 'Create a temp directory', completed: false, command: 'mkdir temp', details: 'Create directory for organizing work from Mission 13.' },
      { text: 'Copy all .txt files to temp', completed: false, command: 'cp *.txt temp/', details: 'Batch copy with wildcards from Mission 13.' },
      { text: 'Navigate to projects/website in one command', completed: false, command: 'cd projects/website', details: 'Multi-level navigation from Mission 14.' },
      { text: 'Verify your location', completed: false, command: 'pwd', details: 'Confirm you navigated correctly from Mission 14.' },
      { text: 'Go up two levels to home', completed: false, command: 'cd ../..', details: 'Use relative path with multiple levels from Mission 14.' },
      { text: 'Navigate to logs using absolute path', completed: false, command: 'cd /home/user/logs', details: 'Use full absolute path from Mission 14.' },
      { text: 'Create an analysis directory', completed: false, command: 'mkdir ~/analysis', details: 'Create directory with tilde shortcut.' },
      { text: 'Search all log files for ERROR (in current directory)', completed: false, command: 'grep ERROR *.log', details: 'Use wildcard to search multiple files from Mission 15.' },
      { text: 'Count total errors and save to analysis', completed: false, command: 'grep ERROR *.log | wc -l > ~/analysis/error_count.txt', details: 'Combine grep, pipe, wc, redirect from Mission 15.' },
      { text: 'Save all ERROR lines to analysis', completed: false, command: 'grep ERROR *.log > ~/analysis/all_errors.txt', details: 'Redirect grep output to file from Mission 15.' },
      { text: 'Find all .log files and save list to analysis', completed: false, command: 'find /home/user/logs -name "*.log" > ~/analysis/log_files.txt', details: 'Document files checked from Mission 15.' },
      { text: 'Return home and find all .txt files', completed: false, command: 'cd ~', details: 'Navigate back to continue final tasks.' },
      { text: 'Save txt file inventory to analysis', completed: false, command: 'find . -name "*.txt" > analysis/txt_inventory.txt', details: 'Create comprehensive file inventory from Mission 17.' }
    ],
    hints: ['Review Missions 13-17', 'Wildcards: * matches any characters', 'Navigation: multi-level paths, ../.., absolute paths', 'Combine: grep with wildcards, pipes, redirection', 'Complex operations: multiple commands chained'],
    reference: {'*': 'Wildcard', 'ls *.txt': 'Filter listing', 'cp *.txt dir/': 'Batch copy', 'cd ../..': 'Up levels', 'cd /abs/path': 'Absolute', 'grep pattern *.ext': 'Search multiple', '|': 'Pipe', '>': 'Redirect'},
    xpReward: 600
  },
  {
    id: 19,
    title: 'Final Review: Complete Mastery Assessment',
    story: 'Congratulations on reaching the final challenge! Complete this comprehensive real-world scenario to prove you\'ve mastered everything. Your company needs a full system audit and incident response - use every skill you\'ve learned!',
    startDir: '/home/user',
    objectives: [
      { text: 'Check and verify your starting location', completed: false, command: 'pwd', details: 'Always verify location before major operations.' },
      { text: 'List all files to see what you\'re working with', completed: false, command: 'ls', details: 'Survey the landscape before starting work.' },
      { text: 'Create a master_audit directory', completed: false, command: 'mkdir master_audit', details: 'Organization is critical for complex tasks.' },
      { text: 'Navigate to logs directory', completed: false, command: 'cd logs', details: 'Start investigating the logs.' },
      { text: 'View the last 5 lines of server.log (in current directory)', completed: false, command: 'tail -n 5 server.log', details: 'Check recent activity first - smart troubleshooting.' },
      { text: 'Count total ERROR occurrences across all logs', completed: false, command: 'grep -c ERROR *.log', details: 'Get error statistics across all log files.' },
      { text: 'Find all lines with error (case-insensitive) in server.log', completed: false, command: 'grep -i error server.log', details: 'Case-insensitive catches more issues.' },
      { text: 'Save all ERROR lines to master_audit', completed: false, command: 'grep ERROR *.log > ~/master_audit/all_errors.txt', details: 'Document all errors for analysis.' },
      { text: 'Count and save total error count', completed: false, command: 'grep ERROR *.log | wc -l > ~/master_audit/error_total.txt', details: 'Quantify the problem scope.' },
      { text: 'Show admin activity with line numbers in access.log (in current directory)', completed: false, command: 'grep -n admin access.log', details: 'Track admin access for security audit.' },
      { text: 'Show all non-ERROR lines from server.log (in current directory)', completed: false, command: 'grep -v ERROR server.log', details: 'See normal operations - inverse matching.' },
      { text: 'Return home and search entire tree for .log files', completed: false, command: 'cd ~', details: 'Back to home for comprehensive search.' },
      { text: 'Find and list all .log files', completed: false, command: 'find . -name "*.log"', details: 'Locate all log files in the system.' },
      { text: 'Find only directories in your tree', completed: false, command: 'find . -type d', details: 'Map the directory structure.' },
      { text: 'Save directory listing to audit', completed: false, command: 'find . -type d > master_audit/directory_structure.txt', details: 'Document filesystem layout.' },
      { text: 'Find all .txt files and show first 5', completed: false, command: 'find . -name "*.txt" | head -n 5', details: 'Sample the .txt files present.' },
      { text: 'Copy all .txt files to master_audit', completed: false, command: 'cp *.txt master_audit/', details: 'Batch backup important files.' },
      { text: 'Navigate to projects/website', completed: false, command: 'cd projects/website', details: 'Check the web project area.' },
      { text: 'List files in website directory', completed: false, command: 'ls', details: 'Inventory the website files.' },
      { text: 'Go back up to home using relative path', completed: false, command: 'cd ../..', details: 'Navigate back using relative path skills.' },
      { text: 'Count how many developer accounts exist in users.txt (in home)', completed: false, command: 'grep developer users.txt | wc -l', details: 'Audit user accounts by role.' },
      { text: 'Save developer list to audit', completed: false, command: 'grep developer users.txt > master_audit/developers.txt', details: 'Document developer access.' },
      { text: 'Save complete user list to audit', completed: false, command: 'cat users.txt > master_audit/all_users.txt', details: 'Full user registry for compliance.' },
      { text: 'Create final audit summary', completed: false, command: 'echo "Audit Complete" > master_audit/summary.txt', details: 'Mark the audit as completed - you did it!' }
    ],
    hints: ['This tests EVERYTHING from Missions 1-17', 'Navigation: cd, pwd, ls, cd ~, cd ../.., absolute paths', 'Viewing: cat, head, tail, less', 'Searching: grep with -i, -c, -n, -v, wildcards', 'Finding: find with -name, -type', 'Operations: touch, mkdir, cp, mv, rm, wildcards', 'Analysis: pipes, wc, redirection', 'Take it step by step - you know all these commands!'],
    reference: {'All commands': 'Everything you\'ve learned', 'cd/ls/pwd': 'Navigation', 'cat/head/tail': 'Viewing', 'grep': 'Searching', 'find': 'Finding', 'cp/mv/rm': 'Operations', '|/>': 'Pipes & redirect', '*': 'Wildcards'},
    xpReward: 1500
  }
];

// ===========================
// VIRTUAL FILESYSTEM
// ===========================

class VirtualFileSystem {
  constructor() {
    this.files = {
      '/home/user': {
        type: 'directory',
        contents: {
          'documents': {
            type: 'directory',
            contents: {
              'report.txt': { type: 'file', content: 'Q3 Revenue Report\nTotal: $1.2M\nGrowth: 15%' },
              'notes.txt': { type: 'file', content: 'Meeting notes from yesterday' }
            }
          },
          'logs': {
            type: 'directory',
            contents: {
              'server.log': { type: 'file', content: 'INFO: Server started\nWARNING: High memory usage\nERROR: Connection timeout\nINFO: Request completed\nERROR: Database connection failed' },
              'access.log': { type: 'file', content: 'User admin logged in\nUser bob logged in\nUser alice logged in\nUser admin logged out' },
              'error.log': { type: 'file', content: 'ERROR: File not found\nERROR: Permission denied\nWARNING: Disk space low' }
            }
          },
          'projects': {
            type: 'directory',
            contents: {
              'website': {
                type: 'directory',
                contents: {
                  'index.html': { type: 'file', content: '<html><body>Welcome</body></html>' },
                  'style.css': { type: 'file', content: 'body { margin: 0; }' }
                }
              }
            }
          },
          'message.txt': { type: 'file', content: 'Welcome to TechCorp! Good luck on your first day.' },
          'test.txt': { type: 'file', content: 'This is a test file.' },
          'old.txt': { type: 'file', content: 'This file needs a new name.' },
          'junk.txt': { type: 'file', content: 'Delete me!' },
          'users.txt': { type: 'file', content: 'alice:admin\nbob:developer\ncarol:designer\ndave:developer\neve:manager' },
          'config.txt': { type: 'file', content: 'server_port=8080\ndatabase_host=localhost\ndebug_mode=false\nmax_connections=100' },
          'data.txt': { type: 'file', content: 'Line 1: Apple\nLine 2: Banana\nLine 3: Cherry\nLine 4: Date\nLine 5: Elderberry\nLine 6: Fig\nLine 7: Grape\nLine 8: Honeydew\nLine 9: Kiwi\nLine 10: Lemon' }
        }
      }
    };
    this.currentPath = '/home/user';
  }

  getCurrentDir() {
    return this.getNode(this.currentPath);
  }

  getNode(path) {
    // Start at the root
    let current = this.files['/home/user'];
    
    // If we're asking for root, return it
    if (path === '/home/user') {
      return current;
    }
    
    // Parse the path (everything after /home/user/)
    const relativePath = path.replace('/home/user', '').replace(/^\//, '');
    if (!relativePath) return current;
    
    const parts = relativePath.split('/').filter(p => p);
    
    // Navigate through the path
    for (const part of parts) {
      if (!current) return null;
      
      // Get contents of current directory
      const contents = current.type === 'directory' ? current.contents : current;
      
      if (contents && contents[part]) {
        current = contents[part];
      } else {
        return null;
      }
    }
    
    return current;
  }

  listFiles(path = this.currentPath) {
    const dir = this.getNode(path);
    if (!dir) return null;
    if (dir.type === 'file') return null;
    
    // If it's a directory, get its contents
    if (dir.type === 'directory' && dir.contents) {
      return Object.keys(dir.contents);
    }
    
    // Otherwise, treat the current object as the contents
    return Object.keys(dir).filter(key => key !== 'type');
  }

  readFile(filename) {
    // Handle paths with directories (e.g., logs/server.log)
    if (filename.includes('/')) {
      // Build the full path from current directory
      let fullPath;
      if (filename.startsWith('/')) {
        fullPath = filename;
      } else {
        // Relative path - append to current path
        fullPath = this.currentPath + '/' + filename;
      }
      
      const file = this.getNode(fullPath);
      if (!file) return { error: `cat: ${filename}: No such file or directory` };
      if (file.type === 'directory') return { error: `cat: ${filename}: Is a directory` };
      return { content: file.content };
    }
    
    // Simple filename in current directory
    const dir = this.getCurrentDir();
    if (!dir) return { error: `cat: ${filename}: No such file or directory` };
    
    const contents = dir.type === 'directory' ? dir.contents : dir;
    const file = contents[filename];
    
    if (!file) return { error: `cat: ${filename}: No such file or directory` };
    if (file.type === 'directory') return { error: `cat: ${filename}: Is a directory` };
    return { content: file.content };
  }

  changeDirectory(path) {
    // Strip trailing slashes (except for root /)
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    // Expand tilde (~) to /home/user
    if (path.startsWith('~/')) {
      path = '/home/user/' + path.substring(2);
    } else if (path === '~') {
      path = '/home/user';
    }
    
    if (path === '..') {
      const parts = this.currentPath.split('/').filter(p => p);
      if (parts.length > 2) {
        parts.pop();
        this.currentPath = '/' + parts.join('/');
      } else {
        this.currentPath = '/home/user';
      }
      return { success: true };
    }

    if (path === '/home/user') {
      this.currentPath = '/home/user';
      return { success: true };
    }

    // Handle absolute paths starting with /
    if (path.startsWith('/home/user/')) {
      const newNode = this.getNode(path);
      if (newNode && newNode.type === 'directory') {
        this.currentPath = path;
        return { success: true };
      }
      return { error: `cd: ${path}: No such file or directory` };
    }

    // Handle multi-level paths like "projects/website"
    if (path.includes('/')) {
      const pathParts = path.split('/');
      let currentNode = this.getCurrentDir();
      let newPath = this.currentPath;
      
      for (const part of pathParts) {
        if (!currentNode) {
          return { error: `cd: ${path}: No such file or directory` };
        }
        
        const contents = currentNode.type === 'directory' ? currentNode.contents : currentNode;
        if (contents[part] && contents[part].type === 'directory') {
          newPath += '/' + part;
          currentNode = contents[part];
        } else {
          return { error: `cd: ${path}: No such file or directory` };
        }
      }
      
      this.currentPath = newPath;
      return { success: true };
    }

    // Single-level path
    const dir = this.getCurrentDir();
    if (!dir) return { error: `cd: ${path}: No such file or directory` };
    
    const contents = dir.type === 'directory' ? dir.contents : dir;
    if (contents[path] && contents[path].type === 'directory') {
      this.currentPath += '/' + path;
      return { success: true };
    }

    return { error: `cd: ${path}: No such file or directory` };
  }

  createFile(filename) {
    const dir = this.getCurrentDir();
    if (!dir) return { error: 'Cannot access current directory' };
    
    const contents = dir.type === 'directory' ? dir.contents : dir;
    if (contents[filename]) {
      return { success: true }; // File already exists, touch does nothing
    }
    contents[filename] = { type: 'file', content: '' };
    return { success: true };
  }

  createDirectory(dirname) {
    const dir = this.getCurrentDir();
    if (!dir) return { error: 'Cannot access current directory' };
    
    const contents = dir.type === 'directory' ? dir.contents : dir;
    if (contents[dirname]) {
      return { error: `mkdir: cannot create directory '${dirname}': File exists` };
    }
    contents[dirname] = { type: 'directory', contents: {} };
    return { success: true };
  }

  copyFile(source, dest) {
    const dir = this.getCurrentDir();
    if (!dir) return { error: 'Cannot access current directory' };
    
    const contents = dir.type === 'directory' ? dir.contents : dir;
    if (!contents[source]) {
      return { error: `cp: cannot stat '${source}': No such file or directory` };
    }
    contents[dest] = { ...contents[source] };
    return { success: true };
  }

  moveFile(source, dest) {
    const result = this.copyFile(source, dest);
    if (result.success) {
      this.deleteFile(source);
    }
    return result;
  }

  deleteFile(filename) {
    const dir = this.getCurrentDir();
    if (!dir) return { error: 'Cannot access current directory' };
    
    const contents = dir.type === 'directory' ? dir.contents : dir;
    if (!contents[filename]) {
      return { error: `rm: cannot remove '${filename}': No such file or directory` };
    }
    delete contents[filename];
    return { success: true };
  }
}

// ===========================
// COMMAND PROCESSOR
// ===========================

class CommandProcessor {
  constructor(filesystem) {
    this.fs = filesystem;
    this.commandStats = {};
  }

  trackCommand(cmd) {
    this.commandStats[cmd] = (this.commandStats[cmd] || 0) + 1;
    gameState.commandsUsed++;
  }

  process(input) {
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    this.trackCommand(command);

    // Check for first command achievement
    if (gameState.commandsUsed === 1) {
      unlockAchievement('first_command');
    }

    // Check for pipes and handle them
    if (input.includes('|')) {
      return this.handlePipe(input);
    }
    
    // Check for output redirection
    if (input.includes('>')) {
      return this.handleRedirection(input);
    }

    switch (command) {
      case 'ls':
        return this.ls(args);
      case 'pwd':
        return this.pwd();
      case 'cd':
        return this.cd(args);
      case 'cat':
        return this.cat(args);
      case 'touch':
        return this.touch(args);
      case 'mkdir':
        return this.mkdir(args);
      case 'cp':
        return this.cp(args);
      case 'mv':
        return this.mv(args);
      case 'rm':
        return this.rm(args);
      case 'grep':
        return this.grep(args);
      case 'find':
        return this.find(args);
      case 'head':
        return this.head(args);
      case 'tail':
        return this.tail(args);
      case 'wc':
        return this.wc(args);
      case 'help':
        return this.help();
      case 'clear':
        return { clear: true };
      case 'man':
        return this.man(args);
      case 'echo':
        return { output: args.join(' ') };
      case '':
        return { output: '' };
      default:
        return { error: `Command not found: ${command}. Type 'help' for available commands.` };
    }
  }

  ls(args) {
    let files = this.fs.listFiles();
    if (!files) return { error: 'Cannot list directory' };
    
    // If wildcard pattern provided, filter files
    if (args.length > 0 && args[0].includes('*')) {
      const pattern = args[0].replace(/\*/g, '.*');
      const regex = new RegExp(pattern);
      files = files.filter(f => regex.test(f));
    }
    
    // Check list_master achievement
    if (this.commandStats['ls'] === 10) {
      unlockAchievement('list_master');
    }
    
    return { output: files.join('  ') };
  }

  pwd() {
    return { output: this.fs.currentPath };
  }

  cd(args) {
    if (args.length === 0) {
      this.fs.currentPath = '/home/user';
      return { output: '' };
    }

    const result = this.fs.changeDirectory(args[0]);
    
    if (result.success) {
      // Check navigator achievement
      if (this.commandStats['cd'] === 5) {
        unlockAchievement('navigator');
      }
      return { output: '' };
    }
    
    return { error: result.error };
  }

  cat(args) {
    if (args.length === 0) {
      return { error: 'cat: missing file operand\nUsage: cat FILENAME\nExample: cat message.txt' };
    }

    const result = this.fs.readFile(args[0]);
    if (result.error) return { error: result.error };
    return { output: result.content };
  }

  touch(args) {
    if (args.length === 0) {
      return { error: 'touch: missing file operand\nUsage: touch FILENAME\nExample: touch newfile.txt' };
    }

    const result = this.fs.createFile(args[0]);
    if (result.success) {
      unlockAchievement('file_creator');
    }
    return result.error ? { error: result.error } : { output: '' };
  }

  mkdir(args) {
    if (args.length === 0) {
      return { error: 'mkdir: missing operand\nUsage: mkdir DIRECTORY\nExample: mkdir newfolder' };
    }

    const result = this.fs.createDirectory(args[0]);
    return result.error ? { error: result.error } : { output: '' };
  }

  cp(args) {
    if (args.length === 0) {
      return { error: 'cp: missing file operand\nUsage: cp SOURCE DEST\nExample: cp test.txt backup.txt' };
    }
    if (args.length === 1) {
      return { error: `cp: missing destination file operand after '${args[0]}'\nUsage: cp SOURCE DEST\nExample: cp ${args[0]} backup.txt` };
    }

    const result = this.fs.copyFile(args[0], args[1]);
    return result.error ? { error: result.error } : { output: '' };
  }

  mv(args) {
    if (args.length === 0) {
      return { error: 'mv: missing file operand\nUsage: mv SOURCE DEST\nExample: mv old.txt new.txt' };
    }
    if (args.length === 1) {
      return { error: `mv: missing destination file operand after '${args[0]}'\nUsage: mv SOURCE DEST\nExample: mv ${args[0]} newname.txt` };
    }

    const result = this.fs.moveFile(args[0], args[1]);
    return result.error ? { error: result.error } : { output: '' };
  }

  rm(args) {
    if (args.length === 0) {
      return { error: 'rm: missing operand\nUsage: rm FILENAME\nExample: rm oldfile.txt\nWarning: This will permanently delete the file!' };
    }

    const result = this.fs.deleteFile(args[0]);
    return result.error ? { error: result.error } : { output: '' };
  }

  grep(args) {
    if (args.length < 2) {
      return { error: 'grep: missing pattern or file\nUsage: grep [OPTIONS] PATTERN FILE\nExample: grep ERROR server.log' };
    }

    // Parse flags
    let flags = {
      count: false,      // -c
      caseInsensitive: false,  // -i
      lineNumbers: false,      // -n
      invert: false            // -v
    };
    
    let argIndex = 0;
    
    // Check for flags
    while (argIndex < args.length && args[argIndex].startsWith('-')) {
      const flag = args[argIndex];
      if (flag === '-c') flags.count = true;
      else if (flag === '-i') flags.caseInsensitive = true;
      else if (flag === '-n') flags.lineNumbers = true;
      else if (flag === '-v') flags.invert = true;
      argIndex++;
    }
    
    // Get pattern and filename
    if (argIndex >= args.length - 1) {
      return { error: 'grep: missing pattern or file\nUsage: grep [OPTIONS] PATTERN FILE\nExample: grep -i ERROR server.log' };
    }
    
    const pattern = args[argIndex];
    const filename = args[argIndex + 1];
    
    const result = this.fs.readFile(filename);
    if (result.error) return { error: result.error };
    
    const lines = result.content.split('\n');
    
    // Filter lines based on pattern
    let matches = [];
    lines.forEach((line, index) => {
      let isMatch;
      if (flags.caseInsensitive) {
        isMatch = line.toLowerCase().includes(pattern.toLowerCase());
      } else {
        isMatch = line.includes(pattern);
      }
      
      // Invert match if -v flag
      if (flags.invert) {
        isMatch = !isMatch;
      }
      
      if (isMatch) {
        if (flags.lineNumbers) {
          matches.push(`${index + 1}:${line}`);
        } else {
          matches.push(line);
        }
      }
    });
    
    // Return count if -c flag
    if (flags.count) {
      return { output: matches.length.toString() };
    }
    
    if (matches.length === 0) {
      return { output: '' };
    }
    
    unlockAchievement('grep_guru');
    return { output: matches.join('\n') };
  }

  find(args) {
    if (args.length < 2 || args[0] !== '.') {
      return { error: 'find: usage\nUsage: find . -name PATTERN or find . -type TYPE\nExample: find . -name "*.txt" or find . -type d' };
    }

    const option = args[1];
    
    // Handle -type flag (find by type: d for directories, f for files)
    if (option === '-type') {
      if (args.length < 3) {
        return { error: 'find: -type requires an argument\nUsage: find . -type TYPE\nExample: find . -type d (directories) or find . -type f (files)' };
      }
      
      const typeFilter = args[2];
      
      if (typeFilter !== 'd' && typeFilter !== 'f') {
        return { error: 'find: -type accepts d (directory) or f (file)\nExample: find . -type d' };
      }
      
      const results = [];
      const searchDir = (path, dirObj) => {
        const contents = dirObj.type === 'directory' ? dirObj.contents : dirObj;
        for (const [name, item] of Object.entries(contents)) {
          const fullPath = `${path}/${name}`;
          
          // Filter by type
          if (typeFilter === 'd' && item.type === 'directory') {
            results.push(fullPath);
          } else if (typeFilter === 'f' && item.type === 'file') {
            results.push(fullPath);
          }
          
          // Recurse into directories
          if (item.type === 'directory') {
            searchDir(fullPath, item);
          }
        }
      };
      
      searchDir('.', this.fs.getCurrentDir());
      return { output: results.join('\n') };
    }
    
    // Handle -name flag (find by name pattern)
    if (option === '-name') {
      if (args.length < 3) {
        return { error: 'find: -name requires a pattern\nUsage: find . -name PATTERN\nExample: find . -name "*.txt"' };
      }
      
      const pattern = args[2].replace(/"/g, '').replace(/\*/g, '.*');
      const regex = new RegExp(pattern);
      
      const results = [];
      const searchDir = (path, dirObj) => {
        const contents = dirObj.type === 'directory' ? dirObj.contents : dirObj;
        for (const [name, item] of Object.entries(contents)) {
          const fullPath = `${path}/${name}`;
          if (regex.test(name)) {
            results.push(fullPath);
          }
          if (item.type === 'directory') {
            searchDir(fullPath, item);
          }
        }
      };
      
      searchDir('.', this.fs.getCurrentDir());
      return { output: results.join('\n') };
    }
    
    // Unknown option
    return { error: `find: unknown option '${option}'\nUsage: find . -name PATTERN or find . -type TYPE\nExample: find . -name "*.txt" or find . -type d` };
  }

  head(args) {
    if (args.length === 0) {
      return { error: 'head: missing file\nUsage: head -n NUMBER FILE\nExample: head -n 5 data.txt' };
    }

    let numLines = 10;
    let filename = args[0];
    
    if (args[0] === '-n' && args.length >= 3) {
      numLines = parseInt(args[1]);
      filename = args[2];
    }

    const result = this.fs.readFile(filename);
    if (result.error) return { error: result.error };
    
    const lines = result.content.split('\n');
    return { output: lines.slice(0, numLines).join('\n') };
  }

  tail(args) {
    if (args.length === 0) {
      return { error: 'tail: missing file\nUsage: tail -n NUMBER FILE\nExample: tail -n 5 data.txt' };
    }

    let numLines = 10;
    let filename = args[0];
    
    if (args[0] === '-n' && args.length >= 3) {
      numLines = parseInt(args[1]);
      filename = args[2];
    }

    const result = this.fs.readFile(filename);
    if (result.error) return { error: result.error };
    
    const lines = result.content.split('\n');
    return { output: lines.slice(-numLines).join('\n') };
  }

  wc(args) {
    if (args.length === 0) {
      return { error: 'wc: missing file\nUsage: wc [OPTIONS] FILE\nExample: wc -l data.txt' };
    }

    // Check for flags
    let countLines = false;
    let countWords = false;
    let countChars = false;
    let filename = args[0];
    
    if (args[0] === '-l' || args[0] === '-w' || args[0] === '-c') {
      if (args[0] === '-l') countLines = true;
      else if (args[0] === '-w') countWords = true;
      else if (args[0] === '-c') countChars = true;
      
      filename = args[1];
      
      if (!filename) {
        return { error: `wc: missing file after ${args[0]}` };
      }
    }

    const result = this.fs.readFile(filename);
    if (result.error) return { error: result.error };
    
    const lines = result.content.split('\n').length;
    const words = result.content.split(/\s+/).filter(w => w.length > 0).length;
    const chars = result.content.length;
    
    // Return specific count if flag specified
    if (countLines) {
      return { output: `${lines} ${filename}` };
    }
    if (countWords) {
      return { output: `${words} ${filename}` };
    }
    if (countChars) {
      return { output: `${chars} ${filename}` };
    }
    
    // Default: show all statistics
    return { output: `${lines} ${words} ${chars} ${filename}` };
  }

  handlePipe(input) {
    const commands = input.split('|').map(cmd => cmd.trim());
    
    let output = '';
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      
      if (i === 0) {
        // First command - execute normally
        const result = this.process(cmd);
        if (result.error) return result;
        output = result.output || '';
      } else {
        // Pipe previous output to next command
        const parts = cmd.trim().split(/\s+/);
        const command = parts[0];
        
        if (command === 'wc') {
          if (parts[1] === '-l') {
            const lines = output.split('\n').filter(l => l).length;
            output = lines.toString();
          }
        } else if (command === 'head') {
          const numLines = parts[1] === '-n' ? parseInt(parts[2]) : 10;
          output = output.split('\n').slice(0, numLines).join('\n');
        } else if (command === 'grep') {
          const pattern = parts[1];
          const lines = output.split('\n');
          output = lines.filter(line => line.includes(pattern)).join('\n');
        }
      }
    }
    
    unlockAchievement('pipe_master');
    return { output };
  }

  handleRedirection(input) {
    const isAppend = input.includes('>>');
    const parts = input.split(isAppend ? '>>' : '>').map(p => p.trim());
    
    if (parts.length !== 2) {
      return { error: 'Syntax error in redirection' };
    }
    
    const command = parts[0];
    const filename = parts[1];
    
    // Execute the command
    const result = this.process(command);
    if (result.error) return result;
    
    // Save output to file
    const content = result.output || '';
    
    if (isAppend) {
      // Append to existing file
      const existing = this.fs.readFile(filename);
      const newContent = (existing.error ? '' : existing.content + '\n') + content;
      this.fs.createFile(filename);
      const dir = this.fs.getCurrentDir();
      const contents = dir.type === 'directory' ? dir.contents : dir;
      contents[filename].content = newContent;
    } else {
      // Create/overwrite file
      this.fs.createFile(filename);
      const dir = this.fs.getCurrentDir();
      const contents = dir.type === 'directory' ? dir.contents : dir;
      contents[filename].content = content;
    }
    
    return { output: '' };
  }

  help() {
    return {
      output: `Available Commands:
  ls          - List files in current directory
  pwd         - Print working directory
  cd <dir>    - Change directory
  cat <file>  - Display file contents
  touch <file>- Create empty file
  mkdir <dir> - Create directory
  cp <s> <d>  - Copy file
  mv <s> <d>  - Move/rename file
  rm <file>   - Remove file
  grep <p> <f>- Search for pattern in file
  find . -name- Find files by name
  head -n <f> - View first lines of file
  tail -n <f> - View last lines of file
  wc -l <f>   - Count lines in file
  echo <text> - Print text
  clear       - Clear terminal
  man <cmd>   - Show manual for command
  help        - Show this help message
  
Advanced:
  cmd | cmd   - Pipe output between commands
  cmd > file  - Redirect output to file
  cmd >> file - Append output to file`
    };
  }

  man(args) {
    unlockAchievement('rtfm');
    
    const manPages = {
      ls: 'ls - list directory contents\n\nDESCRIPTION\n  List information about files in the current directory.',
      pwd: 'pwd - print working directory\n\nDESCRIPTION\n  Print the full filename of the current working directory.',
      cd: 'cd - change directory\n\nDESCRIPTION\n  Change the current working directory to the specified directory.',
      cat: 'cat - concatenate files and print\n\nDESCRIPTION\n  Read files sequentially, writing them to standard output.',
      touch: 'touch - change file timestamps\n\nDESCRIPTION\n  Update access/modification times. Creates file if it doesn\'t exist.',
      mkdir: 'mkdir - make directories\n\nDESCRIPTION\n  Create directories if they do not already exist.',
      cp: 'cp - copy files\n\nDESCRIPTION\n  Copy SOURCE to DEST.',
      mv: 'mv - move (rename) files\n\nDESCRIPTION\n  Rename SOURCE to DEST, or move SOURCE to DIRECTORY.',
      rm: 'rm - remove files\n\nDESCRIPTION\n  Remove (unlink) files. Use with caution!',
      grep: 'grep - search for patterns\n\nDESCRIPTION\n  Search for PATTERN in each FILE.\n\nEXAMPLES\n  grep ERROR log.txt\n  grep developer users.txt',
      find: 'find - search for files\n\nDESCRIPTION\n  Search for files in directory hierarchy.\n\nOPTIONS\n  -name PATTERN  Find by filename pattern\n  -type TYPE     Find by type (d=directory, f=file)\n\nEXAMPLES\n  find . -name "*.txt"\n  find . -name config.txt\n  find . -type d\n  find . -type f',
      head: 'head - output first part of files\n\nDESCRIPTION\n  Print the first 10 lines of each FILE.\n\nOPTIONS\n  -n NUM  Print first NUM lines\n\nEXAMPLES\n  head data.txt\n  head -n 5 data.txt',
      tail: 'tail - output last part of files\n\nDESCRIPTION\n  Print the last 10 lines of each FILE.\n\nOPTIONS\n  -n NUM  Print last NUM lines\n\nEXAMPLES\n  tail data.txt\n  tail -n 5 data.txt',
      wc: 'wc - word, line, and byte count\n\nDESCRIPTION\n  Print line, word, and byte counts for each FILE.\n\nOPTIONS\n  -l  Print only line count\n\nEXAMPLES\n  wc data.txt\n  wc -l data.txt'
    };

    if (args.length === 0) {
      return { output: 'What manual page do you want? Try: man ls' };
    }

    const page = manPages[args[0]];
    if (!page) {
      return { error: `No manual entry for ${args[0]}` };
    }

    return { output: page };
  }
}

// ===========================
// TAB COMPLETION
// ===========================

function getTabCompletion(input) {
  if (!input) {
    return { type: 'none' };
  }
  
  // Parse the input to find what we're completing
  const parts = input.trim().split(/\s+/);
  
  // If only one word, complete command names
  if (parts.length === 1) {
    return completeCommand(parts[0]);
  }
  
  // Otherwise, complete file/directory paths
  const command = parts[0];
  const lastArg = parts[parts.length - 1];
  
  // Commands that take file/directory arguments
  const fileCommands = ['cd', 'cat', 'touch', 'mkdir', 'cp', 'mv', 'rm', 'grep', 'find', 'head', 'tail', 'wc', 'ls'];
  
  if (fileCommands.includes(command)) {
    return completePathArgument(input, lastArg);
  }
  
  return { type: 'none' };
}

function completeCommand(partial) {
  const commands = ['ls', 'pwd', 'cd', 'cat', 'touch', 'mkdir', 'cp', 'mv', 'rm', 
                    'grep', 'find', 'head', 'tail', 'wc', 'help', 'clear', 'man', 'echo'];
  
  const matches = commands.filter(cmd => cmd.startsWith(partial));
  
  if (matches.length === 0) {
    return { type: 'none' };
  } else if (matches.length === 1) {
    return { type: 'complete', value: matches[0] + ' ' };
  } else {
    return { type: 'multiple', matches };
  }
}

function completePathArgument(fullInput, partial) {
  // Handle tilde expansion
  if (partial.startsWith('~')) {
    partial = partial.replace('~', '/home/user');
  }
  
  // Determine if it's an absolute or relative path
  let searchPath, prefix, searchPattern;
  
  if (partial.startsWith('/')) {
    // Absolute path
    const lastSlash = partial.lastIndexOf('/');
    searchPath = partial.substring(0, lastSlash) || '/';
    searchPattern = partial.substring(lastSlash + 1);
    prefix = searchPath === '/' ? '/' : searchPath + '/';
  } else {
    // Relative path
    const lastSlash = partial.lastIndexOf('/');
    if (lastSlash === -1) {
      // No slashes - searching in current directory
      searchPath = gameState.filesystem.currentPath;
      searchPattern = partial;
      prefix = '';
    } else {
      // Has slashes - navigate to that directory first
      const dirPath = partial.substring(0, lastSlash);
      searchPattern = partial.substring(lastSlash + 1);
      
      // Resolve the directory path
      if (dirPath === '..') {
        const pathParts = gameState.filesystem.currentPath.split('/').filter(p => p);
        pathParts.pop();
        searchPath = '/' + pathParts.join('/');
      } else if (dirPath === '.') {
        searchPath = gameState.filesystem.currentPath;
      } else {
        // Try to navigate to the directory
        const node = gameState.filesystem.getNode(dirPath);
        if (node && node.type === 'directory') {
          searchPath = node.path;
        } else {
          return { type: 'none' };
        }
      }
      prefix = dirPath + '/';
    }
  }
  
  // Get files in the search directory
  const node = gameState.filesystem.getNode(searchPath);
  if (!node || node.type !== 'directory') {
    return { type: 'none' };
  }
  
  const entries = Object.keys(node.contents || {});
  const matches = entries.filter(name => name.startsWith(searchPattern));
  
  if (matches.length === 0) {
    return { type: 'none' };
  } else if (matches.length === 1) {
    // Check if it's a directory to add trailing slash
    const matchedNode = node.contents[matches[0]];
    const suffix = matchedNode.type === 'directory' ? '/' : ' ';
    
    // Replace the last argument in the full input
    const inputParts = fullInput.split(/\s+/);
    inputParts[inputParts.length - 1] = prefix + matches[0] + suffix;
    
    return { type: 'complete', value: inputParts.join(' ') };
  } else {
    // Multiple matches - add trailing slash for directories
    const formattedMatches = matches.map(name => {
      const matchedNode = node.contents[name];
      return matchedNode.type === 'directory' ? name + '/' : name;
    });
    return { type: 'multiple', matches: formattedMatches };
  }
}

// ===========================
// UI FUNCTIONS
// ===========================

function writeToTerminal(text, className = '') {
  const output = document.getElementById('terminal-output');
  const line = document.createElement('div');
  line.className = 'terminal-line';
  
  if (className) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    line.appendChild(span);
  } else {
    line.textContent = text;
  }
  
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function celebrateLevelUp(newLevel) {
  const levelElement = document.getElementById('player-level');
  
  // Add celebration class to trigger animation
  levelElement.classList.add('level-up-celebration');
  
  // Remove animation class after it completes
  setTimeout(() => {
    levelElement.classList.remove('level-up-celebration');
  }, 2000);
}

function clearTerminal() {
  const output = document.getElementById('terminal-output');
  output.innerHTML = '';
}

function updatePrompt() {
  const prompt = document.getElementById('terminal-prompt');
  const path = gameState.filesystem.currentPath.replace('/home/user', '~');
  prompt.textContent = `user@terminal-quest:${path}$`;
}

function updateStats() {
  document.getElementById('player-level').textContent = gameState.player.level;
  document.getElementById('player-xp').textContent = gameState.player.xp;
  
  const xpPercent = (gameState.player.xp / gameState.player.xpToNextLevel) * 100;
  document.getElementById('xp-fill').style.width = `${xpPercent}%`;

  // Update profile page
  document.getElementById('profile-level').textContent = gameState.player.level;
  document.getElementById('profile-missions').textContent = gameState.player.missionsCompleted;
  document.getElementById('profile-commands').textContent = gameState.commandsUsed;
  document.getElementById('profile-streak').textContent = gameState.player.streak;
  document.getElementById('profile-name').textContent = gameState.player.name;
  document.getElementById('profile-title').textContent = gameState.player.title;
}

function addXP(amount) {
  gameState.player.xp += amount;
  
  while (gameState.player.xp >= gameState.player.xpToNextLevel) {
    gameState.player.xp -= gameState.player.xpToNextLevel;
    gameState.player.level++;
    gameState.player.xpToNextLevel = Math.floor(gameState.player.xpToNextLevel * 1.5);
    
    // Celebrate level up with visual animation instead of terminal message
    celebrateLevelUp(gameState.player.level);
    
    // Update title based on level
    if (gameState.player.level >= 5) gameState.player.title = 'Sysadmin';
    if (gameState.player.level >= 10) gameState.player.title = 'Senior Sysadmin';
    if (gameState.player.level >= 15) gameState.player.title = 'DevOps Engineer';
    if (gameState.player.level >= 20) gameState.player.title = 'Terminal Master';
  }
  
  updateStats();
  saveGame();
}

function unlockAchievement(achievementId) {
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement || achievement.unlocked) return;
  
  achievement.unlocked = true;
  gameState.player.achievements.push(achievementId);
  
  showAchievementNotification(achievement);
  addXP(achievement.xp);
  renderAchievements();
  saveGame();
}

function showAchievementNotification(achievement) {
  const notification = document.getElementById('achievement-notification');
  document.getElementById('notification-achievement-name').textContent = achievement.name;
  document.getElementById('notification-achievement-xp').textContent = `+${achievement.xp} XP`;
  
  notification.classList.remove('hidden');
  
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 4000);
}

function showHintPopup(objective) {
  const overlay = document.getElementById('hint-overlay');
  
  overlay.innerHTML = `
    <div class="hint-bubble">
      <button class="hint-bubble-close" onclick="closeHintPopup()">✕</button>
      
      <div class="hint-bubble-objective">
        ${objective.text}
      </div>
      
      <div class="hint-bubble-description">
        ${objective.details || 'Use the command reference below for help with this objective.'}
      </div>
      
      <div class="hint-bubble-hint-label">
        Hint: Command to Use
      </div>
      
      <div class="hint-bubble-command">
        ${objective.command}
      </div>
    </div>
  `;
  
  overlay.classList.add('visible');
}

function closeHintPopup() {
  const overlay = document.getElementById('hint-overlay');
  overlay.classList.remove('visible');
  
  // Auto-focus terminal input after closing hint
  const terminalInput = document.getElementById('terminal-input');
  if (terminalInput) {
    terminalInput.focus();
  }
}

function loadMission(missionIndex) {
  if (missionIndex >= missions.length) {
    writeToTerminal('🎉 Congratulations! You\'ve completed all available missions!', 'terminal-success');
    writeToTerminal('More missions coming soon...', 'terminal-info');
    return;
  }

  // Clear terminal for new mission (except first mission on game load)
  if (missionIndex > 0) {
    clearTerminal();
  }

  const mission = missions[missionIndex];
  gameState.currentMission = missionIndex;
  gameState.hintsUsed = 0;
  gameState.hintUsedThisMission = false;
  
  // Special handling for missions that use logs directory
  // If filesystem was corrupted by previous missions, restore it
  const missionsNeedingLogs = [6, 10, 11]; // Mission 7, 11, 12 (0-indexed)
  if (missionsNeedingLogs.includes(missionIndex)) {
    const logsPath = '/home/user/logs';
    const logsNode = gameState.filesystem.getNode(logsPath);
    if (!logsNode || logsNode.type !== 'directory') {
      // logs directory doesn't exist, restore fresh filesystem
      gameState.filesystem = new VirtualFileSystem();
      writeToTerminal('Filesystem restored for this mission.', 'terminal-info');
    }
  }
  
  // Save filesystem snapshot BEFORE starting this mission (if not already saved)
  // This allows us to restore to this state if the mission is restarted
  if (!gameState.filesystemSnapshots[missionIndex]) {
    saveFilesystemSnapshot(missionIndex);
  }
  
  // Auto-navigate to mission's starting directory (defaults to home)
  gameState.filesystem.currentPath = mission.startDir || '/home/user';
  
  // Check if this mission has been completed before
  const isMissionCompleted = gameState.completedMissions.includes(missionIndex);
  
  // Set objectives based on whether mission was previously completed
  mission.objectives.forEach(obj => {
    obj.completed = isMissionCompleted;
  });
  
  document.getElementById('mission-title').textContent = mission.title;
  document.getElementById('mission-number').textContent = `${missionIndex + 1}/${missions.length}`;
  document.getElementById('mission-story').textContent = mission.story;
  
  const objectiveList = document.getElementById('objective-list');
  objectiveList.innerHTML = '';
  
  // Reset scroll position of objectives section to top
  const objectiveSection = document.querySelector('.mission-objective');
  if (objectiveSection) {
    objectiveSection.scrollTop = 0;
  }
  
  // Create hint overlay (shared for all objectives)
  let hintOverlay = document.getElementById('hint-overlay');
  if (!hintOverlay) {
    hintOverlay = document.createElement('div');
    hintOverlay.id = 'hint-overlay';
    hintOverlay.className = 'hint-overlay';
    document.body.appendChild(hintOverlay);
    
    // Close on overlay click
    hintOverlay.addEventListener('click', (e) => {
      if (e.target === hintOverlay) {
        closeHintPopup();
      }
    });
  }
  
  mission.objectives.forEach((obj, index) => {
    const li = document.createElement('li');
    li.className = 'objective-item';
    li.dataset.objective = index;
    
    // Mark as completed if objective is already done
    if (obj.completed) {
      li.classList.add('completed');
    }
    
    const statusSpan = document.createElement('span');
    statusSpan.className = 'objective-status';
    statusSpan.textContent = obj.completed ? '✅' : '⬜';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'objective-text';
    textSpan.textContent = obj.text;
    
    li.appendChild(statusSpan);
    li.appendChild(textSpan);
    
    // Add hint button for each objective
    const hintBtn = document.createElement('button');
    hintBtn.className = 'objective-hint-btn';
    hintBtn.textContent = 'Hint';
    hintBtn.dataset.index = index;
    
    hintBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Mark that hint was used for this mission (affects XP)
      if (!gameState.hintUsedThisMission) {
        gameState.hintUsedThisMission = true;
        writeToTerminal('⚠️  Hint used - XP reward reduced by 50%', 'terminal-warning');
      }
      
      // Show hint popup
      showHintPopup(obj);
    });
    
    li.appendChild(hintBtn);
    objectiveList.appendChild(li);
  });
  
  const referenceBox = document.querySelector('.reference-box');
  referenceBox.innerHTML = '';
  for (const [cmd, desc] of Object.entries(mission.reference)) {
    referenceBox.innerHTML += `<div class="reference-item"><code>${cmd}</code> - ${desc}</div>`;
  }
  
  writeToTerminal('', '');
  writeToTerminal(`📋 ${mission.title}`, 'terminal-info');
  writeToTerminal(mission.story, 'terminal-info');
  writeToTerminal('', '');
  
  updateNavigationButtons();
  saveGame();
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-mission-btn');
  const nextBtn = document.getElementById('next-mission-btn');
  
  if (!prevBtn || !nextBtn) return;
  
  const currentMission = gameState.currentMission;
  const maxUnlockedMission = gameState.player.missionsCompleted;
  
  // Previous button: show only if not on first mission
  if (currentMission > 0) {
    prevBtn.classList.add('visible');
  } else {
    prevBtn.classList.remove('visible');
  }
  
  // Next button: show only if there's a next mission unlocked
  if (currentMission < maxUnlockedMission) {
    nextBtn.classList.add('visible');
  } else {
    nextBtn.classList.remove('visible');
  }
}

function saveFilesystemSnapshot(missionIndex) {
  // Deep clone the filesystem state before starting a mission
  gameState.filesystemSnapshots[missionIndex] = JSON.parse(JSON.stringify(gameState.filesystem.files));
}

function restoreFilesystemSnapshot(missionIndex) {
  // Restore filesystem to the state it was before this mission started
  if (gameState.filesystemSnapshots[missionIndex]) {
    gameState.filesystem.files = JSON.parse(JSON.stringify(gameState.filesystemSnapshots[missionIndex]));
  } else {
    // No snapshot exists, create fresh filesystem
    gameState.filesystem = new VirtualFileSystem();
  }
}

function normalizeCommand(command) {
  // Normalize command by removing trailing slashes from directory arguments
  // This allows "cd documents/" to match "cd documents"
  const parts = command.trim().split(/\s+/);
  
  // For cd commands, remove trailing slash from directory argument
  if (parts.length === 2 && parts[0] === 'cd' && parts[1].endsWith('/')) {
    parts[1] = parts[1].slice(0, -1);
  }
  
  return parts.join(' ');
}

function commandsAreEquivalent(command1, command2) {
  // Check if two commands are functionally equivalent
  // Handles cases like "cd logs" vs "cd ~/logs"
  
  const parts1 = command1.trim().split(/\s+/);
  const parts2 = command2.trim().split(/\s+/);
  
  // Must be same command type
  if (parts1[0] !== parts2[0]) {
    return false;
  }
  
  // For cd commands, check if paths lead to same directory
  if (parts1[0] === 'cd' && parts1.length === 2 && parts2.length === 2) {
    const path1 = parts1[1].replace(/\/+$/, ''); // Remove trailing slashes
    const path2 = parts2[1].replace(/\/+$/, '');
    
    // Expand tilde in both paths
    const expandedPath1 = path1.startsWith('~/') ? '/home/user/' + path1.substring(2) : 
                          path1 === '~' ? '/home/user' : path1;
    const expandedPath2 = path2.startsWith('~/') ? '/home/user/' + path2.substring(2) :
                          path2 === '~' ? '/home/user' : path2;
    
    // If one is relative and one is absolute, make them comparable
    const absolutePath1 = expandedPath1.startsWith('/') ? expandedPath1 : '/home/user/' + expandedPath1;
    const absolutePath2 = expandedPath2.startsWith('/') ? expandedPath2 : '/home/user/' + expandedPath2;
    
    return absolutePath1 === absolutePath2;
  }
  
  // For other commands, they must match exactly (after normalization)
  return command1 === command2;
}

function willCommandMatchObjective(command) {
  const mission = missions[gameState.currentMission];
  if (!mission) return false;
  
  // Find the next uncompleted objective
  let nextObjectiveIndex = -1;
  for (let i = 0; i < mission.objectives.length; i++) {
    if (!mission.objectives[i].completed) {
      nextObjectiveIndex = i;
      break;
    }
  }
  
  // If all objectives complete, allow any command
  if (nextObjectiveIndex === -1) {
    return true;
  }
  
  // Extract the base command (first word)
  const baseCommand = command.trim().split(/\s+/)[0];
  
  // Always allow "free roaming" commands - these help with navigation/exploration
  const freeRoamingCommands = ['cd', 'pwd', 'ls', 'clear', 'help', 'man'];
  if (freeRoamingCommands.includes(baseCommand)) {
    return true;
  }
  
  // Check if command matches the next objective
  const nextObj = mission.objectives[nextObjectiveIndex];
  
  // Normalize both commands for comparison (handles trailing slashes)
  const normalizedCommand = normalizeCommand(command);
  const normalizedObjective = normalizeCommand(nextObj.command);
  
  const commandMatches = normalizedCommand === normalizedObjective || 
                         normalizedCommand.startsWith(normalizedObjective + ' ') ||
                         commandsAreEquivalent(normalizedCommand, normalizedObjective);
  
  return commandMatches;
}

function checkObjectives(command) {
  const mission = missions[gameState.currentMission];
  if (!mission) return { matched: false, allComplete: false };
  
  // Find the next uncompleted objective (must be in order)
  let nextObjectiveIndex = -1;
  for (let i = 0; i < mission.objectives.length; i++) {
    if (!mission.objectives[i].completed) {
      nextObjectiveIndex = i;
      break;
    }
  }
  
  // If all objectives are complete already
  if (nextObjectiveIndex === -1) {
    return { matched: false, allComplete: true };
  }
  
  // Check if the command matches the NEXT objective only (no skipping!)
  const nextObj = mission.objectives[nextObjectiveIndex];
  
  // Normalize both commands for comparison (handles trailing slashes)
  const normalizedCommand = normalizeCommand(command);
  const normalizedObjective = normalizeCommand(nextObj.command);
  
  // Check if command matches the objective command
  // First try exact match, then check equivalence (for paths like "cd logs" vs "cd ~/logs")
  const commandMatches = normalizedCommand === normalizedObjective || 
                         normalizedCommand.startsWith(normalizedObjective + ' ') ||
                         commandsAreEquivalent(normalizedCommand, normalizedObjective);
  
  if (commandMatches) {
    // Mark objective as complete
    nextObj.completed = true;
    
    // Update UI
    const objElement = document.querySelector(`[data-objective="${nextObjectiveIndex}"]`);
    if (objElement) {
      objElement.classList.add('completed');
      objElement.querySelector('.objective-status').textContent = '✅';
    }
    
    addXP(25);
    
    // Auto-scroll to next objective
    scrollToNextObjective(nextObjectiveIndex + 1);
    
    // Check if this was the last objective (but don't complete mission yet)
    const allComplete = mission.objectives.every(obj => obj.completed);
    
    return { matched: true, allComplete: allComplete };
  }
  
  return { matched: false, allComplete: false };
}

function scrollToNextObjective(nextIndex) {
  const mission = missions[gameState.currentMission];
  if (!mission || nextIndex >= mission.objectives.length) return;
  
  // Get the next objective element and the scrollable container
  const nextObjElement = document.querySelector(`[data-objective="${nextIndex}"]`);
  const objectiveSection = document.querySelector('.mission-objective');
  
  if (nextObjElement && objectiveSection) {
    // Calculate position of the next objective relative to the container
    const containerRect = objectiveSection.getBoundingClientRect();
    const elementRect = nextObjElement.getBoundingClientRect();
    
    // Check if element is below visible area or above visible area
    const elementTop = elementRect.top - containerRect.top + objectiveSection.scrollTop;
    const elementBottom = elementTop + elementRect.height;
    const visibleTop = objectiveSection.scrollTop;
    const visibleBottom = visibleTop + objectiveSection.clientHeight;
    
    // If next objective is not fully visible, scroll to it
    if (elementBottom > visibleBottom || elementTop < visibleTop) {
      objectiveSection.scrollTo({
        top: elementTop - 20, // 20px padding from top
        behavior: 'smooth'
      });
    }
  }
}

function restartMission(missionIndex) {
  // Remove this mission from completed list to force reset
  const completedIndex = gameState.completedMissions.indexOf(missionIndex);
  if (completedIndex !== -1) {
    gameState.completedMissions.splice(completedIndex, 1);
  }
  
  // Force reset objectives for this mission
  const mission = missions[missionIndex];
  mission.objectives.forEach(obj => {
    obj.completed = false;
  });
  
  // IMPORTANT: Restore filesystem to state BEFORE this mission started
  // This removes files/dirs created during THIS mission, but preserves work from PREVIOUS missions
  restoreFilesystemSnapshot(missionIndex);
  
  // Delete the snapshot so it gets recreated with current state next time mission loads
  delete gameState.filesystemSnapshots[missionIndex];
  
  // Reset to mission's starting directory
  const startDir = mission.startDir || '/home/user';
  gameState.filesystem.currentPath = startDir;
  
  // Now load the mission normally (will also set directory, but we do it early for consistency)
  loadMission(missionIndex);
  
  // Update the prompt to show the new directory
  updatePrompt();
}

function completeMission() {
  const mission = missions[gameState.currentMission];
  
  // Calculate XP reward - reduce by 50% if hint was used
  let xpReward = mission.xpReward;
  if (gameState.hintUsedThisMission) {
    xpReward = Math.floor(xpReward * 0.5);
  }
  
  writeToTerminal('', '');
  writeToTerminal('🎉 MISSION COMPLETE! 🎉', 'terminal-success');
  if (gameState.hintUsedThisMission) {
    writeToTerminal(`You earned ${xpReward} XP (50% penalty for using hints)`, 'terminal-warning');
  } else {
    writeToTerminal(`You earned ${xpReward} XP!`, 'terminal-success');
  }
  writeToTerminal('', '');
  
  addXP(xpReward);
  
  // Track this specific mission as completed (if not already)
  if (!gameState.completedMissions.includes(gameState.currentMission)) {
    gameState.completedMissions.push(gameState.currentMission);
    gameState.player.missionsCompleted++;
  }
  
  // Mission-specific achievements
  if (gameState.currentMission === 0) {
    unlockAchievement('mission_1');
  }
  
  if (gameState.player.missionsCompleted === 5) {
    unlockAchievement('mission_5');
  }
  
  if (!gameState.hintUsedThisMission) {
    unlockAchievement('no_hints');
  }
  
  // Find next incomplete mission to load
  setTimeout(() => {
    const nextMission = findNextIncompleteMission();
    loadMission(nextMission);
  }, 3000);
}

function findNextIncompleteMission() {
  // Find the first mission that hasn't been completed yet
  for (let i = 0; i < missions.length; i++) {
    if (!gameState.completedMissions.includes(i)) {
      return i;
    }
  }
  
  // If all missions are complete, go to the next mission after current
  // (will show "all missions complete" message)
  return gameState.currentMission + 1;
}

function renderAchievements() {
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = '';
  
  achievements.forEach(achievement => {
    const card = document.createElement('div');
    card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
    
    card.innerHTML = `
      <div class="achievement-card-icon">${achievement.icon}</div>
      <div class="achievement-card-name">${achievement.name}</div>
      <div class="achievement-card-description">${achievement.description}</div>
      ${achievement.unlocked ? 
        `<div class="achievement-card-xp">+${achievement.xp} XP</div>` :
        `<div class="achievement-card-locked-text">🔒 Locked</div>`
      }
    `;
    
    grid.appendChild(card);
  });
}

function showResetConfirmation() {
  let overlay = document.getElementById('reset-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'reset-overlay';
    overlay.className = 'reset-overlay';
    document.body.appendChild(overlay);
  }
  
  overlay.innerHTML = `
    <div class="reset-bubble">
      <div class="reset-bubble-icon">⚠️</div>
      <div class="reset-bubble-title">Warning</div>
      <div class="reset-bubble-message">
        You are about to reset your account and will lose all progress.<br>
        Do you wish to continue?
      </div>
      <div class="reset-bubble-buttons">
        <button class="reset-bubble-btn reset-bubble-btn-cancel" onclick="closeResetConfirmation()">Cancel</button>
        <button class="reset-bubble-btn reset-bubble-btn-confirm" onclick="confirmReset()">Reset</button>
      </div>
    </div>
  `;
  
  overlay.classList.add('visible');
}

function closeResetConfirmation() {
  const overlay = document.getElementById('reset-overlay');
  if (overlay) {
    overlay.classList.remove('visible');
  }
}

function confirmReset() {
  // Clear all saved data
  localStorage.removeItem('terminalQuest');
  
  // Reload the page to start fresh
  location.reload();
}

// ===========================
// EVENT LISTENERS
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize game
  gameState.filesystem = new VirtualFileSystem();
  const commandProcessor = new CommandProcessor(gameState.filesystem);
  
  loadGame();
  loadMission(gameState.currentMission);
  updateStats();
  renderAchievements();
  
  // Terminal input
  const terminalInput = document.getElementById('terminal-input');
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent default tab behavior (focus switching)
      
      const currentInput = terminalInput.value;
      const completion = getTabCompletion(currentInput);
      
      if (completion.type === 'complete') {
        // Single match - complete it
        terminalInput.value = completion.value;
      } else if (completion.type === 'multiple') {
        // Multiple matches - show them
        writeToTerminal(`${gameState.filesystem.currentPath.replace('/home/user', '~')}$ ${currentInput}`, 'terminal-text');
        writeToTerminal(completion.matches.join('  '), 'terminal-text');
      }
      // If no matches, do nothing
      
    } else if (e.key === 'Enter') {
      const command = terminalInput.value.trim();
      terminalInput.value = '';
      
      if (command) {
        // Check if command would match objective FIRST (before executing)
        const wouldMatchObjective = willCommandMatchObjective(command);
        
        // Only execute command if it matches objective or is a free roaming command
        if (wouldMatchObjective) {
          // Write command and execute it
          writeToTerminal(`${gameState.filesystem.currentPath.replace('/home/user', '~')}$ ${command}`, 'terminal-command');
          gameState.commandHistory.push(command);
          
          const result = commandProcessor.process(command);
          
          // Mark objective as complete and check if mission complete
          const objectiveResult = checkObjectives(command);
          
          // Color command based on whether it completed an objective
          const lastLine = document.getElementById('terminal-output').lastElementChild;
          if (lastLine) {
            if (objectiveResult.matched) {
              // Command completed the objective - show in green
              lastLine.classList.add('command-correct');
            } else {
              // Free roaming command - show in neutral yellow/cyan
              lastLine.classList.add('command-neutral');
            }
          }
          
          if (result.clear) {
            clearTerminal();
          } else if (result.error) {
            writeToTerminal(result.error, 'terminal-error');
          } else if (result.output) {
            writeToTerminal(result.output, 'terminal-text');
          }
          
          updatePrompt();
          
          // NOW trigger mission completion if all objectives done (AFTER output shown)
          if (objectiveResult.allComplete) {
            completeMission();
          }
        } else {
          // Command doesn't match objective - show it in red and DON'T execute
          writeToTerminal(`${gameState.filesystem.currentPath.replace('/home/user', '~')}$ ${command}`, 'terminal-command');
          const lastLine = document.getElementById('terminal-output').lastElementChild;
          if (lastLine) {
            lastLine.classList.add('command-incorrect');
          }
          writeToTerminal('Command does not match current objective. Check the mission objectives.', 'terminal-error');
        }
      }
    }
  });
  
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(`${page}-page`).classList.add('active');
    });
  });
  
  // Mission Navigation arrows
  const prevMissionBtn = document.getElementById('prev-mission-btn');
  const nextMissionBtn = document.getElementById('next-mission-btn');
  
  if (prevMissionBtn) {
    prevMissionBtn.addEventListener('click', () => {
      if (prevMissionBtn.classList.contains('visible') && gameState.currentMission > 0) {
        writeToTerminal('', '');
        writeToTerminal('⏪ Going back to previous mission...', 'terminal-info');
        writeToTerminal('', '');
        loadMission(gameState.currentMission - 1);
      }
    });
  }
  
  if (nextMissionBtn) {
    nextMissionBtn.addEventListener('click', () => {
      const maxUnlockedMission = gameState.player.missionsCompleted;
      if (nextMissionBtn.classList.contains('visible') && gameState.currentMission < maxUnlockedMission) {
        writeToTerminal('', '');
        writeToTerminal('⏩ Advancing to next mission...', 'terminal-info');
        writeToTerminal('', '');
        loadMission(gameState.currentMission + 1);
      }
    });
  };
  
  // Reset Account button
  const resetBtn = document.getElementById('reset-account-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      showResetConfirmation();
    });
  }
  
  // Restart Mission button
  const restartMissionBtn = document.getElementById('restart-mission-btn');
  if (restartMissionBtn) {
    restartMissionBtn.addEventListener('click', () => {
      const currentMissionIndex = gameState.currentMission;
      const mission = missions[currentMissionIndex];
      const startDir = mission.startDir || '/home/user';
      const displayDir = startDir.replace('/home/user', '~');
      
      writeToTerminal('', '');
      writeToTerminal('🔄 Restarting mission...', 'terminal-info');
      writeToTerminal(`📂 Resetting to: ${displayDir}`, 'terminal-info');
      writeToTerminal('', '');
      restartMission(currentMissionIndex);
      
      // Refocus terminal input so user can immediately start typing
      terminalInput.focus();
    });
  }
  
  // Keep terminal input focused (but not when clicking buttons)
  document.addEventListener('click', (e) => {
    // Don't refocus if clicking on buttons, links, or interactive elements
    if (!e.target.closest('button') && !e.target.closest('a') && !e.target.closest('input')) {
      terminalInput.focus();
    }
  });
});

// ===========================
// SAVE/LOAD SYSTEM
// ===========================

function saveGame() {
  localStorage.setItem('terminalQuest', JSON.stringify({
    player: gameState.player,
    currentMission: gameState.currentMission,
    completedMissions: gameState.completedMissions,
    achievements: achievements.map(a => ({ id: a.id, unlocked: a.unlocked, progress: a.progress }))
  }));
}

function loadGame() {
  const saved = localStorage.getItem('terminalQuest');
  if (saved) {
    const data = JSON.parse(saved);
    Object.assign(gameState.player, data.player);
    gameState.currentMission = data.currentMission || 0;
    gameState.completedMissions = data.completedMissions || [];
    
    if (data.achievements) {
      data.achievements.forEach(savedAch => {
        const ach = achievements.find(a => a.id === savedAch.id);
        if (ach) {
          ach.unlocked = savedAch.unlocked;
          if (savedAch.progress !== undefined) ach.progress = savedAch.progress;
        }
      });
    }
  }
}
