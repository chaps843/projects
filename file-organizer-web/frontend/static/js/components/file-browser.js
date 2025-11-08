/**
 * File Browser Component
 */

class FileBrowser {
  constructor() {
    this.currentPath = null;
    this.currentFiles = [];
    this.viewMode = 'list'; // list or grid
    this.pathHistory = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Browse button
    document.getElementById('browseSelectBtn')?.addEventListener('click', () => {
      this.showDirectoryPicker();
    });

    // Back button
    document.getElementById('browseBackBtn')?.addEventListener('click', () => {
      this.goBack();
    });

    // View mode buttons
    document.getElementById('viewGridBtn')?.addEventListener('click', () => {
      this.setViewMode('grid');
    });

    document.getElementById('viewListBtn')?.addEventListener('click', () => {
      this.setViewMode('list');
    });

    // Search
    const searchInput = document.getElementById('searchFiles');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.filterFiles(e.target.value);
      }, 300));
    }
  }

  showDirectoryPicker() {
    const modal = new bootstrap.Modal(document.getElementById('directoryModal'));
    modal.show();

    // Handle directory selection
    document.getElementById('confirmDirectoryBtn').onclick = async () => {
      const path = document.getElementById('directoryPathInput').value.trim();
      if (path) {
        modal.hide();
        await this.browse(path);
      }
    };
  }

  async browse(path, addToHistory = true) {
    try {
      showLoading(document.getElementById('fileBrowser'));
      
      const data = await api.browse(path, false);
      
      this.currentPath = path;
      this.currentFiles = data.items || [];
      
      if (addToHistory) {
        this.pathHistory.push(path);
      }
      
      document.getElementById('currentPathInput').value = path;
      document.getElementById('currentPath').textContent = truncateText(path, 30);
      
      // Enable/disable back button
      document.getElementById('browseBackBtn').disabled = this.pathHistory.length <= 1;
      
      this.render();
      
      showToast('Success', `Loaded ${this.currentFiles.length} items`, 'success');
    } catch (error) {
      console.error('Browse error:', error);
      showError(document.getElementById('fileBrowser'), error.message);
      showToast('Error', `Failed to browse directory: ${error.message}`, 'error');
    }
  }

  goBack() {
    if (this.pathHistory.length > 1) {
      this.pathHistory.pop(); // Remove current
      const previousPath = this.pathHistory.pop(); // Get previous
      this.browse(previousPath, true);
    }
  }

  async navigateToFolder(folderPath) {
    await this.browse(folderPath, true);
  }

  setViewMode(mode) {
    this.viewMode = mode;
    
    // Update button states
    document.getElementById('viewGridBtn').classList.toggle('active', mode === 'grid');
    document.getElementById('viewListBtn').classList.toggle('active', mode === 'list');
    
    this.render();
  }

  filterFiles(query) {
    const filtered = this.currentFiles.filter(item => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
    
    this.render(filtered);
  }

  render(files = this.currentFiles) {
    const container = document.getElementById('fileBrowser');
    
    if (!files || files.length === 0) {
      showEmptyState(
        container,
        'fas fa-folder-open',
        'No Files Found',
        'This directory is empty or no files match your search'
      );
      return;
    }

    // Sort: directories first, then by name
    const sorted = [...files].sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    if (this.viewMode === 'grid') {
      this.renderGrid(sorted, container);
    } else {
      this.renderList(sorted, container);
    }
  }

  renderList(files, container) {
    const html = `
      <ul class="file-list">
        ${files.map(item => this.renderListItem(item)).join('')}
      </ul>
    `;
    container.innerHTML = html;
    this.attachItemListeners();
  }

  renderGrid(files, container) {
    const html = `
      <div class="file-grid">
        ${files.map(item => this.renderGridItem(item)).join('')}
      </div>
    `;
    container.innerHTML = html;
    this.attachItemListeners();
  }

  renderListItem(item) {
    const icon = getFileIcon(item.name, item.type);
    const isDirectory = item.type === 'directory';
    
    return `
      <li class="${isDirectory ? 'folder-item' : 'file-item'}" data-path="${escapeHtml(item.path)}" data-type="${item.type}">
        <div class="${isDirectory ? 'folder-icon' : `file-icon ${icon.category}`}">
          <i class="fas ${icon.icon}"></i>
        </div>
        <div class="file-info">
          <div class="file-name">${escapeHtml(item.name)}</div>
          <div class="file-meta">
            ${isDirectory ? 'Folder' : formatFileSize(item.size || 0)}
            ${item.modified ? ` • ${formatDate(item.modified)}` : ''}
          </div>
        </div>
        <div class="file-actions">
          ${!isDirectory ? `
            <button class="btn btn-sm btn-outline-primary preview-btn" data-path="${escapeHtml(item.path)}" title="Preview">
              <i class="fas fa-eye"></i>
            </button>
          ` : ''}
          <button class="btn btn-sm btn-outline-secondary info-btn" data-path="${escapeHtml(item.path)}" title="Info">
            <i class="fas fa-info-circle"></i>
          </button>
        </div>
      </li>
    `;
  }

  renderGridItem(item) {
    const icon = getFileIcon(item.name, item.type);
    const isDirectory = item.type === 'directory';
    
    return `
      <div class="file-grid-item" data-path="${escapeHtml(item.path)}" data-type="${item.type}">
        <div class="${isDirectory ? 'folder-icon' : `file-icon ${icon.category}`}">
          <i class="fas ${icon.icon}"></i>
        </div>
        <div class="file-name" title="${escapeHtml(item.name)}">
          ${escapeHtml(truncateText(item.name, 20))}
        </div>
        <div class="file-meta">
          ${isDirectory ? 'Folder' : formatFileSize(item.size || 0)}
        </div>
      </div>
    `;
  }

  attachItemListeners() {
    // Folder/file click
    document.querySelectorAll('.folder-item, .file-grid-item[data-type="directory"]').forEach(item => {
      item.addEventListener('click', () => {
        const path = item.dataset.path;
        this.navigateToFolder(path);
      });
    });

    // File click (in grid view)
    document.querySelectorAll('.file-grid-item[data-type="file"]').forEach(item => {
      item.addEventListener('click', () => {
        const path = item.dataset.path;
        previewModal.show(path);
      });
    });

    // Preview buttons
    document.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const path = btn.dataset.path;
        previewModal.show(path);
      });
    });

    // Info buttons
    document.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const path = btn.dataset.path;
        await this.showFileInfo(path);
      });
    });
  }

  async showFileInfo(path) {
    try {
      const info = await api.getFileInfo(path);
      
      const icon = getFileIcon(info.name, info.type);
      
      const modal = new bootstrap.Modal(document.getElementById('previewModal'));
      document.getElementById('previewModalTitle').innerHTML = `
        <i class="fas ${icon.icon} me-2"></i>
        ${escapeHtml(info.name)}
      `;
      
      document.getElementById('previewContent').innerHTML = `
        <div class="row">
          <div class="col-md-6 mb-3">
            <strong>Type:</strong> ${escapeHtml(info.type)}
          </div>
          <div class="col-md-6 mb-3">
            <strong>Size:</strong> ${formatFileSize(info.size || 0)}
          </div>
          <div class="col-md-6 mb-3">
            <strong>Modified:</strong> ${formatRelativeTime(info.modified)}
          </div>
          <div class="col-md-6 mb-3">
            <strong>Permissions:</strong> ${escapeHtml(info.permissions || 'N/A')}
          </div>
          <div class="col-12 mb-3">
            <strong>Path:</strong><br>
            <code>${escapeHtml(info.path)}</code>
          </div>
          ${info.extension ? `
            <div class="col-12 mb-3">
              <strong>Extension:</strong> ${escapeHtml(info.extension)}
            </div>
          ` : ''}
        </div>
      `;
      
      modal.show();
    } catch (error) {
      console.error('Error getting file info:', error);
      showToast('Error', `Failed to get file info: ${error.message}`, 'error');
    }
  }

  getCurrentPath() {
    return this.currentPath;
  }
}

// Initialize file browser
let fileBrowser;
document.addEventListener('DOMContentLoaded', () => {
  fileBrowser = new FileBrowser();
});
