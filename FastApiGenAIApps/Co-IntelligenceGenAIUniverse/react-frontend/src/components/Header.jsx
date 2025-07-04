import React from 'react';
import { Rocket, Activity } from 'lucide-react';

const Header = ({ systemHealth }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Multi-App Platform
              </h1>
              <p className="text-sm text-gray-600">
                Professional Application Suite
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity 
                className={`w-5 h-5 ${
                  systemHealth?.status === 'healthy' 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`} 
              />
              <span className="text-sm font-medium text-gray-700">
                System {systemHealth?.status === 'healthy' ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {systemHealth?.version && (
              <div className="hidden sm:block">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  v{systemHealth.version}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
