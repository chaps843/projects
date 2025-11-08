# File Organizer Web - Quick Start Guide

Complete file organization system with a beautiful modern web interface!

## What You Have

A full-stack file organization application:
- **Backend**: FastAPI REST API (Python)
- **Frontend**: Modern responsive web UI (HTML/CSS/JavaScript)
- **Database**: SQLite with SQLModel ORM
- **Features**: File browsing, smart organization, scheduling, analytics, history

## Quick Start

### 1. Start the Backend

```bash
# Navigate to backend directory
cd /home/chaps/projects/file-organizer-web/backend

# First time setup - Install python3-venv if needed
sudo apt install python3.12-venv

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
# OR
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Note:** The virtual environment keeps dependencies isolated. Always activate it with `source venv/bin/activate` before running the backend.

The backend will be running at: **http://localhost:8000**

**API Documentation:** http://localhost:8000/docs

### 2. Start the Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd /home/chaps/projects/file-organizer-web/frontend

# Option A: Use the provided script
./serve.sh

# Option B: Python simple server
python3 -m http.server 8080

# Option C: Node.js http-server
npx http-server -p 8080
```

The frontend will be running at: **http://localhost:8080**

### 3. Open Your Browser

Navigate to: **http://localhost:8080**

You should see the beautiful File Organizer interface!

## First Steps

### 1. Check Connection
- Look at the sidebar - you should see "Connected" status badge in green
- If it's red, make sure the backend is running on port 8000

### 2. Browse Files
1. Click **Browse** in the top navigation
2. Click the **Browse** button
3. Enter a directory path (e.g., `/home/chaps/Downloads`)
4. Explore your files!

### 3. Organize Files
1. Click **Organize** in the top navigation
2. Select a directory
3. Choose an organization method
4. Click **Generate Preview**
5. Review the changes
6. Click **Apply Changes** to organize

### 4. Create a Schedule
1. Click **Schedule** in the top navigation
2. Click **New Schedule**
3. Fill in the details
4. Save the schedule

### 5. View Analytics
- Click **Dashboard** in the top navigation
- See your file statistics and charts

## Project Structure

```
file-organizer-web/
├── backend/                    # FastAPI backend
│   ├── main.py                # Application entry point
│   ├── api/                   # API endpoints
│   ├── core/                  # Configuration & database
│   ├── models/                # Database models
│   ├── schemas/               # Pydantic schemas
│   ├── services/              # Business logic
│   └── requirements.txt       # Python dependencies
│
├── frontend/                  # Web interface
│   ├── index.html            # Main page
│   ├── static/
│   │   ├── css/              # Stylesheets
│   │   └── js/               # JavaScript
│   ├── serve.sh              # Quick start script
│   └── README.md             # Frontend docs
│
└── QUICKSTART.md             # This file
```

## Key Features

### File Browser
- 📁 Navigate directories
- 👁️ Preview files (images, text, PDFs)
- 📊 View file information
- 🔍 Search files
- 🎨 List or Grid view

### File Organization
- 🎯 Multiple organization methods:
  - By file type
  - By date modified
  - By file size
  - By extension
- 👀 Preview before applying
- ♻️ Recursive subdirectory support
- ✅ Dry-run mode

### Scheduler
- ⏰ Create automated organization tasks
- 📅 Cron-based scheduling
- ⏸️ Pause/Resume schedules
- 📝 View schedule history

### Dashboard
- 📈 File statistics
- 📊 Interactive charts
- 🔢 Analytics overview
- 📜 Recent activity

### History
- 📋 Complete operation log
- ✅ Success/failure tracking
- 📊 Detailed statistics
- 🗑️ Clear history option

## API Endpoints

The backend provides these REST API endpoints:

**Files:**
- `GET /api/browse` - Browse directory
- `GET /api/file-info` - Get file info
- `GET /api/preview` - Preview file

**Organization:**
- `POST /api/organize` - Organize files
- `GET /api/rules` - Get rules

