# File Organizer Web API

A FastAPI backend for the File Organizer web application that provides REST APIs for organizing files, scheduling automated organization tasks, and viewing analytics.

## Features

- **File Browsing**: Browse directories, search files, and get file information
- **File Organization**: Organize files by type or date with preview and undo capabilities
- **Scheduled Jobs**: Create automated organization jobs with cron or interval scheduling
- **File Previews**: Generate thumbnails and previews for images, text, and PDF files
- **Analytics**: View operation history, statistics, and analytics dashboards

## Directory Structure

```
backend/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Example environment configuration
├── core/                  # Core configuration and database
│   ├── config.py         # Settings management
│   └── database.py       # Database setup
├── models/               # SQLModel database models
│   ├── organization.py   # Organization history model
│   └── schedule.py       # Scheduled jobs model
├── schemas/              # Pydantic schemas for validation
│   ├── file.py          # File/directory schemas
│   ├── organize.py      # Organization schemas
│   ├── schedule.py      # Scheduling schemas
│   └── history.py       # History/analytics schemas
├── services/            # Business logic layer
│   ├── file_browser.py  # Safe file system navigation
│   ├── file_organizer.py # File organization logic
│   ├── file_preview.py  # Preview generation
│   ├── scheduler.py     # APScheduler integration
│   └── analytics.py     # Statistics and analytics
└── api/v1/              # API endpoints
    ├── router.py        # Main API router
    └── endpoints/
        ├── files.py     # File browsing endpoints
        ├── organize.py  # Organization endpoints
        ├── preview.py   # Preview endpoints
        ├── schedule.py  # Scheduling endpoints
        └── history.py   # History/analytics endpoints
```

## Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Set allowed paths** (important for security):
   Edit `.env` and set `ALLOWED_BASE_PATHS` to directories you want to allow access to:
   ```
   ALLOWED_BASE_PATHS="/home/user/Downloads,/home/user/Documents"
   ```

## Running the Application

**Development mode:**
```bash
python main.py
```

**Production mode with uvicorn:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Files
- `GET /api/v1/files/browse` - Browse directory contents
- `GET /api/v1/files/info` - Get file information
- `GET /api/v1/files/search` - Search for files

### Organization
- `POST /api/v1/organize/preview` - Preview organization without executing
- `POST /api/v1/organize/execute` - Execute file organization
- `POST /api/v1/organize/undo` - Undo a previous organization

### Previews
- `GET /api/v1/preview/thumbnail` - Generate image thumbnail
- `GET /api/v1/preview/text` - Get text file preview
- `GET /api/v1/preview/pdf` - Get PDF preview
- `GET /api/v1/preview/file` - Get automatic preview based on file type

### Scheduled Jobs
- `GET /api/v1/schedule/` - List all scheduled jobs
- `POST /api/v1/schedule/` - Create a new scheduled job
- `GET /api/v1/schedule/{job_id}` - Get job details
- `PUT /api/v1/schedule/{job_id}` - Update a job
- `DELETE /api/v1/schedule/{job_id}` - Delete a job
- `POST /api/v1/schedule/{job_id}/enable` - Enable a job
- `POST /api/v1/schedule/{job_id}/disable` - Disable a job

### History & Analytics
- `GET /api/v1/history/` - List operation history
- `GET /api/v1/history/{operation_id}` - Get operation details
- `GET /api/v1/history/stats/summary` - Get statistics summary
- `GET /api/v1/history/analytics/dashboard` - Get analytics data

## Configuration

Key environment variables:

- `ALLOWED_BASE_PATHS` - Comma-separated list of allowed directories (security)
- `DATABASE_URL` - SQLite database URL (default: `sqlite:///./file_organizer.db`)
- `CORS_ORIGINS` - Allowed CORS origins for frontend
- `SCHEDULER_ENABLED` - Enable/disable scheduled jobs
- `MAX_PREVIEW_SIZE` - Maximum file size for previews (bytes)
- `LOG_LEVEL` - Logging level (INFO, DEBUG, WARNING, ERROR)

## Security

The application implements path validation to prevent directory traversal attacks. Only paths within `ALLOWED_BASE_PATHS` can be accessed. If `ALLOWED_BASE_PATHS` is empty, all paths are allowed (use with caution).

## Database

The application uses SQLite by default. The database file (`file_organizer.db`) stores:
- Organization operation history
- Scheduled job configurations
- Operation statistics

## Scheduling

Scheduled jobs support two types of triggers:
- **Cron**: Standard cron expressions (e.g., `0 0 * * *` for daily at midnight)
- **Interval**: Time intervals (seconds, minutes, hours, days)

## Development

To extend the API:
1. Add new endpoints in `api/v1/endpoints/`
2. Add business logic in `services/`
3. Add data models in `models/` (database) or `schemas/` (API)
4. Include router in `api/v1/router.py`

## License

This project is part of the File Organizer application.
