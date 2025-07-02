import axios from 'axios';
import { createEnvironmentConfig } from '../utils/environment';

// Environment-aware API configuration
const getApiBaseUrl = () => {
  // Check if we're in build time (environment variables are baked in)
  if (process.env.REACT_APP_API_URL) {
    console.log('🔧 Using build-time API URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Runtime detection for dynamic environments
  const hostname = window.location.hostname;
  console.log('🌐 Detected hostname:', hostname);
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const url = 'http://localhost:8000/api/v1';
    console.log('🏠 Using local API URL:', url);
    return url;
  } else {
    // Assume cloud deployment with same hostname
    const url = `http://${hostname}:8000/api/v1`;
    console.log('☁️ Using cloud API URL:', url);
    return url;
  }
};

// API configuration
const API_BASE_URL = getApiBaseUrl();

console.log('🚀 API Base URL configured:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create separate instance for health checks (different base URL)
const healthApi = axios.create({
  baseURL: API_BASE_URL.replace('/api/v1', ''),
  timeout: 10000,
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
      console.log('📡 Fetching environment configuration from backend...');
      const response = await api.get('/config');
      console.log('✅ Backend environment config received:', response.data);
      return response.data;
    } catch (error) {
      console.warn('⚠️ Failed to fetch backend config, using client-side detection:', error.message);
      
      // Use client-side environment detection as fallback
      const clientConfig = createEnvironmentConfig();
      console.log('🔄 Using client-side environment config:', clientConfig);
      return clientConfig;
    }
  }
};

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      console.log('🏥 Performing health check...');
      const response = await healthApi.get('/health');
      console.log('✅ Health check successful');
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
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
      console.log('📱 Fetching apps list...');
      const response = await api.get('/apps');
      console.log('✅ Apps list received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch apps:', error.message);
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
      console.log('📊 Fetching system stats...');
      const response = await api.get('/system/stats');
      console.log('✅ System stats received');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch system stats:', error.message);
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
