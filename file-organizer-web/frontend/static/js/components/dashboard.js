/**
 * Dashboard Component
 */

class Dashboard {
  constructor() {
    this.charts = {};
    this.stats = null;
    this.init();
  }

  init() {
    // Charts will be initialized when dashboard becomes active
  }

  async load(path = null) {
    try {
      await this.loadStats(path);
      await this.loadRecentActivity();
    } catch (error) {
      console.error('Dashboard load error:', error);
    }
  }

  async loadStats(path = null) {
    try {
      const analytics = await api.getAnalytics(path);
      this.stats = analytics;
      
      this.updateStatCards(analytics);
      this.updateCharts(analytics);
    } catch (error) {
      console.error('Load stats error:', error);
      showToast('Error', 'Failed to load analytics', 'error');
    }
  }

  updateStatCards(analytics) {
    document.getElementById('statTotalFiles').textContent = 
      (analytics.total_files || 0).toLocaleString();
    
    document.getElementById('statTotalSize').textContent = 
      formatFileSize(analytics.total_size || 0);
    
    document.getElementById('statOperations').textContent = 
      (analytics.total_operations || 0).toLocaleString();
    
    document.getElementById('statSchedules').textContent = 
      (analytics.active_schedules || 0).toLocaleString();
  }

  updateCharts(analytics) {
    this.updateFileTypeChart(analytics.file_type_distribution || {});
    this.updateStorageChart(analytics.storage_distribution || {});
  }

  updateFileTypeChart(distribution) {
    const ctx = document.getElementById('fileTypeChart');
    if (!ctx) return;

    // Destroy existing chart
    if (this.charts.fileType) {
      this.charts.fileType.destroy();
    }

    const data = Object.entries(distribution).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    this.charts.fileType = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(([type]) => type.toUpperCase()),
        datasets: [{
          label: 'Number of Files',
          data: data.map(([, count]) => count),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(236, 72, 153, 0.8)'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y} files`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  updateStorageChart(distribution) {
    const ctx = document.getElementById('storageChart');
    if (!ctx) return;

    // Destroy existing chart
    if (this.charts.storage) {
      this.charts.storage.destroy();
    }

    const data = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    
    this.charts.storage = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(([type]) => type.toUpperCase()),
        datasets: [{
          data: data.map(([, size]) => size),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(59, 130, 246, 0.8)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = formatFileSize(context.parsed);
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }

  async loadRecentActivity() {
    try {
      const history = await api.getHistory(10, 0);
      this.renderRecentActivity(history);
    } catch (error) {
      console.error('Load recent activity error:', error);
    }
  }

  renderRecentActivity(history) {
    const container = document.getElementById('recentActivity');
    
    if (!history || history.length === 0) {
      showEmptyState(
        container,
        'fas fa-inbox',
        'No Recent Activity',
        'Your recent operations will appear here'
      );
      return;
    }

    const html = history.map(item => `
      <div class="list-group-item">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">
              <i class="fas fa-${item.status === 'completed' ? 'check-circle text-success' : 'exclamation-circle text-danger'} me-2"></i>
              ${escapeHtml(item.directory || 'Organization')}
            </h6>
            <p class="mb-1 text-muted small">
              Organized by ${escapeHtml(item.method || 'unknown')} • 
              ${item.files_moved || 0} files moved
            </p>
          </div>
          <small class="text-muted">${formatDate(item.created_at)}</small>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  destroy() {
    // Destroy all charts
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }
}

// Initialize dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new Dashboard();
});
