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
  Search
} from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apps, setApps] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [systemStats, setSystemStats] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch system health
      const healthResponse = await fetch('http://localhost:8000/health');
      const healthData = await healthResponse.json();
      setSystemHealth(healthData);

      // Fetch apps
      const appsResponse = await fetch('http://localhost:8000/api/v1/apps');
      const appsData = await appsResponse.json();
      setApps(appsData.apps || []);

      // Fetch system stats
      const statsResponse = await fetch('http://localhost:8000/api/v1/system/stats');
      const statsData = await statsResponse.json();
      setSystemStats(statsData.stats || {});

      setLoading(false);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLaunchApp = (app) => {
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading GenAI Platform</h2>
          <p className="text-gray-600">Initializing AI-powered applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">Unable to connect to the backend API</p>
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
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Apps',
      value: systemStats?.active_apps || apps.filter(app => app.status === 'active').length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'AI Models',
      value: '2',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  GenAI Platform
                </h1>
                <p className="text-sm text-gray-500">AI-Powered Applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${systemHealth ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {systemHealth ? 'Online' : 'Offline'}
                </span>
              </div>
              <button
                onClick={fetchData}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to the Future of
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
              AI Applications
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A production-ready platform combining React, FastAPI, Streamlit, and AWS Bedrock 
            to deliver powerful AI-driven experiences.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Applications Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900">AI Applications</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>{apps.filter(app => app.status === 'active').length} active</span>
            </div>
          </div>
          
          {apps.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Plus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h4>
              <p className="text-gray-600">Use the creation scripts to add new AI applications.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                        {app.icon === 'Calculator' && <Calculator className="h-6 w-6 text-white" />}
                        {app.icon === 'FileText' && <FileText className="h-6 w-6 text-white" />}
                        {app.icon === 'Activity' && <Activity className="h-6 w-6 text-white" />}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        app.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{app.name}</h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">{app.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Server className="h-4 w-4" />
                        <span>Port {app.port}</span>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Rocket, title: 'React Frontend', desc: 'Modern, responsive interface', color: 'from-blue-500 to-blue-600' },
              { icon: Zap, title: 'FastAPI Backend', desc: 'High-performance API with auto-docs', color: 'from-yellow-500 to-orange-600' },
              { icon: Brain, title: 'AI Integration', desc: 'AWS Bedrock with Claude models', color: 'from-purple-500 to-pink-600' },
              { icon: Activity, title: 'Streamlit Apps', desc: 'Rapid AI app development', color: 'from-green-500 to-teal-600' }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl mx-auto w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>API Docs</span>
            </a>
            <a
              href="http://localhost:8501"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Brain className="h-5 w-5" />
              <span>AI Chat</span>
            </a>
            <a
              href="http://localhost:8502"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Document Analysis</span>
            </a>
            <a
              href="http://localhost:8503"
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
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
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
