# Saved Directories - Quick Reference

## UI Location
The "Saved Directories" section appears in the **left sidebar**, positioned between:
- "Quick Actions" section (above)
- "Directory Tree" section (below)

## Visual Components

### Header Section
```
┌─────────────────────────────────────┐
│ Saved Directories              [+]  │  ← Click [+] to save current directory
└─────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────┐
│ No saved directories yet            │
└─────────────────────────────────────┘
```

### With Saved Directories
```
┌─────────────────────────────────────┐
│ 📁 Documents              [×]       │  ← Hover to see [×] remove button
│ 📁 Downloads              [×]       │
│ 📁 Projects               [×]       │
└─────────────────────────────────────┘
```

## User Interactions

| Action | Result |
|--------|--------|
| Click [+] button | Saves current directory to list |
| Click directory name | Opens that directory in browser tab |
| Click [×] button | Shows confirmation, then removes directory |
| Hover over directory | Shows full path in tooltip + remove button |

## Toast Notifications

| Action | Notification |
|--------|--------------|
| Save directory | "Success: Saved: [directory name]" |
| Save duplicate | "Info: Directory already saved" |
| Save with no directory | "Error: No directory selected" |
| Remove directory | "Success: Directory removed" |

## LocalStorage Data
**Key**: `savedDirectories`
**Format**:
```json
[
  {
    "name": "Documents",
    "path": "/home/user/Documents"
  },
  {
    "name": "Projects",
    "path": "/home/user/Projects"
  }
]
```

## CSS Classes
- `.saved-dir-item` - Individual directory item
- `.remove-dir-btn` - Remove button (hidden by default, shown on hover)

## JavaScript API
```javascript
// Access the component
savedDirectories.addCurrentDirectory();  // Save current directory
savedDirectories.removeDirectory(path);  // Remove by path
savedDirectories.render();               // Re-render the list
```

## File Paths
- Component: `/frontend/static/js/components/saved-directories.js`
- Styles: `/frontend/static/css/main.css` (lines ~145-165)
- HTML: `/frontend/index.html` (sidebar section ~96-106)
