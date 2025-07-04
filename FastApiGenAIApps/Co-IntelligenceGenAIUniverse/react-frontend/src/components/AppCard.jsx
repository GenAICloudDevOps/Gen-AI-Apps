import React from 'react';
import { ExternalLink, Play, Info } from 'lucide-react';

const AppCard = ({ app, onLaunch, onInfo }) => {
  const getCategoryColor = (category) => {
    const colors = {
      utility: 'bg-blue-100 text-blue-800',
      analysis: 'bg-green-100 text-green-800',
      productivity: 'bg-purple-100 text-purple-800',
      entertainment: 'bg-pink-100 text-pink-800',
      default: 'bg-gray-100 text-gray-800',
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const getIconDisplay = (icon) => {
    if (icon) {
      return <span className="text-4xl">{icon}</span>;
    }
    return <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
      {app.name.charAt(0)}
    </div>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 card-hover overflow-hidden group">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getIconDisplay(app.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 truncate">
                {app.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(app.category)}`}>
                  {app.category || 'General'}
                </span>
                <span className="text-xs text-gray-500">
                  v{app.version}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex-shrink-0">
            <div className={`w-3 h-3 rounded-full ${app.enabled ? 'bg-green-400' : 'bg-gray-300'}`} />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 pb-6">
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {app.description || 'No description available'}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onLaunch(app)}
            disabled={!app.enabled}
            className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 ${
              app.enabled
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 mr-2" />
            Launch App
            <ExternalLink className="w-4 h-4 ml-2" />
          </button>
          
          <button
            onClick={() => onInfo(app)}
            className="inline-flex items-center justify-center px-3 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default AppCard;
