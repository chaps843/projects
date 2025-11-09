/**
 * API Client for File Organizer Backend
 */

class API {
  constructor(baseURL = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  /**
   * Make API request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`
        }));
        throw new Error(error.detail || error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // =====================================================
  // File Browser Endpoints
  // =====================================================

  /**
   * Get directory contents
   * @param {string} path - Directory path
   * @param {boolean} recursive - Include subdirectories
   */
  async browse(path, recursive = false) {
    console.log('[API.browse] Requesting path:', path, 'recursive:', recursive);
    const result = await this.get('/api/v1/files/browse', { path, recursive });
    console.log('[API.browse] Response received:', result);
    return result;
  }

  /**
   * Get file information
   * @param {string} path - File path
   */
  async getFileInfo(path) {
    return this.get('/api/v1/files/info', { path });
  }

  /**
   * Preview file
   * @param {string} path - File path
   */
  async previewFile(path) {
    return this.get('/api/v1/preview/file', { path });
  }

  /**
   * Search files
   * @param {string} directory - Directory to search
   * @param {string} pattern - Search pattern
   * @param {boolean} recursive - Include subdirectories
   */
  async searchFiles(directory, pattern, recursive = true) {
    return this.get('/api/v1/files/search', { base_path: directory, pattern });
  }

  // =====================================================
  // Organization Endpoints
  // =====================================================

  /**
   * Organize files (preview or execute)
   * @param {object} options - Organization options
   */
  async organize(options) {
    const endpoint = options.dry_run 
      ? '/api/v1/organize/preview' 
      : '/api/v1/organize/execute';
    return this.post(endpoint, options);
  }

  /**
   * Get organization rules
   */
  async getRules() {
    return this.get('/api/v1/rules');
  }

  /**
   * Add custom rule
   * @param {object} rule - Rule definition
   */
  async addRule(rule) {
    return this.post('/api/v1/rules', rule);
  }

  /**
   * Delete rule
   * @param {number} ruleId - Rule ID
   */
  async deleteRule(ruleId) {
    return this.delete(`/api/v1/rules/${ruleId}`);
  }

  // =====================================================
  // Schedule Endpoints
  // =====================================================

  /**
   * Get all schedules
   */
  async getSchedules() {
    return this.get('/api/v1/schedule');
  }

  /**
   * Get schedule by ID
   * @param {number} scheduleId - Schedule ID
   */
  async getSchedule(scheduleId) {
    return this.get(`/api/v1/schedule/${scheduleId}`);
  }

  /**
   * Create schedule
   * @param {object} schedule - Schedule definition
   */
  async createSchedule(schedule) {
    return this.post('/api/v1/schedule', schedule);
  }

  /**
   * Update schedule
   * @param {number} scheduleId - Schedule ID
   * @param {object} schedule - Updated schedule data
   */
  async updateSchedule(scheduleId, schedule) {
    return this.put(`/api/v1/schedule/${scheduleId}`, schedule);
  }

  /**
   * Delete schedule
   * @param {number} scheduleId - Schedule ID
   */
  async deleteSchedule(scheduleId) {
    return this.delete(`/api/v1/schedule/${scheduleId}`);
  }

  /**
   * Enable schedule
   * @param {number} scheduleId - Schedule ID
   */
  async enableSchedule(scheduleId) {
    return this.post(`/api/v1/schedule/${scheduleId}/enable`);
  }

  /**
   * Disable schedule
   * @param {number} scheduleId - Schedule ID
   */
  async disableSchedule(scheduleId) {
    return this.post(`/api/v1/schedule/${scheduleId}/disable`);
  }

  // =====================================================
  // History Endpoints
  // =====================================================

  /**
   * Get operation history
   * @param {number} limit - Number of records to return
   * @param {number} offset - Offset for pagination
   */
  async getHistory(limit = 50, offset = 0) {
    return this.get('/api/v1/history', { limit, offset });
  }

  /**
   * Get history by ID
   * @param {number} historyId - History ID
   */
  async getHistoryById(historyId) {
    return this.get(`/api/v1/history/${historyId}`);
  }

  /**
   * Clear history
   */
  async clearHistory() {
    return this.delete('/api/v1/history');
  }

  // =====================================================
  // Analytics Endpoints
  // =====================================================

  /**
   * Get analytics/statistics
   * @param {string} path - Directory path (optional)
   */
  async getAnalytics(path = null) {
    // Use history stats endpoint for analytics
    return this.get('/api/v1/history/stats/summary');
  }

  /**
   * Get file type distribution
   * @param {string} path - Directory path
   */
  async getFileTypeDistribution(path) {
    // Use analytics dashboard endpoint
    return this.get('/api/v1/history/analytics/dashboard', { days: 30 });
  }

  // =====================================================
  // System Endpoints
  // =====================================================

  /**
   * Health check
   */
  async healthCheck() {
    return this.get('/health');
  }

  /**
   * Get system info
   */
  async getSystemInfo() {
    return this.get('/api/v1/system-info');
  }
}

// Create global API instance
const api = new API();
