/**
 * Preview Modal Component
 */

class PreviewModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    const modalElement = document.getElementById('previewModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
  }

  async show(filePath) {
    if (!this.modal) return;

    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const icon = getFileIcon(fileName, 'file');

    document.getElementById('previewModalTitle').innerHTML = `
      <i class="fas ${icon.icon} me-2"></i>
      ${escapeHtml(fileName)}
    `;

    const content = document.getElementById('previewContent');
    showLoading(content);

    this.modal.show();

    try {
      const preview = await api.previewFile(filePath);
      this.renderPreview(preview, filePath);
    } catch (error) {
      console.error('Preview error:', error);
      showError(content, error.message);
    }
  }

  renderPreview(preview, filePath) {
    const content = document.getElementById('previewContent');
    const ext = filePath.split('.').pop().toLowerCase();

    // Handle error responses
    if (preview.type === 'error' || preview.error) {
      showError(content, preview.error || preview.message || 'Failed to load preview');
      return;
    }

    // Handle unknown/empty files
    if (preview.type === 'unknown' || (!preview.data && !preview.content)) {
      content.innerHTML = `
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-circle me-2"></i>
          This file appears to be empty or in an unsupported format.
        </div>
        ${preview.metadata ? this.renderMetadata(preview.metadata) : ''}
      `;
      return;
    }

    // Image preview
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
      if (preview.type === 'image' && preview.data) {
        content.innerHTML = `
          <div class="text-center">
            <img src="data:image/${ext};base64,${preview.data}" 
                 class="img-fluid rounded" 
                 style="max-height: 500px;"
                 alt="Preview">
          </div>
          ${this.renderMetadata(preview.metadata)}
        `;
      } else {
        showError(content, 'Image preview not available');
      }
      return;
    }

    // Text preview
    if (['txt', 'md', 'json', 'xml', 'csv', 'log', 'js', 'py', 'java', 'cpp', 'c', 'h', 'css', 'html', 'yml', 'yaml', 'sh', 'bash'].includes(ext)) {
      if (preview.type === 'text' && (preview.data || preview.content)) {
        const textContent = preview.data || preview.content;
        const isTruncated = textContent.length > 50000;
        const displayContent = isTruncated ? textContent.substring(0, 50000) : textContent;
        
        content.innerHTML = `
          ${isTruncated ? `
            <div class="alert alert-warning mb-3">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Large file - showing first 50,000 characters only
            </div>
          ` : ''}
          <pre class="bg-light p-3 rounded" style="max-height: 500px; overflow: auto; font-size: 0.85rem; line-height: 1.4;"><code>${escapeHtml(displayContent)}</code></pre>
          ${this.renderMetadata(preview.metadata)}
        `;
      } else {
        showError(content, 'Text preview not available');
      }
      return;
    }

    // PDF preview
    if (ext === 'pdf') {
      if (preview.type === 'pdf' && preview.text) {
        content.innerHTML = `
          <div class="alert alert-info">
            <i class="fas fa-file-pdf me-2"></i>
            PDF Document - ${preview.pages || 0} page(s)
          </div>
          <div class="bg-light p-3 rounded" style="max-height: 400px; overflow: auto;">
            <h6>Text Content:</h6>
            <p>${escapeHtml(preview.text.substring(0, 1000))}${preview.text.length > 1000 ? '...' : ''}</p>
          </div>
          ${this.renderMetadata(preview.metadata)}
        `;
      } else {
        showError(content, 'PDF preview not available');
      }
      return;
    }

    // Generic file info
    if (preview.metadata) {
      content.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Preview not available for this file type
        </div>
        ${this.renderMetadata(preview.metadata)}
      `;
    } else {
      showError(content, 'Preview not available for this file type');
    }
  }

  renderMetadata(metadata) {
    if (!metadata) return '';

    return `
      <hr>
      <h6 class="mb-3">File Information</h6>
      <div class="row">
        ${metadata.size ? `
          <div class="col-md-6 mb-2">
            <strong>Size:</strong> ${formatFileSize(metadata.size)}
          </div>
        ` : ''}
        ${metadata.created ? `
          <div class="col-md-6 mb-2">
            <strong>Created:</strong> ${formatRelativeTime(metadata.created)}
          </div>
        ` : ''}
        ${metadata.modified ? `
          <div class="col-md-6 mb-2">
            <strong>Modified:</strong> ${formatRelativeTime(metadata.modified)}
          </div>
        ` : ''}
        ${metadata.mime_type ? `
          <div class="col-md-6 mb-2">
            <strong>Type:</strong> ${escapeHtml(metadata.mime_type)}
          </div>
        ` : ''}
        ${metadata.dimensions ? `
          <div class="col-md-6 mb-2">
            <strong>Dimensions:</strong> ${escapeHtml(metadata.dimensions)}
          </div>
        ` : ''}
        ${metadata.duration ? `
          <div class="col-md-6 mb-2">
            <strong>Duration:</strong> ${escapeHtml(metadata.duration)}
          </div>
        ` : ''}
      </div>
    `;
  }

  hide() {
    if (this.modal) {
      this.modal.hide();
    }
  }
}

// Initialize preview modal
let previewModal;
document.addEventListener('DOMContentLoaded', () => {
  previewModal = new PreviewModal();
});
