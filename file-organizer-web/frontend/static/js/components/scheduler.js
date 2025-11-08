/**
 * Scheduler Component
 */

class Scheduler {
  constructor() {
    this.schedules = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add schedule button
    document.getElementById('addScheduleBtn')?.addEventListener('click', () => {
      this.showScheduleModal();
    });

    // Save schedule button
    document.getElementById('saveScheduleBtn')?.addEventListener('click', async () => {
      await this.saveSchedule();
    });

    // Select directory button in schedule modal
    document.getElementById('selectScheduleDirBtn')?.addEventListener('click', () => {
      this.showDirectoryPicker();
    });
  }

  showDirectoryPicker() {
    const modal = new bootstrap.Modal(document.getElementById('directoryModal'));
    modal.show();

    document.getElementById('confirmDirectoryBtn').onclick = () => {
      const path = document.getElementById('directoryPathInput').value.trim();
      if (path) {
        document.getElementById('scheduleDir').value = path;
        modal.hide();
      }
    };
  }

  showScheduleModal(schedule = null) {
    const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    
    if (schedule) {
      // Edit mode
      document.getElementById('scheduleName').value = schedule.name;
      document.getElementById('scheduleDir').value = schedule.directory;
      document.getElementById('scheduleMethod').value = schedule.method;
      document.getElementById('scheduleCron').value = schedule.cron;
      document.getElementById('scheduleActive').checked = schedule.is_active;
    } else {
      // Create mode
      document.getElementById('scheduleForm').reset();
    }

    modal.show();
  }

  async saveSchedule() {
    const name = document.getElementById('scheduleName').value.trim();
    const directory = document.getElementById('scheduleDir').value.trim();
    const method = document.getElementById('scheduleMethod').value;
    const cron = document.getElementById('scheduleCron').value.trim();
    const isActive = document.getElementById('scheduleActive').checked;

    if (!name || !directory || !cron) {
      showToast('Warning', 'Please fill in all required fields', 'warning');
      return;
    }

    try {
      const scheduleData = {
        name,
        directory,
        method,
        cron,
        is_active: isActive,
        recursive: true
      };

      await api.createSchedule(scheduleData);
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleModal'));
      modal.hide();

      showToast('Success', 'Schedule created successfully', 'success');
      
      await this.loadSchedules();
    } catch (error) {
      console.error('Save schedule error:', error);
      showToast('Error', `Failed to create schedule: ${error.message}`, 'error');
    }
  }

  async loadSchedules() {
    try {
      const container = document.getElementById('scheduleList');
      showLoading(container);

      this.schedules = await api.getSchedules();
      
      this.render();
    } catch (error) {
      console.error('Load schedules error:', error);
      showError(document.getElementById('scheduleList'), error.message);
    }
  }

  render() {
    const container = document.getElementById('scheduleList');

    if (!this.schedules || this.schedules.length === 0) {
      showEmptyState(
        container,
        'fas fa-clock',
        'No Scheduled Tasks',
        'Create a schedule to automatically organize files'
      );
      return;
    }

    const html = this.schedules.map(schedule => this.renderScheduleItem(schedule)).join('');
    container.innerHTML = html;

    this.attachScheduleListeners();
  }

  renderScheduleItem(schedule) {
    const statusClass = schedule.is_active ? 'success' : 'secondary';
    const statusText = schedule.is_active ? 'Active' : 'Inactive';

    return `
      <div class="schedule-item" data-id="${schedule.id}">
        <div class="schedule-header">
          <div class="schedule-name">
            <i class="fas fa-clock me-2"></i>
            ${escapeHtml(schedule.name)}
          </div>
          <span class="badge bg-${statusClass} schedule-status">${statusText}</span>
        </div>
        <div class="schedule-details">
          <div class="mb-2">
            <i class="fas fa-folder me-2"></i>
            <strong>Directory:</strong> ${escapeHtml(schedule.directory)}
          </div>
          <div class="mb-2">
            <i class="fas fa-magic me-2"></i>
            <strong>Method:</strong> ${escapeHtml(schedule.method)}
          </div>
          <div class="mb-2">
            <i class="fas fa-calendar-alt me-2"></i>
            <strong>Schedule:</strong> <code>${escapeHtml(schedule.cron)}</code>
          </div>
          ${schedule.last_run ? `
            <div>
              <i class="fas fa-history me-2"></i>
              <strong>Last Run:</strong> ${formatRelativeTime(schedule.last_run)}
            </div>
          ` : ''}
        </div>
        <div class="schedule-actions">
          <button class="btn btn-sm btn-outline-${schedule.is_active ? 'warning' : 'success'} toggle-schedule-btn" data-id="${schedule.id}">
            <i class="fas fa-${schedule.is_active ? 'pause' : 'play'} me-1"></i>
            ${schedule.is_active ? 'Pause' : 'Resume'}
          </button>
          <button class="btn btn-sm btn-outline-danger delete-schedule-btn" data-id="${schedule.id}">
            <i class="fas fa-trash me-1"></i>
            Delete
          </button>
        </div>
      </div>
    `;
  }

  attachScheduleListeners() {
    // Toggle schedule
    document.querySelectorAll('.toggle-schedule-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.id);
        await this.toggleSchedule(id);
      });
    });

    // Delete schedule
    document.querySelectorAll('.delete-schedule-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.id);
        await this.deleteSchedule(id);
      });
    });
  }

  async toggleSchedule(id) {
    try {
      await api.toggleSchedule(id);
      showToast('Success', 'Schedule updated', 'success');
      await this.loadSchedules();
    } catch (error) {
      console.error('Toggle schedule error:', error);
      showToast('Error', `Failed to toggle schedule: ${error.message}`, 'error');
    }
  }

  async deleteSchedule(id) {
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    document.getElementById('confirmModalTitle').textContent = 'Delete Schedule';
    document.getElementById('confirmModalBody').textContent = 'Are you sure you want to delete this schedule?';

    document.getElementById('confirmActionBtn').onclick = async () => {
      confirmModal.hide();
      
      try {
        await api.deleteSchedule(id);
        showToast('Success', 'Schedule deleted', 'success');
        await this.loadSchedules();
      } catch (error) {
        console.error('Delete schedule error:', error);
        showToast('Error', `Failed to delete schedule: ${error.message}`, 'error');
      }
    };

    confirmModal.show();
  }

  async refresh() {
    await this.loadSchedules();
  }
}

// Initialize scheduler
let scheduler;
document.addEventListener('DOMContentLoaded', () => {
  scheduler = new Scheduler();
});
