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
  commandHistory: [],
  filesystem: null,
  currentDirectory: '/home/user'
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
    story: 'Welcome to TechCorp! You\'ve just been hired as a junior sysadmin. Your first task is to familiarize yourself with the terminal. Let\'s start with the basics - listing files.',
    objectives: [
      { text: 'Type \'ls\' to list files', completed: false, command: 'ls' },
      { text: 'Type \'pwd\' to see your current location', completed: false, command: 'pwd' }
    ],
    hints: [
      'The \'ls\' command stands for "list". It shows you what files and folders are in your current location.',
      'The \'pwd\' command means "print working directory". It tells you exactly where you are in the filesystem.'
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
    story: 'Great job! Your manager is impressed. Now she wants you to explore the filesystem. There\'s a directory called "documents" that you need to investigate.',
    objectives: [
      { text: 'Change to the documents directory', completed: false, command: 'cd documents' },
      { text: 'List the files in documents', completed: false, command: 'ls' },
      { text: 'Go back to home directory', completed: false, command: 'cd ..' }
    ],
    hints: [
      'Use \'cd documents\' to change into the documents directory.',
      'After moving to a directory, use \'ls\' to see what\'s inside.',
      'The .. notation means "parent directory". Use \'cd ..\' to go back.'
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
    story: 'A developer needs you to create some files for a new project. Time to learn file manipulation!',
    objectives: [
      { text: 'Create a file called README.md', completed: false, command: 'touch README.md' },
      { text: 'Create a directory called src', completed: false, command: 'mkdir src' },
      { text: 'Verify your files were created', completed: false, command: 'ls' }
    ],
    hints: [
      'Use \'touch <filename>\' to create a new empty file.',
      'Use \'mkdir <dirname>\' to create a new directory (folder).',
      'Always verify your work with \'ls\'!'
    ],
    reference: {
      'touch': 'Create an empty file',
      'mkdir': 'Make directory (create folder)',
      'ls': 'List files to verify'
    },
    xpReward: 200
  },
  {
    id: 4,
    title: 'Mission 4: Reading Files',
    story: 'Someone left an important note in a file. You need to read it without opening a text editor.',
    objectives: [
      { text: 'Read the contents of message.txt', completed: false, command: 'cat message.txt' }
    ],
    hints: [
      'The \'cat\' command displays file contents. Use \'cat message.txt\'.',
      'cat stands for "concatenate" but is commonly used to display files.'
    ],
    reference: {
      'cat': 'Display file contents',
      'less': 'View file with scrolling',
      'head': 'Show first lines of file',
      'tail': 'Show last lines of file'
    },
    xpReward: 150
  },
  {
    id: 5,
    title: 'Mission 5: File Operations',
    story: 'Files need to be organized. Practice copying, moving, and removing files.',
    objectives: [
      { text: 'Copy test.txt to backup.txt', completed: false, command: 'cp test.txt backup.txt' },
      { text: 'Rename old.txt to new.txt', completed: false, command: 'mv old.txt new.txt' },
      { text: 'Delete the file junk.txt', completed: false, command: 'rm junk.txt' }
    ],
    hints: [
      'Use \'cp source destination\' to copy files.',
      'Use \'mv old new\' to rename (move) files.',
      'Use \'rm filename\' to delete files. Be careful - there\'s no undo!'
    ],
    reference: {
      'cp': 'Copy files (cp source dest)',
      'mv': 'Move/rename files (mv old new)',
      'rm': 'Remove files (CAREFUL!)',
      'rm -r': 'Remove directories recursively'
    },
    xpReward: 250
  },
  {
    id: 6,
    title: 'Mission 6: Search and Discover',
    story: 'The server logs are filling up with errors. Your manager needs you to find all ERROR messages in the log files. Time to learn grep - the search master!',
    objectives: [
      { text: 'Go to the logs directory: cd logs', completed: false, command: 'cd logs' },
      { text: 'Search for ERROR in server.log: grep ERROR server.log', completed: false, command: 'grep ERROR server.log' },
      { text: 'Search for User in access.log: grep User access.log', completed: false, command: 'grep User access.log' }
    ],
    hints: [
      'Type exactly: cd logs',
      'Then type: grep ERROR server.log',
      'grep searches for text patterns in files. Format: grep PATTERN filename'
    ],
    reference: {
      'grep': 'Search for patterns in files',
      'grep -i': 'Case-insensitive search',
      'grep -n': 'Show line numbers',
      'grep -c': 'Count matching lines'
    },
    xpReward: 300
  },
  {
    id: 7,
    title: 'Mission 7: File Viewing',
    story: 'The data.txt file is huge! You don\'t need to see all of it - just the beginning and end. Learn to peek at files efficiently.',
    objectives: [
      { text: 'Go back to home directory: cd ~', completed: false, command: 'cd ~' },
      { text: 'View first 3 lines: head -n 3 data.txt', completed: false, command: 'head -n 3 data.txt' },
      { text: 'View last 3 lines: tail -n 3 data.txt', completed: false, command: 'tail -n 3 data.txt' }
    ],
    hints: [
      'Use \'cd ~\' or \'cd\' to return home.',
      'head shows the top of a file: head -n 3 filename',
      'tail shows the bottom of a file: tail -n 3 filename'
    ],
    reference: {
      'head': 'View start of file',
      'head -n': 'Specify number of lines',
      'tail': 'View end of file',
      'tail -n': 'Specify number of lines'
    },
    xpReward: 250
  },
  {
    id: 8,
    title: 'Mission 8: Power Search',
    story: 'Your team needs a list of all developers. The users.txt file contains user roles, but you need to filter it. Time to master grep!',
    objectives: [
      { text: 'Find all developers: grep developer users.txt', completed: false, command: 'grep developer users.txt' },
      { text: 'Search for port: grep port config.txt', completed: false, command: 'grep port config.txt' }
    ],
    hints: [
      'grep searches for text patterns in files.',
      'grep developer users.txt will find lines containing "developer".',
      'Try grep port config.txt to find port settings.'
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
    id: 9,
    title: 'Mission 9: Finding Files',
    story: 'There are files scattered everywhere! You need to locate specific files by name. The find command is your new best friend.',
    objectives: [
      { text: 'Find all .txt files: find . -name "*.txt"', completed: false, command: 'find . -name "*.txt"' },
      { text: 'Find config.txt: find . -name config.txt', completed: false, command: 'find . -name config.txt' }
    ],
    hints: [
      'find searches for files by name or pattern.',
      'Use: find . -name "*.txt" to find all .txt files',
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
    id: 10,
    title: 'Mission 10: Pipes - The Power Combo',
    story: 'Real power comes from combining commands! Use pipes (|) to chain commands together. Your manager wants a sorted list of unique log types.',
    objectives: [
      { text: 'Count ERROR lines: grep ERROR logs/server.log | wc -l', completed: false, command: 'grep ERROR logs/server.log | wc -l' },
      { text: 'List first 5 .txt files: find . -name "*.txt" | head -n 5', completed: false, command: 'find . -name "*.txt" | head -n 5' }
    ],
    hints: [
      'The pipe | sends output from one command to another.',
      'grep ERROR file | wc -l counts matching lines.',
      'find can be piped to head to limit results.'
    ],
    reference: {
      '|': 'Pipe: send output to another command',
      'wc -l': 'Count lines',
      'wc -w': 'Count words',
      'command1 | command2': 'Chain commands'
    },
    xpReward: 400
  },
  {
    id: 11,
    title: 'Mission 11: Output Redirection',
    story: 'Instead of displaying results on screen, save them to files! Learn to redirect output - a crucial skill for automation.',
    objectives: [
      { text: 'Save ls output: ls > filelist.txt', completed: false, command: 'ls > filelist.txt' },
      { text: 'View the file: cat filelist.txt', completed: false, command: 'cat filelist.txt' },
      { text: 'Append text: echo "admin" >> info.txt', completed: false, command: 'echo "admin" >> info.txt' }
    ],
    hints: [
      'Use > to redirect output to a file (overwrites).',
      'Use >> to append to a file (adds to end).',
      'Example: ls > output.txt saves the list to a file.'
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
    id: 12,
    title: 'Mission 12: Wildcards',
    story: 'Working with multiple files at once is essential. Master wildcards to match file patterns like a pro!',
    objectives: [
      { text: 'List all .txt files: ls *.txt', completed: false, command: 'ls *.txt' },
      { text: 'Create backup and copy files: mkdir backup && cp *.txt backup/', completed: false, command: 'mkdir backup && cp *.txt backup/' }
    ],
    hints: [
      'The asterisk * matches any characters.',
      '*.txt matches all files ending in .txt',
      'You can use wildcards with most commands: ls *.txt, rm *.log, etc.'
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
    id: 13,
    title: 'Mission 13: Working Directory Mastery',
    story: 'Navigate complex directory structures like a ninja! Time to explore nested folders and master absolute vs relative paths.',
    objectives: [
      { text: 'Navigate to nested dir: cd projects/website', completed: false, command: 'cd projects/website' },
      { text: 'List files: ls', completed: false, command: 'ls' },
      { text: 'Jump to home: cd ~', completed: false, command: 'cd ~' },
      { text: 'Use absolute path: cd /home/user/logs', completed: false, command: 'cd /home/user/logs' }
    ],
    hints: [
      'You can navigate multiple levels: cd projects/website',
      'Absolute paths start with /: /home/user/logs',
      'Relative paths are from current location: ../documents',
      'Use ~ to mean home directory: cd ~/projects'
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
    id: 14,
    title: 'Mission 14: Combining Skills',
    story: 'A critical incident! The server is acting up. Use all your skills to investigate logs, find errors, and create a report.',
    objectives: [
      { text: 'Find all ERRORs: grep ERROR logs/*.log', completed: false, command: 'grep ERROR logs/*.log' },
      { text: 'Save count: grep ERROR logs/*.log | wc -l > report.txt', completed: false, command: 'grep ERROR logs/*.log | wc -l > report.txt' },
      { text: 'View report: cat report.txt', completed: false, command: 'cat report.txt' }
    ],
    hints: [
      'Use wildcards to search multiple files: logs/*.log',
      'Combine grep, pipes, wc, and redirection!',
      'Remember: grep finds patterns, wc counts, > saves to file.'
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
    id: 15,
    title: 'Mission 15: The Final Challenge',
    story: 'Congratulations on making it this far! Your final test: complete a complex real-world task using everything you\'ve learned. The company needs a complete audit.',
    objectives: [
      { text: 'Create audit directory: mkdir audit', completed: false, command: 'mkdir audit' },
      { text: 'List all .txt files: find . -name "*.txt" > audit/all_txt_files.txt', completed: false, command: 'find . -name "*.txt" > audit/all_txt_files.txt' },
      { text: 'Copy log files: cp logs/*.log audit/', completed: false, command: 'cp logs/*.log audit/' },
      { text: 'Count entries: cat logs/*.log | wc -l > audit/total_entries.txt', completed: false, command: 'cat logs/*.log | wc -l > audit/total_entries.txt' },
      { text: 'Verify: ls audit', completed: false, command: 'ls audit' }
    ],
    hints: [
      'Take it step by step - one objective at a time.',
      'Use find with > to save file lists.',
      'Use cp with wildcards to copy multiple files.',
      'Use cat with wildcards to combine files, then pipe to wc.'
    ],
    reference: {
      'mkdir': 'Create directories',
      'find': 'Search for files',
      'cp': 'Copy files',
      '*.log': 'All log files',
      'cat files | wc -l': 'Count total lines'
    },
    xpReward: 1000
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
    const dir = this.getCurrentDir();
    if (!dir) return { error: `cat: ${filename}: No such file or directory` };
    
    const contents = dir.type === 'directory' ? dir.contents : dir;
    const file = contents[filename];
    
    if (!file) return { error: `cat: ${filename}: No such file or directory` };
    if (file.type === 'directory') return { error: `cat: ${filename}: Is a directory` };
    return { content: file.content };
  }

  changeDirectory(path) {
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

    if (path === '~' || path === '/home/user') {
      this.currentPath = '/home/user';
      return { success: true };
    }

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
      return { error: 'grep: missing pattern or file\nUsage: grep PATTERN FILE\nExample: grep ERROR server.log' };
    }

    const pattern = args[0];
    const filename = args[1];
    
    const result = this.fs.readFile(filename);
    if (result.error) return { error: result.error };
    
    const lines = result.content.split('\n');
    const matches = lines.filter(line => line.includes(pattern));
    
    if (matches.length === 0) {
      return { output: '' };
    }
    
    unlockAchievement('grep_guru');
    return { output: matches.join('\n') };
  }

  find(args) {
    if (args.length < 2 || args[0] !== '.') {
      return { error: 'find: usage\nUsage: find . -name PATTERN\nExample: find . -name "*.txt"' };
    }

    if (args[1] !== '-name' || args.length < 3) {
      return { error: 'find: -name option required\nUsage: find . -name PATTERN\nExample: find . -name "*.txt"' };
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
      return { error: 'wc: missing file\nUsage: wc -l FILE\nExample: wc -l data.txt' };
    }

    const countLines = args[0] === '-l';
    const filename = countLines ? args[1] : args[0];
    
    if (countLines && !filename) {
      return { error: 'wc: missing file after -l' };
    }

    const result = this.fs.readFile(filename);
    if (result.error) return { error: result.error };
    
    if (countLines) {
      const lines = result.content.split('\n').length;
      return { output: lines.toString() };
    }
    
    const lines = result.content.split('\n').length;
    const words = result.content.split(/\s+/).length;
    const chars = result.content.length;
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
      find: 'find - search for files\n\nDESCRIPTION\n  Search for files in directory hierarchy.\n\nEXAMPLES\n  find . -name "*.txt"\n  find . -name config.txt',
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
    
    writeToTerminal(`🎉 LEVEL UP! You are now level ${gameState.player.level}!`, 'terminal-success');
    
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

function loadMission(missionIndex) {
  if (missionIndex >= missions.length) {
    writeToTerminal('🎉 Congratulations! You\'ve completed all available missions!', 'terminal-success');
    writeToTerminal('More missions coming soon...', 'terminal-info');
    return;
  }

  const mission = missions[missionIndex];
  gameState.currentMission = missionIndex;
  gameState.hintsUsed = 0;
  
  document.getElementById('mission-title').textContent = mission.title;
  document.getElementById('mission-number').textContent = `${missionIndex + 1}/${missions.length}`;
  document.getElementById('mission-story').textContent = mission.story;
  
  const objectiveList = document.getElementById('objective-list');
  objectiveList.innerHTML = '';
  
  mission.objectives.forEach((obj, index) => {
    const li = document.createElement('li');
    li.className = 'objective-item';
    li.dataset.objective = index;
    li.innerHTML = `
      <span class="objective-status">⬜</span>
      <span class="objective-text">${obj.text}</span>
    `;
    objectiveList.appendChild(li);
  });
  
  const referenceBox = document.querySelector('.reference-box');
  referenceBox.innerHTML = '';
  for (const [cmd, desc] of Object.entries(mission.reference)) {
    referenceBox.innerHTML += `<code>${cmd}</code> - ${desc}<br>`;
  }
  
  document.getElementById('hint-btn').textContent = `Show Hint (${mission.hints.length} available)`;
  document.getElementById('hint-text').classList.add('hidden');
  
  writeToTerminal('', '');
  writeToTerminal(`📋 ${mission.title}`, 'terminal-info');
  writeToTerminal(mission.story, 'terminal-info');
  writeToTerminal('', '');
  
  saveGame();
}

function checkObjectives(command) {
  const mission = missions[gameState.currentMission];
  if (!mission) return;
  
  let allComplete = true;
  let anyCompleted = false;
  
  mission.objectives.forEach((obj, index) => {
    if (!obj.completed && command.includes(obj.command.split(' ')[0])) {
      obj.completed = true;
      anyCompleted = true;
      
      const objElement = document.querySelector(`[data-objective="${index}"]`);
      objElement.classList.add('completed');
      objElement.querySelector('.objective-status').textContent = '✅';
      
      writeToTerminal(`✓ Objective complete: ${obj.text}`, 'terminal-success');
      addXP(25);
    }
    
    if (!obj.completed) allComplete = false;
  });
  
  if (allComplete) {
    completeMission();
  }
}

function completeMission() {
  const mission = missions[gameState.currentMission];
  
  writeToTerminal('', '');
  writeToTerminal('🎉 MISSION COMPLETE! 🎉', 'terminal-success');
  writeToTerminal(`You earned ${mission.xpReward} XP!`, 'terminal-success');
  writeToTerminal('', '');
  
  addXP(mission.xpReward);
  gameState.player.missionsCompleted++;
  
  // Mission-specific achievements
  if (gameState.currentMission === 0) {
    unlockAchievement('mission_1');
  }
  
  if (gameState.player.missionsCompleted === 5) {
    unlockAchievement('mission_5');
  }
  
  if (gameState.hintsUsed === 0) {
    unlockAchievement('no_hints');
  }
  
  setTimeout(() => {
    loadMission(gameState.currentMission + 1);
  }, 3000);
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
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim();
      terminalInput.value = '';
      
      if (command) {
        writeToTerminal(`${gameState.filesystem.currentPath.replace('/home/user', '~')}$ ${command}`, 'terminal-command');
        gameState.commandHistory.push(command);
        
        const result = commandProcessor.process(command);
        
        if (result.clear) {
          clearTerminal();
        } else if (result.error) {
          writeToTerminal(result.error, 'terminal-error');
        } else if (result.output) {
          writeToTerminal(result.output, 'terminal-text');
        }
        
        updatePrompt();
        checkObjectives(command);
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
  
  // Hint button
  document.getElementById('hint-btn').addEventListener('click', () => {
    const mission = missions[gameState.currentMission];
    if (!mission) return;
    
    const hintText = document.getElementById('hint-text');
    
    if (hintText.classList.contains('hidden')) {
      const hint = mission.hints[gameState.hintsUsed] || mission.hints[mission.hints.length - 1];
      hintText.textContent = hint;
      hintText.classList.remove('hidden');
      gameState.hintsUsed++;
      
      const remaining = Math.max(0, mission.hints.length - gameState.hintsUsed);
      document.getElementById('hint-btn').textContent = `Show Next Hint (${remaining} remaining)`;
    } else {
      if (gameState.hintsUsed < mission.hints.length) {
        const hint = mission.hints[gameState.hintsUsed];
        hintText.textContent = hint;
        gameState.hintsUsed++;
        
        const remaining = Math.max(0, mission.hints.length - gameState.hintsUsed);
        document.getElementById('hint-btn').textContent = `Show Next Hint (${remaining} remaining)`;
      }
    }
  });
  
  // Keep terminal input focused
  document.addEventListener('click', () => {
    terminalInput.focus();
  });
});

// ===========================
// SAVE/LOAD SYSTEM
// ===========================

function saveGame() {
  localStorage.setItem('terminalQuest', JSON.stringify({
    player: gameState.player,
    currentMission: gameState.currentMission,
    achievements: achievements.map(a => ({ id: a.id, unlocked: a.unlocked, progress: a.progress }))
  }));
}

function loadGame() {
  const saved = localStorage.getItem('terminalQuest');
  if (saved) {
    const data = JSON.parse(saved);
    Object.assign(gameState.player, data.player);
    gameState.currentMission = data.currentMission || 0;
    
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
