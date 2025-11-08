/**
 * Utility functions for formatting data
 */

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format date in human-readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Format as date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format relative time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted relative time
 */
function formatRelativeTime(date) {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get file icon class based on file type
 * @param {string} filename - File name
 * @param {string} fileType - File type (file or directory)
 * @returns {object} Icon class and category
 */
function getFileIcon(filename, fileType) {
  if (fileType === 'directory') {
    return {
      icon: 'fa-folder',
      category: 'folder',
      color: 'warning'
    };
  }
  
  const ext = filename.split('.').pop().toLowerCase();
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(ext)) {
    return {
      icon: 'fa-file-image',
      category: 'image',
      color: 'purple'
    };
  }
  
  // Documents
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
    return {
      icon: 'fa-file-alt',
      category: 'document',
      color: 'primary'
    };
  }
  
  // Spreadsheets
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
    return {
      icon: 'fa-file-excel',
      category: 'document',
      color: 'success'
    };
  }
  
  // Presentations
  if (['ppt', 'pptx', 'odp'].includes(ext)) {
    return {
      icon: 'fa-file-powerpoint',
      category: 'document',
      color: 'danger'
    };
  }
  
  // Code
  if (['js', 'ts', 'py', 'java', 'cpp', 'c', 'h', 'css', 'html', 'php', 'rb', 'go', 'rs'].includes(ext)) {
    return {
      icon: 'fa-file-code',
      category: 'document',
      color: 'info'
    };
  }
  
  // Videos
  if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v'].includes(ext)) {
    return {
      icon: 'fa-file-video',
      category: 'video',
      color: 'danger'
    };
  }
  
  // Audio
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'].includes(ext)) {
    return {
      icon: 'fa-file-audio',
      category: 'audio',
      color: 'success'
    };
  }
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) {
    return {
      icon: 'fa-file-archive',
      category: 'archive',
      color: 'primary'
    };
  }
  
  // Default
  return {
    icon: 'fa-file',
    category: 'default',
    color: 'secondary'
  };
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Show loading indicator
 * @param {HTMLElement} element - Element to show loading in
 */
function showLoading(element) {
  element.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading...</p>
    </div>
  `;
}

/**
 * Show error message
 * @param {HTMLElement} element - Element to show error in
 * @param {string} message - Error message
 */
function showError(element, message = 'An error occurred') {
  element.innerHTML = `
    <div class="text-center text-danger py-5">
      <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
      <h5>Error</h5>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

/**
 * Show empty state
 * @param {HTMLElement} element - Element to show empty state in
 * @param {string} icon - Font Awesome icon class
 * @param {string} title - Title text
 * @param {string} description - Description text
 */
function showEmptyState(element, icon, title, description) {
  element.innerHTML = `
    <div class="text-center text-muted py-5">
      <i class="${icon} fa-4x mb-3"></i>
      <h5>${escapeHtml(title)}</h5>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
