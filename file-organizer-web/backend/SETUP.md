# File Organizer Backend - Setup Guide

## Quick Start

1. **Navigate to backend directory:**
   ```bash
   cd /home/chaps/projects/file-organizer-web/backend
   ```

2. **Run the setup script:**
   ```bash
   ./run.sh
   ```

   This will:
   - Create a virtual environment
   - Install all dependencies
   - Create `.env` from `.env.example`
   - Start the server

3. **Configure allowed paths (IMPORTANT):**
   
   Edit `.env` and set the directories you want to allow access to:
   ```bash
   ALLOWED_BASE_PATHS="/home/chaps/Downloads,/home/chaps/Documents"
   ```

4. **Access the API:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/health

## Manual Setup

If you prefer manual setup:

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your settings

# Run the application
python main.py
```

## Testing the API

### 1. Browse a directory
```bash
curl "http://localhost:8000/api/v1/files/browse?path=/home/chaps/Downloads"
```

### 2. Preview organization
```bash
curl -X POST "http://localhost:8000/api/v1/organize/preview" \
  -H "Content-Type: application/json" \
  -d '{
    "source_directory": "/home/chaps/Downloads",
    "operation_type": "by_type",
    "create_others": true,
    "dry_run": false
  }'
```

### 3. Execute organization
```bash
curl -X POST "http://localhost:8000/api/v1/organize/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "source_directory": "/home/chaps/Downloads",
    "operation_type": "by_type",
    "create_others": true,
    "dry_run": false
  }'
```

### 4. Create a scheduled job
```bash
curl -X POST "http://localhost:8000/api/v1/schedule/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Downloads Cleanup",
    "description": "Organize downloads every day at 2 AM",
    "operation_type": "by_type",
    "source_directory": "/home/chaps/Downloads",
    "schedule_type": "cron",
    "schedule_config": {
      "cron_expression": "0 2 * * *"
    },
    "enabled": true
  }'
```

### 5. View history
```bash
curl "http://localhost:8000/api/v1/history/?limit=10"
```

### 6. Get statistics
```bash
curl "http://localhost:8000/api/v1/history/stats/summary"
```

## Project Structure

```
backend/
├── main.py                          # FastAPI application entry point
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment configuration template
├── run.sh                          # Quick start script
├── README.md                        # Documentation
├── SETUP.md                         # This file
│
├── core/                           # Core configuration
│   ├── __init__.py
│   ├── config.py                   # Settings with pydantic-settings
│   └── database.py                 # SQLModel database setup
│
├── models/                         # Database models (SQLModel)
│   ├── __init__.py
│   ├── organization.py             # Organization history table
│   └── schedule.py                 # Scheduled jobs table
│
├── schemas/                        # API schemas (Pydantic)
│   ├── __init__.py
│   ├── file.py                     # File/directory schemas
│   ├── organize.py                 # Organization request/response
│   ├── schedule.py                 # Scheduling schemas
│   └── history.py                  # History/analytics schemas
│
├── services/                       # Business logic layer
│   ├── __init__.py
│   ├── file_browser.py            # Safe filesystem navigation
│   ├── file_organizer.py          # File organization (reuses organizer.py logic)
│   ├── file_preview.py            # Generate previews/thumbnails
│   ├── scheduler.py               # APScheduler integration
│   └── analytics.py               # Statistics and analytics
│
└── api/                           # API routes
    ├── __init__.py
    └── v1/
        ├── __init__.py
        ├── router.py              # Main API router
        └── endpoints/
            ├── __init__.py
            ├── files.py           # File browsing endpoints
            ├── organize.py        # Organization endpoints
            ├── preview.py         # Preview generation endpoints
            ├── schedule.py        # Scheduled jobs CRUD
            └── history.py         # History and analytics endpoints
```

## Key Features Implemented

### 1. File Browser Service
- Safe path validation (prevents directory traversal)
- Browse directories with file/folder information
- File search functionality
- Configurable allowed base paths

### 2. File Organizer Service
- Organize by file type (same categories as original organizer.py)
- Organize by modification date
- Preview before executing
- Undo capability with move log
- Database tracking of all operations

### 3. File Preview Service
- Image thumbnails (JPEG, PNG, etc.)
- Text file previews
- PDF previews with text extraction
- Automatic preview based on file type

### 4. Scheduler Service
- Cron-based scheduling (e.g., "0 2 * * *" for 2 AM daily)
- Interval-based scheduling (seconds, minutes, hours, days)
- Enable/disable jobs
- Track last run and next run times
- Automatic execution with history tracking

### 5. Analytics Service
- Operation statistics
- Category distribution
- Time series data for dashboards
- Busiest directories tracking

## Environment Variables

```bash
# Application
APP_NAME="File Organizer API"
APP_VERSION="1.0.0"
DEBUG=true
API_V1_PREFIX="/api/v1"

# Server
HOST=0.0.0.0
PORT=8000

# CORS (adjust for your frontend)
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Database
DATABASE_URL="sqlite:///./file_organizer.db"

# Security - IMPORTANT!
ALLOWED_BASE_PATHS="/home/user/Downloads,/home/user/Documents"

# File Previews
MAX_PREVIEW_SIZE=10485760  # 10MB
THUMBNAIL_SIZE=200

# Scheduler
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE="UTC"

# Logging
LOG_LEVEL="INFO"
LOG_FILE="logs/app.log"
```

## Database Schema

### organization_history
- Tracks all organization operations
- Stores move logs for undo functionality
- Contains statistics for analytics

### scheduled_jobs
- Stores scheduled job configurations
- Tracks execution history
- Manages job scheduling state

## Security Considerations

1. **Path Validation**: All file operations validate paths against `ALLOWED_BASE_PATHS`
2. **CORS**: Configure `CORS_ORIGINS` to match your frontend URL
3. **File Size Limits**: Preview generation respects `MAX_PREVIEW_SIZE`
4. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Troubleshooting

### Import errors when running
The import errors you see are expected if dependencies aren't installed. Run:
```bash
pip install -r requirements.txt
```

### Permission denied errors
Make sure the user running the API has read/write access to:
- The directories in `ALLOWED_BASE_PATHS`
- The current directory (for SQLite database)
- The logs directory

### Scheduler not working
Check:
- `SCHEDULER_ENABLED=true` in `.env`
- Job is enabled in database
- Check logs for errors

### CORS errors from frontend
Update `CORS_ORIGINS` in `.env` to include your frontend URL

## Integration with Original organizer.py

The `services/file_organizer.py` module reuses the logic from the original `organizer.py`:
- Same file type categories
- Same organization algorithms
- Same duplicate handling
- Enhanced with preview and undo capabilities
- Integrated with database for tracking

## Next Steps

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Configure `.env`**: Set your `ALLOWED_BASE_PATHS`
3. **Run the server**: `python main.py`
4. **Test with curl or browser**: Visit http://localhost:8000/docs
5. **Build frontend**: The API is ready for integration with a React/Vue/etc. frontend

## API Documentation

Full interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

These provide:
- Complete API reference
- Request/response schemas
- Try-it-out functionality
- Examples for all endpoints
