/**
 * Organizer Component
 */

class Organizer {
  constructor() {
    this.currentPreview = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Select directory button
    document.getElementById('selectOrgDirBtn')?.addEventListener('click', () => {
      this.showDirectoryPicker();
    });

    // Organize form
    document.getElementById('organizeForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.generatePreview();
    });

    // Preview actions
    document.getElementById('cancelPreviewBtn')?.addEventListener('click', () => {
      this.clearPreview();
    });

    document.getElementById('applyOrganizeBtn')?.addEventListener('click', async () => {
      await this.applyChanges();
    });
  }

  showDirectoryPicker() {
    const modal = new bootstrap.Modal(document.getElementById('directoryModal'));
    modal.show();

    document.getElementById('confirmDirectoryBtn').onclick = () => {
      const path = document.getElementById('directoryPathInput').value.trim();
      if (path) {
        document.getElementById('organizeDir').value = path;
        modal.hide();
      }
    };
  }

  async generatePreview() {
    const directory = document.getElementById('organizeDir').value;
    const method = document.getElementById('organizeMethod').value;
    const recursive = document.getElementById('organizeRecursive').checked;
    const dryRun = document.getElementById('organizeDryRun').checked;

    if (!directory) {
      showToast('Warning', 'Please select a directory', 'warning');
      return;
    }

    try {
      const previewContainer = document.getElementById('organizePreview');
      showLoading(previewContainer);

      const result = await api.organize({
        source_directory: directory,
        operation_type: method,
        dry_run: dryRun,
        create_others: true
      });

      this.currentPreview = result;
      this.renderPreview(result);
      
      showToast('Success', 'Preview generated successfully', 'success');
    } catch (error) {
      console.error('Preview error:', error);
      showError(document.getElementById('organizePreview'), error.message);
      showToast('Error', `Failed to generate preview: ${error.message}`, 'error');
    }
  }

  renderPreview(data) {
    const container = document.getElementById('organizePreview');
    const statsContainer = document.getElementById('previewStats');
    const actionsContainer = document.getElementById('previewActions');

    if (!data.changes || data.changes.length === 0) {
      showEmptyState(
        container,
        'fas fa-check-circle',
        'No Changes Needed',
        'All files are already organized'
      );
      actionsContainer.style.display = 'none';
      statsContainer.textContent = 'No changes required';
      return;
    }

    // Group changes by target directory
    const grouped = {};
    data.changes.forEach(change => {
      const targetDir = change.target_path.substring(0, change.target_path.lastIndexOf('/'));
      if (!grouped[targetDir]) {
        grouped[targetDir] = [];
      }
      grouped[targetDir].push(change);
    });

    // Render grouped changes
    const html = Object.keys(grouped).map(targetDir => {
      const changes = grouped[targetDir];
      return `
        <div class="preview-group">
          <div class="preview-group-header">
            <span>
              <i class="fas fa-folder me-2"></i>
              ${escapeHtml(targetDir)}
            </span>
            <span class="badge bg-light text-dark">${changes.length} file${changes.length > 1 ? 's' : ''}</span>
          </div>
          <div class="preview-items">
            ${changes.map(change => this.renderPreviewItem(change)).join('')}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;

    // Update stats
    const totalSize = data.changes.reduce((sum, change) => sum + (change.size || 0), 0);
    statsContainer.innerHTML = `
      <span class="me-3">
        <i class="fas fa-file me-1"></i>
        ${data.changes.length} file${data.changes.length > 1 ? 's' : ''}
      </span>
      <span>
        <i class="fas fa-hdd me-1"></i>
        ${formatFileSize(totalSize)}
      </span>
    `;

    // Show actions
    actionsContainer.style.display = 'flex';
  }

  renderPreviewItem(change) {
    const fileName = change.source_path.substring(change.source_path.lastIndexOf('/') + 1);
    const targetFileName = change.target_path.substring(change.target_path.lastIndexOf('/') + 1);
    const icon = getFileIcon(fileName, 'file');

    return `
      <div class="preview-item">
        <div class="d-flex align-items-center">
          <i class="fas ${icon.icon} text-${icon.color} me-2"></i>
          <div class="flex-grow-1">
            <div class="preview-item-path">
              ${escapeHtml(fileName)}
              <i class="fas fa-arrow-right preview-item-arrow"></i>
              ${escapeHtml(targetFileName)}
            </div>
            <small class="text-muted">${formatFileSize(change.size || 0)}</small>
          </div>
        </div>
      </div>
    `;
  }

  async applyChanges() {
    if (!this.currentPreview) {
      showToast('Warning', 'No preview available', 'warning');
      return;
    }

    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    document.getElementById('confirmModalTitle').textContent = 'Confirm Organization';
    document.getElementById('confirmModalBody').innerHTML = `
      Are you sure you want to organize <strong>${this.currentPreview.changes.length}</strong> file(s)?
      <br><br>
      <small class="text-muted">This action will move files to their new locations.</small>
    `;

    document.getElementById('confirmActionBtn').onclick = async () => {
      confirmModal.hide();
      await this.executeOrganization();
    };

    confirmModal.show();
  }

  async executeOrganization() {
    const directory = document.getElementById('organizeDir').value;
    const method = document.getElementById('organizeMethod').value;
    const recursive = document.getElementById('organizeRecursive').checked;

    try {
      showLoading(document.getElementById('organizePreview'));

      const result = await api.organize({
        source_directory: directory,
        operation_type: method,
        dry_run: false,
        create_others: true
      });

      showToast(
        'Success',
        `Successfully organized ${result.files_moved || 0} files`,
        'success'
      );

      this.clearPreview();
      
      // Refresh history if on history tab
      if (typeof historyManager !== 'undefined') {
        historyManager.refresh();
      }
    } catch (error) {
      console.error('Organization error:', error);
      showError(document.getElementById('organizePreview'), error.message);
      showToast('Error', `Failed to organize files: ${error.message}`, 'error');
    }
  }

  clearPreview() {
    this.currentPreview = null;
    
    const container = document.getElementById('organizePreview');
    showEmptyState(
      container,
      'fas fa-eye',
      'No Preview Available',
      'Configure rules and click "Generate Preview" to see changes'
    );

    document.getElementById('previewStats').textContent = 'No preview generated';
    document.getElementById('previewActions').style.display = 'none';
  }
}

// Initialize organizer
let organizer;
document.addEventListener('DOMContentLoaded', () => {
  organizer = new Organizer();
});