**Scheduling:**
- `GET /api/schedules` - List schedules
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/{id}` - Update schedule
- `DELETE /api/schedules/{id}` - Delete schedule

**History:**
- `GET /api/history` - Get history
- `DELETE /api/history` - Clear history

**Analytics:**
- `GET /api/analytics` - Get statistics

**System:**
- `GET /health` - Health check
- `GET /docs` - API documentation

## Configuration

### Backend (backend/core/config.py)
```python
DATABASE_URL = "sqlite:///./file_organizer.db"
LOG_LEVEL = "INFO"
# Add your custom settings
```

### Frontend (frontend/static/js/api.js)
```javascript
const api = new API('http://localhost:8000');
// Change the URL if needed
```

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLModel**: SQL database ORM
- **Pydantic**: Data validation
- **APScheduler**: Task scheduling
- **Loguru**: Logging
- **Pillow**: Image processing
- **PyPDF2**: PDF handling

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling
- **JavaScript ES6+**: Vanilla JS
- **Bootstrap 5**: UI framework
- **Chart.js**: Data visualization
- **Font Awesome**: Icons

## Tips & Tricks

### 1. Organization Methods

**By File Type:**
- Groups files into: Images, Documents, Videos, Audio, Archives, Code, Others

**By Date Modified:**
- Creates folders by Year/Month
- Example: `2024/January/`

**By File Size:**
- Creates folders: Small (<1MB), Medium (1-100MB), Large (>100MB)

**By Extension:**
- Groups all .jpg files together, all .pdf files together, etc.

### 2. Cron Expressions

Common schedule patterns:

```
"0 0 * * *"     - Daily at midnight
"0 0 * * 0"     - Weekly on Sunday at midnight
"0 0 1 * *"     - Monthly on the 1st at midnight
"*/30 * * * *"  - Every 30 minutes
"0 9-17 * * 1-5" - Every hour 9am-5pm, Mon-Fri
```

### 3. Keyboard Shortcuts (Planned)

Will be implemented soon:
- `Ctrl+B` - Browse files
- `Ctrl+O` - Organize
- `Ctrl+S` - Schedules
- `Ctrl+H` - History
- `Ctrl+D` - Dashboard

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is available
lsof -i :8000

# Kill process if needed
kill -9 <PID>

# Check Python version (requires 3.8+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend can't connect
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check browser console for errors (F12)
3. Verify CORS is enabled in backend
4. Check API URL in `frontend/static/js/api.js`

### Database issues
```bash
# Delete and recreate database
rm backend/file_organizer.db
# Restart backend - it will recreate the database
```

### Port already in use
```bash
# Frontend (change port)
python3 -m http.server 8081

# Backend (change port)
uvicorn main:app --port 8001
# Update API URL in frontend
```

## Development

### Adding a New Feature

1. **Backend**: Add endpoint in `backend/api/v1/endpoints/`
2. **Frontend**: Add API method in `frontend/static/js/api.js`
3. **Frontend**: Update component to use new API
4. Test thoroughly

### Debugging

**Backend:**
```bash
# Enable debug mode
uvicorn main:app --reload --log-level debug
```

**Frontend:**
```javascript
// Open browser console (F12)
// All API calls are logged
// Check Network tab for requests
```

## Production Deployment

### Backend

```bash
# Use a production ASGI server
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Or
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

Serve with any web server:

**Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/frontend;
        index index.html;
    }
}
```

**Apache:**
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/frontend
    ServerName your-domain.com
</VirtualHost>
```

## Security Considerations

1. **Don't expose to internet without authentication**
2. **Use HTTPS in production**
3. **Validate all file paths**
4. **Limit file operations to specific directories**
5. **Implement rate limiting**
6. **Use environment variables for secrets**

## Next Steps

1. ✅ Explore all features
2. ✅ Organize a test directory
3. ✅ Create a schedule
4. ✅ View analytics
5. 📚 Read the full documentation
6. 🎨 Customize the design
7. 🔧 Add your own features

## Resources

- **Backend Code**: `/home/chaps/projects/file-organizer-web/backend/`
- **Frontend Code**: `/home/chaps/projects/file-organizer-web/frontend/`
- **API Docs**: http://localhost:8000/docs
- **Frontend Docs**: `frontend/README.md`
- **Feature List**: `frontend/FEATURES.md`

## Support

For issues or questions:
1. Check the documentation
2. Review API docs at `/docs`
3. Check browser console for errors
4. Check backend logs

## License

MIT License - Feel free to use and modify!

---

**Enjoy organizing your files! 🎉**
