# File Organizer Web - Usage Guide

## 🎯 Quick Access to Your Projects

Your File Organizer Web app is configured to manage files in:

- 📂 `/home/chaps/Downloads` - Your downloads folder
- 📂 `/home/chaps/Documents` - Your documents
- 📂 `/home/chaps/projects` - **All your coding projects!**

This means you can use the web interface to:
- Browse all your project files
- Organize project files by type
- Search across all projects
- Preview files (images, code, docs)
- Move files between projects
- Schedule automatic cleanup

---

## 🚀 Getting Started

### 1. Launch the App

```bash
cd /home/chaps/projects/file-organizer-web
./launch
```

The app will open at: **http://localhost:8080**

### 2. Browse Your Projects

1. Click **"Browse"** in the navigation
2. Click the **"Browse"** button
3. Enter path: `/home/chaps/projects`
4. You'll see all your project folders!

---

## 💡 Common Use Cases

### Organize a Project Directory

**Scenario:** You have a messy project folder with mixed files

1. Navigate to the project folder
2. Click **"Organize"** tab
3. Select organization method:
   - **By Type**: Groups into Code, Docs, Images, etc.
   - **By Date**: Creates year/month folders
   - **By Extension**: Groups all .js, .py, etc.
4. Click **"Generate Preview"** to see what will happen
5. Click **"Apply Changes"** to organize

### Browse All Your Projects

1. Go to Browse tab
2. Navigate to `/home/chaps/projects`
3. See all projects at a glance:
   - `file-organizer/` - CLI version
   - `file-organizer-web/` - This app
   - Future projects...

### Search Across Projects

1. In the Browse tab
2. Navigate to `/home/chaps/projects`
3. Use the search box to find:
   - Specific files by name
   - All Python files (`.py`)
   - All images (`.jpg`, `.png`)
   - README files

### Preview Files Before Moving

1. Click on any file
2. Preview appears (for supported types):
   - **Images**: Thumbnail preview
   - **Text/Code**: First few lines
   - **PDFs**: First page preview
3. Click "Organize" if you want to move it

### Schedule Weekly Cleanup

**Scenario:** Automatically organize Downloads every Sunday

1. Go to **"Schedule"** tab
2. Click **"New Schedule"**
3. Fill in:
   - Name: "Weekly Downloads Cleanup"
   - Path: `/home/chaps/Downloads`
   - Method: "By Type"
   - Frequency: "Weekly"
   - Day: "Sunday"
   - Time: "02:00 AM"
4. Click **"Save"**

### View Organization History

1. Go to **"Dashboard"** tab
2. See statistics:
   - Total files organized
   - Files organized over time (chart)
   - Most organized directories
   - File type distribution
3. Click **"History"** to see detailed log

---

## 🎨 Pro Tips

### Tip 1: Always Preview First

Before organizing large directories:
1. Use **dry-run** mode (the preview)
2. Check what will be moved
3. Make sure it's what you want
4. Then apply changes

### Tip 2: Use Search to Find Files

Lost a file? Use the search:
1. Navigate to parent directory
2. Enter filename or extension
3. Find it instantly
4. See full path and details

### Tip 3: Organize by Extension for Code Projects

For coding projects, organize by extension:
- All `.py` files together
- All `.js` files together
- All `.md` files together
- Keeps related code grouped

### Tip 4: Schedule Maintenance

Set up schedules for:
- **Daily**: Downloads folder cleanup
- **Weekly**: Documents organization
- **Monthly**: Archive old project files

### Tip 5: Check the Dashboard

Visit the dashboard weekly to:
- See how much you've organized
- Identify folders that need attention
- Track your file organization habits

---

## 🔍 Navigating Your Projects Folder

Your projects folder structure:

```
/home/chaps/projects/
├── file-organizer/           # CLI version
│   ├── src/                  # Source code
│   ├── config/              # Configuration
│   ├── examples/            # Usage examples
│   └── tests/               # Test files
│
├── file-organizer-web/      # This web app
│   ├── backend/             # FastAPI server
│   ├── frontend/            # Web interface
│   ├── logs/                # Application logs
│   └── launch               # Start script
│
├── AGENTS.md                # Guidelines for AI coding
├── .gitignore              # Git ignore rules
└── README.md               # Main documentation
```

**Browse any of these in the web interface!**

---

## 🛠️ Advanced Features

### Custom Organization Rules

You can create custom organization rules:

1. Edit `backend/config/custom-rules.json` (create if needed)
2. Define your own categories:

```json
{
  "Python Projects": [".py", ".pyw", ".pyx"],
  "JavaScript Projects": [".js", ".jsx", ".ts", ".tsx"],
  "Config Files": [".json", ".yaml", ".toml", ".ini"],
  "Documentation": [".md", ".rst", ".txt"]
}
```

3. Restart the backend
4. Use your custom rules in the "Organize" tab

### Backup Before Organizing

For important directories:

1. Create a backup first: `cp -r /path/to/dir /path/to/dir.backup`
2. Then organize through the web interface
3. If something goes wrong, restore from backup

### Exclude Certain Files

To prevent organizing specific files:

1. Create a `.fileorganizer-ignore` file in the directory
2. Add patterns to ignore:

```
node_modules/
.git/
*.tmp
.env
```

3. The organizer will skip these files

---

## 📊 Understanding the Dashboard

### Statistics Explained

- **Total Files Organized**: All files moved by the app
- **Total Operations**: Number of times you've run organization
- **Storage Organized**: Total size of files organized
- **Average Files per Operation**: Typical organization size

### Charts

- **Files Over Time**: See your organization activity
- **Operations Timeline**: When you organize most
- **Category Distribution**: What types of files you organize

### History Log

- View every organization operation
- See which files were moved where
- Check for any errors
- Export history as CSV

---

## 🚨 Troubleshooting

### Can't Access a Directory

**Problem**: "Permission denied" or "Path not allowed"

**Solution**: 
1. Check if path is in `ALLOWED_BASE_PATHS`
2. Edit `backend/.env` and add the path
3. Restart: `./launch`

### Files Not Showing

**Problem**: Directory appears empty

**Solutions**:
1. Check if you have read permissions
2. Look for hidden files (enable in settings)
3. Try refreshing the browser

### Organization Failed

**Problem**: "Failed to organize files"

**Solutions**:
1. Check logs: `tail -f logs/backend.log`
2. Ensure you have write permissions
3. Check if files are in use
4. Try dry-run first to test

### Backend Won't Start

**Problem**: Port 8000 already in use

**Solution**:
```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Then launch again
./launch
```

---

## 🎯 Best Practices

1. **Start Small**: Test on small directories first
2. **Use Preview**: Always preview before organizing large folders
3. **Regular Backups**: Back up important files before organizing
4. **Check Logs**: Monitor `logs/backend.log` for issues
5. **Scheduled Tasks**: Set and forget with schedules
6. **Review History**: Periodically check what's been organized

---

## 🔗 Useful URLs

- **Web Interface**: http://localhost:8080
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **GitHub Repo**: https://github.com/chaps843/projects

---

## 💬 Need Help?

1. Check logs: `logs/backend.log` and `logs/frontend.log`
2. Read `README.md` for technical details
3. Check `QUICKSTART.md` for setup issues
4. Review API docs at `/docs`

---

**Happy organizing! 🎉**
