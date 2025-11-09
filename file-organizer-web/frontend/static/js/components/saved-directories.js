/**
 * Saved Directories Component
 */

class SavedDirectories {
  constructor() {
    this.directories = this.loadFromStorage();
    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add current directory button
    document.getElementById('addCurrentDirBtn')?.addEventListener('click', () => {
      this.addCurrentDirectory();
    });
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('savedDirectories');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved directories:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('savedDirectories', JSON.stringify(this.directories));
    } catch (error) {
      console.error('Error saving directories:', error);
      showToast('Error', 'Failed to save directory', 'error');
    }
  }

  addCurrentDirectory() {
    const currentPath = fileBrowser?.getCurrentPath();
    if (!currentPath) {
      showToast('Error', 'No directory selected', 'error');
      return;
    }

    // Check if already saved
    if (this.directories.some(d => d.path === currentPath)) {
      showToast('Info', 'Directory already saved', 'info');
      return;
    }

    // Add to list
    const pathParts = currentPath.split('/').filter(p => p);
    const name = pathParts.length > 0 ? pathParts[pathParts.length - 1] : currentPath;
    
    this.directories.push({ name, path: currentPath });
    this.saveToStorage();
    this.render();
    showToast('Success', `Saved: ${name}`, 'success');
  }

  removeDirectory(path) {
    this.directories = this.directories.filter(d => d.path !== path);
    this.saveToStorage();
    this.render();
    showToast('Success', 'Directory removed', 'success');
  }

  render() {
    const container = document.getElementById('savedDirectoriesList');
    if (!container) return;

    if (this.directories.length === 0) {
      container.innerHTML = `
        <li class="nav-item px-3 text-muted small">
          No saved directories yet
        </li>
      `;
      return;
    }

    container.innerHTML = this.directories.map(dir => `
      <li class="nav-item">
        <a class="nav-link d-flex justify-content-between align-items-center saved-dir-item" 
           href="#" 
           data-path="${escapeHtml(dir.path)}"
           title="${escapeHtml(dir.path)}">
          <span>
            <i class="fas fa-folder me-2"></i>
            ${escapeHtml(truncateText(dir.name, 15))}
          </span>
          <button class="btn btn-sm btn-link p-0 text-danger remove-dir-btn" 
                  data-path="${escapeHtml(dir.path)}"
                  title="Remove">
            <i class="fas fa-times"></i>
          </button>
        </a>
      </li>
    `).join('');

    // Attach event listeners
    container.querySelectorAll('.saved-dir-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const path = item.dataset.path;
        if (fileBrowser) {
          fileBrowser.browse(path);
          if (window.app) {
            window.app.switchTab('browser');
          }
        }
      });
    });

    container.querySelectorAll('.remove-dir-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const path = btn.dataset.path;
        if (confirm(`Remove this saved directory?`)) {
          this.removeDirectory(path);
        }
      });
    });
  }
}

// Initialize
let savedDirectories;
document.addEventListener('DOMContentLoaded', () => {
  savedDirectories = new SavedDirectories();
});
