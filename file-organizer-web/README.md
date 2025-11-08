# File Organizer Web - Full-Stack Application

A beautiful, feature-rich web application for organizing files with scheduling, analytics, and more!

## 🚀 Quick Start (Super Easy!)

### One Command Launch 🎯

```bash
cd /home/chaps/projects/file-organizer-web
./launch
```

That's it! The script will:
- ✅ Run setup if needed (first time only)
- ✅ Start the backend server
- ✅ Start the frontend server
- ✅ Open your browser automatically
- ✅ Show you logs and status

Press **Ctrl+C** to stop everything.

---

### Manual Setup (Alternative)

If you prefer to do it manually:

**1. First-time setup:**
```bash
./setup.sh
```

**2. Start servers:**
```bash
# Option A: All-in-one launcher
./launch

# Option B: Separate terminals
./start-backend.sh    # Terminal 1
./start-frontend.sh   # Terminal 2
```

**3. Access:**
- **Web Interface:** http://localhost:8080
- **API Docs:** http://localhost:8000/docs

## ✨ Features

### 🗂️ File Browser
- Navigate directories with breadcrumb navigation
- Search files by name or type
- Multiple view modes (list/grid)
- File previews (images, text, PDFs)
- File information panels

### 🎯 Smart Organization
- Organize by file type (12 categories)
- Organize by date (year/month folders)
- Preview before organizing
- Dry-run mode for safety
- Undo functionality

### ⏰ Scheduling
- Schedule automatic organization
- Cron expressions support
- Interval-based schedules (daily, weekly)
- Enable/disable jobs
- Manual trigger option

### 📊 Analytics Dashboard
- Total files organized
- Storage statistics
- Operation history timeline
- File type distribution charts
- Recent operations log

### 🎨 Beautiful UI
- Modern gradient design
- Fully responsive
- Smooth animations
- Toast notifications
- Dark theme support (coming soon)

## 📁 Project Structure

```
file-organizer-web/
├── backend/                 # FastAPI backend
│   ├── api/                # API endpoints
│   ├── models/             # Database models
│   ├── schemas/            # Pydantic schemas
│   ├── services/           # Business logic
│   ├── core/               # Configuration
│   ├── main.py             # Entry point
│   └── requirements.txt    # Dependencies
│
└── frontend/               # Vanilla JS frontend
    ├── static/
    │   ├── css/           # Stylesheets
    │   └── js/            # JavaScript modules
    └── index.html         # Single-page app
```

## 🔧 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL databases with Python type hints
- **APScheduler** - Background job scheduling
- **Pillow** - Image processing for previews
- **Loguru** - Beautiful logging

### Frontend
- **Bootstrap 5** - UI framework
- **Chart.js** - Data visualization
- **Font Awesome** - Icons
- **Vanilla JavaScript** - No heavy frameworks

## 🔒 Security

- Path validation to prevent directory traversal
- CORS configuration for cross-origin requests
- Allowed paths whitelist
- Safe file operations
- Input validation

## 📖 Documentation

- **Backend docs**: `backend/README.md`
- **Frontend docs**: `frontend/README.md`
- **API reference**: `http://localhost:8000/docs` (when running)
- **Quick reference**: `backend/QUICK_REFERENCE.md`

## 🎯 Usage Examples

### Organize Downloads Folder

1. Open the app at http://localhost:8080
2. Navigate to your Downloads folder in the file browser
3. Click "Organize" tab
4. Select "By Type" organization
5. Click "Preview" to see what will happen
6. Click "Execute" to organize

### Schedule Weekly Cleanup

1. Go to "Schedule" tab
2. Click "New Schedule"
3. Name: "Weekly Downloads Cleanup"
4. Path: `/home/user/Downloads`
5. Type: "By Type"
6. Frequency: "Weekly - Sunday 2:00 AM"
7. Click "Save"

### View Analytics

1. Go to "Dashboard" tab
2. View statistics and charts
3. See recent operations
4. Export data if needed

## 🐛 Troubleshooting

**Backend won't start:**
- Check Python version (3.9+)
- Install dependencies: `pip install -r requirements.txt`
- Check logs in `backend/logs/`

**Frontend can't connect:**
- Ensure backend is running on port 8000
- Check CORS settings in `backend/core/config.py`
- Check browser console for errors

**Path access denied:**
- Add the path to `ALLOWED_PATHS` in `.env`
- Restart the backend

## 🚀 Deployment

### Docker (Coming Soon)
```bash
docker-compose up
```

### Production
- Use Gunicorn with Uvicorn workers for backend
- Use Nginx to serve frontend static files
- Use PostgreSQL instead of SQLite
- Set secure CORS origins
- Enable HTTPS

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Built with AI assistance for maximum productivity!

---

**Enjoy organizing your files!** 🎉
