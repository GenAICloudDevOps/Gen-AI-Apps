import React from 'react';
import { X, ExternalLink, Play, Tag, Calendar, Settings } from 'lucide-react';

const AppModal = ({ app, isOpen, onClose, onLaunch }) => {
  if (!isOpen || !app) return null;

  const getCategoryColor = (category) => {
    const colors = {
      utility: 'bg-blue-100 text-blue-800 border-blue-200',
      analysis: 'bg-green-100 text-green-800 border-green-200',
      productivity: 'bg-purple-100 text-purple-800 border-purple-200',
      entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {app.icon && (
                  <span className="text-3xl">{app.icon}</span>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {app.name}
                  </h2>
                  <p className="text-primary-100">
                    Detailed Information
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-primary-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* App Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(app.category)}`}>
                      {app.category || 'General'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Version</p>
                    <p className="font-medium text-gray-900">
                      {app.version || '1.0.0'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${app.enabled ? 'bg-green-400' : 'bg-gray-300'}`} />
                      <span className={`text-sm font-medium ${app.enabled ? 'text-green-600' : 'text-gray-500'}`}>
                        {app.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Icon Large */}
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center">
                  {app.icon ? (
                    <span className="text-6xl">{app.icon}</span>
                  ) : (
                    <span className="text-4xl font-bold text-primary-600">
                      {app.name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {app.description || 'No detailed description available for this application.'}
              </p>
            </div>

            {/* Features or Additional Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Features
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  {app.id === 'calculator' && (
                    <>
                      <li>• Basic arithmetic operations (+, -, *, /)</li>
                      <li>• Advanced functions (sqrt, log, sin, cos, tan)</li>
                      <li>• Safe expression evaluation</li>
                      <li>• Real-time calculation</li>
                    </>
                  )}
                  {app.id === 'text_analyzer' && (
                    <>
                      <li>• Text metrics and statistics</li>
                      <li>• AI-powered sentiment analysis</li>
                      <li>• Automatic text summarization</li>
                      <li>• Reading time estimation</li>
                    </>
                  )}
                  {app.id === 'web_search' && (
                    <>
                      <li>• Privacy-focused web search using DuckDuckGo</li>
                      <li>• Safe search filtering options</li>
                      <li>• Content extraction and formatting</li>
                      <li>• Modern Gradio interface</li>
                      <li>• Customizable result count (1-20)</li>
                    </>
                  )}
                  {!['calculator', 'text_analyzer', 'web_search'].includes(app.id) && (
                    <li>• Professional-grade functionality</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Interface Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Interface
              </h3>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  {app.id === 'web_search' ? (
                    <>
                      <strong>🎨 Gradio Interface:</strong> Modern, interactive web interface optimized for search functionality
                    </>
                  ) : (
                    <>
                      <strong>📊 Streamlit Interface:</strong> Interactive web application with real-time updates
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onLaunch(app);
                onClose();
              }}
              disabled={!app.enabled}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                app.enabled
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 mr-2 inline" />
              Launch App
              <ExternalLink className="w-4 h-4 ml-2 inline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppModal;
