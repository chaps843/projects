# Quick Reference - File Organizer API

## Setup (One-Time)

```bash
cd /home/chaps/projects/file-organizer-web/backend
./run.sh
# Edit .env and set ALLOWED_BASE_PATHS
```

## Run Server

```bash
python main.py
```

## API Endpoints Summary

### Base URL: `http://localhost:8000/api/v1`

### Files
```bash
GET  /files/browse?path=/path/to/dir          # Browse directory
GET  /files/info?path=/path/to/file           # Get file info
GET  /files/search?base_path=...&pattern=...  # Search files
```

### Organize
```bash
POST /organize/preview    # Preview organization
POST /organize/execute    # Execute organization
POST /organize/undo       # Undo operation
```

**Example Request:**
```json
{
  "source_directory": "/home/user/Downloads",
  "operation_type": "by_type",  // or "by_date"
  "create_others": true,
  "dry_run": false
}
```

### Preview
```bash
GET /preview/thumbnail?path=/path/to/image    # Get thumbnail
GET /preview/text?path=/path/to/file          # Get text preview
GET /preview/pdf?path=/path/to/file.pdf       # Get PDF preview
GET /preview/file?path=/path/to/file          # Auto preview
```

### Schedule
```bash
GET    /schedule/              # List all jobs
POST   /schedule/              # Create job
GET    /schedule/{id}          # Get job
PUT    /schedule/{id}          # Update job
DELETE /schedule/{id}          # Delete job
POST   /schedule/{id}/enable   # Enable job
POST   /schedule/{id}/disable  # Disable job
```

**Example Job Creation:**
```json
{
  "name": "Daily Cleanup",
  "operation_type": "by_type",
  "source_directory": "/home/user/Downloads",
  "schedule_type": "cron",
  "schedule_config": {
    "cron_expression": "0 2 * * *"  // 2 AM daily
  },
  "enabled": true
}
```

**Interval Example:**
```json
{
  "schedule_type": "interval",
  "schedule_config": {
    "interval_hours": 6  // Every 6 hours
  }
}
```

### History
```bash
GET /history/?limit=50&offset=0           # List operations
GET /history/{id}                         # Get operation details
GET /history/stats/summary                # Get statistics
GET /history/analytics/dashboard?days=30  # Get analytics
DELETE /history/{id}                      # Delete operation
```

## File Organization Types

### By Type
Organizes files into categories:
- Images (jpg, png, gif, etc.)
- Documents (pdf, doc, txt, etc.)
- Videos (mp4, avi, mkv, etc.)
- Audio (mp3, wav, flac, etc.)
- Archives (zip, rar, 7z, etc.)
- Code (py, js, java, etc.)
- Data (json, xml, csv, etc.)
- Executables (exe, deb, etc.)
- Fonts (ttf, otf, etc.)
- Ebooks (epub, mobi, etc.)
- Others (uncategorized)

### By Date
Organizes files into date-based folders:
- Default format: `%Y/%m` (e.g., 2024/01)
- Custom format: `%Y-%m-%d` (e.g., 2024-01-15)

## Common Tasks

### 1. Browse a Directory
```bash
curl "http://localhost:8000/api/v1/files/browse?path=/home/user/Downloads"
```

### 2. Preview Organization
```bash
curl -X POST "http://localhost:8000/api/v1/organize/preview" \
  -H "Content-Type: application/json" \
  -d '{"source_directory": "/home/user/Downloads", "operation_type": "by_type"}'
```

### 3. Execute Organization
```bash
curl -X POST "http://localhost:8000/api/v1/organize/execute" \
  -H "Content-Type: application/json" \
  -d '{"source_directory": "/home/user/Downloads", "operation_type": "by_type"}'
```

### 4. Undo Last Operation
```bash
# Get operation ID from history, then:
curl -X POST "http://localhost:8000/api/v1/organize/undo" \
  -H "Content-Type: application/json" \
  -d '{"operation_id": 1}'
```

### 5. Create Daily Schedule
```bash
curl -X POST "http://localhost:8000/api/v1/schedule/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Downloads Cleanup",
    "operation_type": "by_type",
    "source_directory": "/home/user/Downloads",
    "schedule_type": "cron",
    "schedule_config": {"cron_expression": "0 2 * * *"}
  }'
```

### 6. View Statistics
```bash
curl "http://localhost:8000/api/v1/history/stats/summary"
```

## Configuration (.env)

```bash
# Security - Set allowed directories
ALLOWED_BASE_PATHS="/home/user/Downloads,/home/user/Documents"

# Server
PORT=8000
DEBUG=true

# CORS (for frontend)
CORS_ORIGINS=["http://localhost:3000"]

# Database
DATABASE_URL="sqlite:///./file_organizer.db"

# Scheduler
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE="UTC"
```

## Cron Expression Examples

```
0 2 * * *      # Daily at 2 AM
0 */6 * * *    # Every 6 hours
0 0 * * 0      # Weekly on Sunday at midnight
0 0 1 * *      # Monthly on the 1st at midnight
*/30 * * * *   # Every 30 minutes
```

## Response Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `403` - Forbidden (path not allowed)
- `404` - Not Found
- `500` - Server Error

## Database Tables

### organization_history
- Tracks all file organization operations
- Stores move logs for undo
- Contains statistics

### scheduled_jobs
- Stores job configurations
- Tracks execution history
- Manages scheduling state

## File Structure

```
backend/
├── main.py              # Application entry
├── requirements.txt     # Dependencies
├── .env                 # Configuration
├── core/               # Config & database
├── models/             # Database models
├── schemas/            # API schemas
├── services/           # Business logic
└── api/v1/endpoints/   # API routes
```

## Troubleshooting

**Import errors**: Run `pip install -r requirements.txt`

**Permission denied**: Check ALLOWED_BASE_PATHS in .env

**CORS errors**: Add your frontend URL to CORS_ORIGINS

**Scheduler not working**: Ensure SCHEDULER_ENABLED=true

## Interactive Documentation

Visit http://localhost:8000/docs for full interactive API documentation with:
- Complete endpoint reference
- Request/response examples
- Try-it-out functionality
- Schema definitions
