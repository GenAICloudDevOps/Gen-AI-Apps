/**
 * Environment Detection Utilities
 * Provides comprehensive environment detection for React frontend
 */

export const detectEnvironment = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  console.log('🔍 Environment Detection:');
  console.log('  - Hostname:', hostname);
  console.log('  - Port:', port);
  console.log('  - Full URL:', window.location.href);
  
  // Check build-time environment variables
  const buildTimeEnv = {
    apiUrl: process.env.REACT_APP_API_URL,
    backendUrl: process.env.REACT_APP_BACKEND_URL,
    aiChatUrl: process.env.REACT_APP_AI_CHAT_URL,
    documentAnalysisUrl: process.env.REACT_APP_DOCUMENT_ANALYSIS_URL,
    webSearchUrl: process.env.REACT_APP_WEB_SEARCH_URL
  };
  
  console.log('  - Build-time env vars:', buildTimeEnv);
  
  // Determine if we're in cloud or local environment
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const isCloud = !isLocal;
  
  const environment = {
    deployment_env: isCloud ? 'cloud' : 'local',
    hostname,
    port,
    isLocal,
    isCloud,
    buildTimeEnv
  };
  
  console.log('  - Detected environment:', environment);
  
  return environment;
};

export const getEnvironmentUrls = (environment) => {
  const { hostname, isLocal, buildTimeEnv } = environment;
  
  // If build-time environment variables are available, use them
  if (buildTimeEnv.apiUrl && buildTimeEnv.backendUrl) {
    console.log('🔧 Using build-time environment URLs');
    return {
      backend: buildTimeEnv.backendUrl,
      api: buildTimeEnv.apiUrl,
      ai_chat: buildTimeEnv.aiChatUrl,
      document_analysis: buildTimeEnv.documentAnalysisUrl,
      web_search: buildTimeEnv.webSearchUrl
    };
  }
  
  // Runtime URL detection
  const baseUrl = isLocal ? 'http://localhost' : `http://${hostname}`;
  
  const urls = {
    backend: `${baseUrl}:8000`,
    api: `${baseUrl}:8000/api/v1`,
    ai_chat: `${baseUrl}:8501`,
    document_analysis: `${baseUrl}:8502`,
    web_search: `${baseUrl}:8503`
  };
  
  console.log('🌐 Generated runtime URLs:', urls);
  
  return urls;
};

export const createEnvironmentConfig = () => {
  const environment = detectEnvironment();
  const urls = getEnvironmentUrls(environment);
  
  const config = {
    deployment_env: environment.deployment_env,
    host_ip: environment.hostname,
    public_ip: environment.hostname,
    urls: {
      backend: urls.backend,
      frontend: `${environment.isLocal ? 'http://localhost' : `http://${environment.hostname}`}:3000`,
      ai_chat: urls.ai_chat,
      document_analysis: urls.document_analysis,
      web_search: urls.web_search
    },
    environment: environment
  };
  
  console.log('🚀 Final environment config:', config);
  
  return config;
};
