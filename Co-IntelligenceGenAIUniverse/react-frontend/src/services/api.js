import axios from 'axios';

// Environment-aware API configuration
const getApiBaseUrl = () => {
  // Check if we're in build time (environment variables are baked in)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Runtime detection for dynamic environments
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api/v1';
  } else {
    // Assume cloud deployment with same hostname
    return `http://${hostname}:8000/api/v1`;
  }
};

// API configuration
const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

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

// Environment configuration service
export const configService = {
  async getConfig() {
    try {
      const response = await api.get('/config');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch config, using defaults:', error.message);
      return {
        deployment_env: 'local',
        host_ip: 'localhost',
        public_ip: 'localhost',
        urls: {
          backend: 'http://localhost:8000',
          frontend: 'http://localhost:3000',
          ai_chat: 'http://localhost:8501',
          document_analysis: 'http://localhost:8502',
          web_search: 'http://localhost:8503'
        }
      };
    }
  }
};

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

  // Get environment configuration
  async getConfig() {
    return configService.getConfig();
  },

  // Get all apps
  async getApps() {
    try {
      const response = await api.get('/apps');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch apps: ${error.message}`);
    }
  },

  // Get specific app info
  async getAppInfo(appId) {
    try {
      const response = await api.get(`/apps/${appId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch app info: ${error.message}`);
    }
  },

  // Add new app
  async addApp(appData) {
    try {
      const response = await api.post('/apps', appData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add app: ${error.message}`);
    }
  },

  // Update app
  async updateApp(appId, appData) {
    try {
      const response = await api.put(`/apps/${appId}`, appData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update app: ${error.message}`);
    }
  },

  // Delete app
  async deleteApp(appId) {
    try {
      const response = await api.delete(`/apps/${appId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete app: ${error.message}`);
    }
  },

  // Get system stats
  async getSystemStats() {
    try {
      const response = await api.get('/system/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch system stats: ${error.message}`);
    }
  },

  // Bedrock API calls
  async chat(message, conversationHistory = []) {
    try {
      const response = await api.post('/bedrock/chat', {
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
      const response = await api.post('/bedrock/analyze-text', {
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

      const response = await api.post('/bedrock/analyze-document', formData, {
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
