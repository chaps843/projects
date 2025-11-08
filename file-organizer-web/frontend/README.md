# File Organizer - Modern Frontend

A beautiful, modern, and feature-rich web interface for the File Organizer application.

## Features

- **Dashboard**: Analytics and statistics with interactive charts
- **File Browser**: Browse files and folders with preview capabilities
- **Organize**: Smart file organization with preview before applying changes
- **Scheduler**: Create and manage automated organization tasks
- **History**: View past organization operations with detailed statistics
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with gradient accents and smooth animations
- **Toast Notifications**: Real-time feedback for all operations
- **File Preview**: Preview images, text files, PDFs, and more

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Vanilla JavaScript with class-based components
- **Bootstrap 5**: UI framework from CDN
- **Chart.js**: Data visualization for analytics
- **Font Awesome**: Beautiful icons

## File Structure

```
frontend/
├── index.html                          # Main HTML file
├── static/
│   ├── css/
│   │   └── main.css                   # Custom styles
│   └── js/
│       ├── api.js                     # API client
│       ├── main.js                    # App initialization & routing
│       ├── utils/
│       │   └── formatting.js          # Utility functions
│       └── components/
│           ├── file-browser.js        # File/folder browsing
│           ├── organizer.js           # Organization interface
│           ├── scheduler.js           # Schedule management
│           ├── dashboard.js           # Analytics dashboard
│           └── preview-modal.js       # File preview modal
└── README.md                          # This file
```

## Getting Started

### Prerequisites

1. Make sure the FastAPI backend is running on `http://localhost:8000`
2. A modern web browser (Chrome, Firefox, Safari, Edge)

### Running the Frontend

#### Option 1: Simple HTTP Server (Python)

```bash
cd /home/chaps/projects/file-organizer-web/frontend
python3 -m http.server 8080
```

Then open http://localhost:8080 in your browser.

#### Option 2: Node.js HTTP Server

```bash
cd /home/chaps/projects/file-organizer-web/frontend
npx http-server -p 8080
```

Then open http://localhost:8080 in your browser.

#### Option 3: Any Web Server

Serve the `frontend` directory with any web server (nginx, Apache, etc.)

## Usage Guide

### Dashboard

- View statistics about your files and storage
- See file type distribution with interactive charts
- Review recent organization activity

### File Browser

1. Click **Browse** button or use the sidebar
2. Enter a directory path
3. Navigate through folders by clicking on them
4. Preview files by clicking the eye icon
5. View file information with the info icon
6. Toggle between list and grid view

### Organize Files

1. Click **Organize** in the navigation
2. Select a source directory
3. Choose organization method:
   - **File Type**: Organize by file extensions
   - **Date Modified**: Organize by modification date
   - **File Size**: Organize by size ranges
   - **Extension**: Group by file extensions
4. Enable/disable recursive subdirectory scanning
5. Click **Generate Preview** to see changes
6. Review the preview
7. Click **Apply Changes** to execute

### Schedule Tasks

1. Click **Schedule** in the navigation
2. Click **New Schedule**
3. Fill in schedule details:
   - Name
   - Directory path
   - Organization method
   - Cron expression (e.g., "0 0 * * *" for daily)
4. Click **Save Schedule**
5. Manage schedules: Pause/Resume or Delete

### View History

- Click **History** in the navigation
- View all past organization operations
- See detailed statistics for each operation
- Clear history if needed

## Configuration

To change the backend API URL, edit `static/js/api.js`:

```javascript
const api = new API('http://your-backend-url:port');
```

## Design Features

### Color Scheme

- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Purple)
- **Success**: #10b981 (Green)
- **Danger**: #ef4444 (Red)
- **Warning**: #f59e0b (Amber)
- **Info**: #3b82f6 (Blue)

### Typography

- System font stack for optimal performance and native look
- Clear hierarchy with appropriate font weights and sizes

### Animations

- Smooth transitions (0.2s - 0.3s)
- Fade-in effects for tab switching
- Hover effects on interactive elements
- Loading states with spinners

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 992px
- Desktop: > 992px

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## API Integration

The frontend integrates with the following backend endpoints:

- `GET /health` - Health check
- `GET /api/browse` - Browse directory
- `GET /api/file-info` - Get file information
- `GET /api/preview` - Preview file
- `POST /api/organize` - Organize files
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create schedule
- `DELETE /api/schedules/:id` - Delete schedule
- `POST /api/schedules/:id/toggle` - Toggle schedule
- `GET /api/history` - Get history
- `DELETE /api/history` - Clear history
- `GET /api/analytics` - Get analytics

## Customization

### Changing Colors

Edit `static/css/main.css` and modify the CSS variables:

```css
:root {
    --primary: #your-color;
    --secondary: #your-color;
    /* ... */
}
```

### Adding Custom Features

1. Create a new component in `static/js/components/`
2. Initialize it in `static/js/main.js`
3. Add corresponding HTML in `index.html`

## Performance

- All external dependencies loaded from CDN
- Minimal JavaScript bundle size
- Efficient DOM manipulation
- Debounced search inputs
- Lazy loading of tab content

## Security

- HTML escaping to prevent XSS
- No inline scripts or styles
- CORS-enabled API calls
- Input validation

## Troubleshooting

### Backend Connection Issues

1. Verify backend is running: `curl http://localhost:8000/health`
2. Check CORS settings in backend
3. Verify API URL in `static/js/api.js`

### Chart Not Displaying

1. Check browser console for errors
2. Ensure Chart.js is loaded from CDN
3. Verify analytics data is being returned

### Styling Issues

1. Clear browser cache
2. Check for CSS conflicts
3. Verify Bootstrap is loaded

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - See backend repository for details.
