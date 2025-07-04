import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  FileText, 
  Activity, 
  Zap, 
  Heart, 
  Rocket, 
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Server,
  Brain,
  Sparkles,
  Search,
  Moon,
  Sun,
  Settings,
  BarChart3,
  Clock,
  TrendingUp,
  Shield,
  Database,
  Layers
} from 'lucide-react';
import { apiService, configService } from './services/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apps, setApps] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showManagement, setShowManagement] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [config, setConfig] = useState(null);
  const [environmentInfo, setEnvironmentInfo] = useState({
    deployment_env: 'local',
    urls: {
      backend: 'http://localhost:8000',
      frontend: 'http://localhost:3000',
      ai_chat: 'http://localhost:8501',
      document_analysis: 'http://localhost:8502',
      web_search: 'http://localhost:8503'
    }
  });

  useEffect(() => {
    // Initialize environment configuration first
    initializeEnvironment();
  }, []);

  useEffect(() => {
    if (config) {
      fetchData();
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [config]);

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const initializeEnvironment = async () => {
    try {
      console.log('🔧 Initializing environment configuration...');
      const envConfig = await configService.getConfig();
      console.log('🌍 Environment config loaded:', envConfig);
      
      setConfig(envConfig);
      setEnvironmentInfo(envConfig);
      
      // Update document title based on environment
      document.title = `Co-Intelligence GenAI Universe - ${envConfig.deployment_env === 'cloud' ? 'Cloud' : 'Local'}`;
      
    } catch (error) {
      console.warn('⚠️ Failed to load environment config, using defaults:', error);
      // Keep default localhost configuration
      setConfig(environmentInfo);
    }
  };

  const fetchData = async () => {
    if (!config) {
      console.log('⏳ Config not loaded yet, skipping data fetch...');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Fetching data using environment-aware API service...');
      
      // Use the centralized API service instead of direct fetch calls
      const [healthData, appsData, statsData] = await Promise.all([
        apiService.healthCheck().catch(err => {
          console.warn('Health check failed:', err.message);
          return null;
        }),
        apiService.getApps().catch(err => {
          console.warn('Apps fetch failed:', err.message);
          return { apps: [] };
        }),
        apiService.getSystemStats().catch(err => {
          console.warn('Stats fetch failed:', err.message);
          return { stats: {} };
        })
      ]);

      setSystemHealth(healthData);
      setApps(appsData.apps || []);
      setSystemStats(statsData.stats || {});

      setLastUpdated(new Date());
      setLoading(false);
      
      console.log('✅ Data fetch completed successfully');
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLaunchApp = (app) => {
    // Use environment-aware URL from app configuration or fallback to environment info
    const appUrl = app.url || getEnvironmentAwareUrl(app.port);
    console.log(`🚀 Launching app: ${app.name} at ${appUrl}`);
    window.open(appUrl, '_blank', 'noopener,noreferrer');
  };

  const getEnvironmentAwareUrl = (port) => {
    if (!environmentInfo || !environmentInfo.urls) {
      return `http://localhost:${port}`;
    }
    
    const baseUrl = environmentInfo.deployment_env === 'cloud' 
      ? environmentInfo.urls.backend.replace(':8000', '') 
      : 'http://localhost';
    
    return `${baseUrl}:${port}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Loading Co-Intelligence GenAI Universe</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Initializing AI-powered applications...</p>
          {environmentInfo && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Environment: {environmentInfo.deployment_env || 'detecting...'}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 to-pink-50'} flex items-center justify-center p-4`}>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 max-w-md w-full text-center`}>
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Connection Error</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Unable to connect to the backend API</p>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Apps',
      value: systemStats?.total_apps || apps.length,
      icon: Rocket,
      color: 'from-blue-500 to-blue-600',
      bgColor: darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
    },
    {
      title: 'Active Apps',
      value: systemStats?.active_apps || apps.filter(app => app.status === 'active').length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-50'
    },
    {
      title: 'AI Models',
      value: '2',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-50'
    },
    {
      title: 'Uptime',
      value: '99.9%',
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Co-Intelligence GenAI Universe
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI-Powered Applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${systemHealth ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {systemHealth ? 'Online' : 'Offline'}
                </span>
              </div>
              {environmentInfo && (
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>
                  {environmentInfo.deployment_env === 'cloud' ? '☁️ Cloud' : '🏠 Local'}
                </div>
              )}
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={() => setShowManagement(!showManagement)}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                title="Management Panel"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={fetchData}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Co-Intelligence label below header, top-right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-end">
          <span className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'} animate-breathing`}>
            Co-Intelligence
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Where Human Meets
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
              AI Intelligence
            </span>
          </h2>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}>
            A modular, production-ready platform built with React, FastAPI, Streamlit, and AWS Bedrock - enabling rapid co-intelligence development through scalable architecture.
          </p>
          <p className={`text-lg font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'} mt-4 flex items-center justify-center space-x-2`}>
            <span>⚡</span>
            <span>From concept to live AI app in under 3 minutes*</span>
          </p>
        </div>



        {/* Management Panel */}
        {showManagement && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-8 mb-12`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Management Panel</h3>
              <button
                onClick={() => setShowManagement(false)}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
                <div className="flex items-center space-x-3 mb-3">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analytics</h4>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>View usage patterns and performance metrics</p>
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">View Details →</button>
              </div>
              <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
                <div className="flex items-center space-x-3 mb-3">
                  <Database className="h-5 w-5 text-green-500" />
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Backup</h4>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Backup and restore configurations</p>
                <button className="text-green-500 hover:text-green-600 text-sm font-medium">Manage →</button>
              </div>
              <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Security</h4>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Monitor security and access logs</p>
                <button className="text-purple-500 hover:text-purple-600 text-sm font-medium">Configure →</button>
              </div>
            </div>
          </div>
        )}
        {/* Applications Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Applications</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Activity className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {apps.filter(app => app.status === 'active').length} active
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          
          {apps.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Plus className={`h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
              <h4 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Applications Found</h4>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Use the creation scripts to add new AI applications.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <div key={app.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-300 overflow-hidden group`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                        {app.icon === 'Calculator' && <Calculator className="h-6 w-6 text-white" />}
                        {app.icon === 'FileText' && <FileText className="h-6 w-6 text-white" />}
                        {app.icon === 'Activity' && <Activity className="h-6 w-6 text-white" />}
                        {app.icon === 'Search' && <Search className="h-6 w-6 text-white" />}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        app.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    
                    <h4 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{app.name}</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>{app.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Server className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Port {app.port}</span>
                      </div>
                      <button
                        onClick={() => handleLaunchApp(app)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 group-hover:scale-105"
                      >
                        <span>Launch</span>
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-8 mb-12`}>
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Rocket, title: 'React Frontend', desc: 'Modern, responsive interface', color: 'from-blue-500 to-blue-600' },
              { icon: Zap, title: 'FastAPI Backend', desc: 'High-performance API with auto-docs', color: 'from-yellow-500 to-orange-600' },
              { icon: Brain, title: 'Rapid AI Development', desc: 'AWS Bedrock integration with rapid Streamlit development', color: 'from-purple-500 to-pink-600' },
              { icon: Layers, title: 'Modular Architecture', desc: 'Scalable, maintainable design with independent components', color: 'from-teal-500 to-cyan-600' },
              { icon: Brain, title: 'Co-Intelligence', desc: 'Collaborative intelligence combining human insight and AI', color: 'from-amber-500 to-orange-600' }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl mx-auto w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{feature.title}</h4>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`${environmentInfo?.urls?.backend || 'http://localhost:8000'}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>API Docs</span>
            </a>
            <a
              href={environmentInfo?.urls?.ai_chat || 'http://localhost:8501'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Brain className="h-5 w-5" />
              <span>AI Chat</span>
            </a>
            <a
              href={environmentInfo?.urls?.document_analysis || 'http://localhost:8502'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Document Analysis</span>
            </a>
            <a
              href={environmentInfo?.urls?.web_search || 'http://localhost:8503'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Web Search</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`flex items-center justify-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>using React, FastAPI, Streamlit & AWS Bedrock</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
