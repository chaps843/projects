/**
 * Main Application Controller
 */

class App {
  constructor() {
    this.currentTab = 'dashboard';
    this.historyManager = null;
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupQuickActions();
    this.checkBackendConnection();
    
    // Load initial tab
    this.switchTab('dashboard');
  }

  setupNavigation() {
    // Tab navigation
    document.querySelectorAll('[data-tab]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  setupQuickActions() {
    // Select directory
    document.getElementById('selectDirectoryBtn')?.addEventListener('click', () => {
      fileBrowser.showDirectoryPicker();
    });

    // Quick organize
    document.getElementById('quickOrganizeBtn')?.addEventListener('click', () => {
      this.switchTab('organize');
    });

    // Refresh
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
      this.refresh();
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update navigation
    document.querySelectorAll('[data-tab]').forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tabName);
    });

    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    // Show selected tab
    const targetTab = document.getElementById(`${tabName}Tab`);
    if (targetTab) {
      targetTab.classList.add('active');
    }

    // Update page title and action button
    this.updatePageHeader(tabName);

    // Load tab content
    this.loadTabContent(tabName);
  }

  updatePageHeader(tabName) {
    const titles = {
      dashboard: { icon: 'fa-chart-line', text: 'Dashboard', action: 'Refresh' },
      browser: { icon: 'fa-folder-open', text: 'File Browser', action: 'Browse' },
      organize: { icon: 'fa-magic', text: 'Organize Files', action: 'Preview' },
      schedule: { icon: 'fa-clock', text: 'Scheduled Tasks', action: 'New Schedule' },
      history: { icon: 'fa-history', text: 'History', action: 'Refresh' }
    };

    const config = titles[tabName] || titles.dashboard;

    document.getElementById('pageTitle').innerHTML = `
      <i class="fas ${config.icon} me-2"></i>${config.text}
    `;

    document.getElementById('mainActionText').textContent = config.action;
    
    // Set up action button click handler
    const actionBtn = document.getElementById('mainActionBtn');
    actionBtn.onclick = () => this.handleMainAction(tabName);
  }

  handleMainAction(tabName) {
    switch (tabName) {
      case 'dashboard':
        const currentPath = fileBrowser ? fileBrowser.getCurrentPath() : null;
        dashboard.load(currentPath);
        break;
      case 'browser':
        fileBrowser.showDirectoryPicker();
        break;
      case 'organize':
        organizer.generatePreview();
        break;
      case 'schedule':
        scheduler.showScheduleModal();
        break;
      case 'history':
        if (this.historyManager) {
          this.historyManager.refresh();
        }
        break;
    }
  }

  loadTabContent(tabName) {
    switch (tabName) {
      case 'dashboard':
        // Pass current path from file browser if available
        const currentPath = fileBrowser ? fileBrowser.getCurrentPath() : null;
        dashboard.load(currentPath);
        break;
      case 'schedule':
        scheduler.loadSchedules();
        break;
      case 'history':
        this.loadHistory();
        break;
    }
  }

  async loadHistory() {
    if (!this.historyManager) {
      this.historyManager = new HistoryManager();
    }
    await this.historyManager.load();
  }

  async refresh() {
    showToast('Info', 'Refreshing...', 'info');
    
    switch (this.currentTab) {
      case 'dashboard':
        const currentPath = fileBrowser ? fileBrowser.getCurrentPath() : null;
        await dashboard.load(currentPath);
        break;
      case 'browser':
        if (fileBrowser.currentPath) {
          await fileBrowser.browse(fileBrowser.currentPath, false);
        }
        break;
      case 'schedule':
        await scheduler.loadSchedules();
        break;
      case 'history':
        if (this.historyManager) {
          await this.historyManager.refresh();
        }
        break;
    }
  }

  async checkBackendConnection() {
    try {
      await api.healthCheck();
      document.getElementById('systemStatus').className = 'badge bg-success';
      document.getElementById('systemStatus').textContent = 'Connected';
    } catch (error) {
      document.getElementById('systemStatus').className = 'badge bg-danger';
      document.getElementById('systemStatus').textContent = 'Disconnected';
      showToast('Warning', 'Cannot connect to backend server', 'warning');
    }
  }
}

/**
 * History Manager
 */
class HistoryManager {
  constructor() {
    this.history = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('clearHistoryBtn')?.addEventListener('click', async () => {
      await this.clearHistory();
    });
  }

  async load() {
    try {
      const container = document.getElementById('historyList');
      showLoading(container);

      this.history = await api.getHistory(50, 0);
      
      this.render();
    } catch (error) {
      console.error('Load history error:', error);
      showError(document.getElementById('historyList'), error.message);
    }
  }

  render() {
    const container = document.getElementById('historyList');

    if (!this.history || this.history.length === 0) {
      showEmptyState(
        container,
        'fas fa-history',
        'No History',
        'Your organization history will appear here'
      );
      return;
    }

    const html = this.history.map(item => this.renderHistoryItem(item)).join('');
    container.innerHTML = html;
  }

  renderHistoryItem(item) {
    const statusClass = item.status === 'completed' ? 'success' : 'error';
    
    return `
      <div class="history-item ${statusClass}">
        <div class="history-header">
          <div class="history-title">
            <i class="fas fa-${item.status === 'completed' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${escapeHtml(item.directory || 'Organization')}
          </div>
          <div class="history-time">${formatDate(item.created_at)}</div>
        </div>
        <div class="history-details">
          Organized by <strong>${escapeHtml(item.method || 'unknown')}</strong>
          ${item.recursive ? ' (including subdirectories)' : ''}
        </div>
        <div class="history-stats">
          <span>
            <i class="fas fa-file me-1"></i>
            ${item.files_moved || 0} files moved
          </span>
          <span>
            <i class="fas fa-hdd me-1"></i>
            ${formatFileSize(item.total_size || 0)}
          </span>
          ${item.duration ? `
            <span>
              <i class="fas fa-clock me-1"></i>
              ${(item.duration / 1000).toFixed(2)}s
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }

  async clearHistory() {
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    document.getElementById('confirmModalTitle').textContent = 'Clear History';
    document.getElementById('confirmModalBody').textContent = 
      'Are you sure you want to clear all history? This action cannot be undone.';

    document.getElementById('confirmActionBtn').onclick = async () => {
      confirmModal.hide();
      
      try {
        await api.clearHistory();
        showToast('Success', 'History cleared', 'success');
        await this.load();
      } catch (error) {
        console.error('Clear history error:', error);
        showToast('Error', `Failed to clear history: ${error.message}`, 'error');
      }
    };

    confirmModal.show();
  }

  async refresh() {
    await this.load();
  }
}

/**
 * Toast notification helper
 */
function showToast(title, message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  
  const toastId = `toast-${Date.now()}`;
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="toast-header">
      <i class="fas ${iconMap[type]} me-2"></i>
      <strong class="me-auto">${escapeHtml(title)}</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${escapeHtml(message)}
    </div>
  `;

  toastContainer.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, {
    autohide: true,
    delay: 5000
  });

  bsToast.show();

  // Remove from DOM after hidden
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
  
  // Make app globally accessible for stat card clicks
  window.app = app;
  
  // Show welcome toast
  setTimeout(() => {
    showToast(
      'Welcome',
      'File Organizer is ready to use!',
      'success'
    );
  }, 500);
});

// Handle network errors globally
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (event.reason?.message?.includes('fetch')) {
    showToast(
      'Connection Error',
      'Cannot connect to the backend server. Please make sure it is running.',
      'error'
    );
  }
});
