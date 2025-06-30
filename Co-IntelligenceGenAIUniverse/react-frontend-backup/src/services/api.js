import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },

  // Get all apps
  async getApps() {
    try {
      const response = await api.get('/api/v1/apps');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch apps: ${error.message}`);
    }
  },

  // Get specific app info
  async getAppInfo(appId) {
    try {
      const response = await api.get(`/api/v1/apps/${appId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch app info: ${error.message}`);
    }
  },

  // Add new app
  async addApp(appData) {
    try {
      const response = await api.post('/api/v1/apps', appData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add app: ${error.message}`);
    }
  },

  // Update app
  async updateApp(appId, appData) {
    try {
      const response = await api.put(`/api/v1/apps/${appId}`, appData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update app: ${error.message}`);
    }
  },

  // Delete app
  async deleteApp(appId) {
    try {
      const response = await api.delete(`/api/v1/apps/${appId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete app: ${error.message}`);
    }
  },

  // Get system stats
  async getSystemStats() {
    try {
      const response = await api.get('/api/v1/system/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch system stats: ${error.message}`);
    }
  },

  // Bedrock API calls
  async chat(message, conversationHistory = []) {
    try {
      const response = await api.post('/api/v1/bedrock/chat', {
        message,
        conversation_history: conversationHistory
      });
      return response.data;
    } catch (error) {
      throw new Error(`Chat failed: ${error.message}`);
    }
  },

  async analyzeText(text, analysisType = 'summary') {
    try {
      const response = await api.post('/api/v1/bedrock/analyze-text', {
        text,
        analysis_type: analysisType
      });
      return response.data;
    } catch (error) {
      throw new Error(`Text analysis failed: ${error.message}`);
    }
  },

  async analyzeDocument(file, analysisType = 'summary') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('analysis_type', analysisType);

      const response = await api.post('/api/v1/bedrock/analyze-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Document analysis failed: ${error.message}`);
    }
  }
};

export default apiService;
