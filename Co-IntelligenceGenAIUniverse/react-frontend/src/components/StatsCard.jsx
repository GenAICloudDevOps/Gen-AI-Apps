import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-500 text-primary-100',
    secondary: 'bg-secondary-500 text-secondary-100',
    green: 'bg-green-500 text-green-100',
    blue: 'bg-blue-500 text-blue-100',
    purple: 'bg-purple-500 text-purple-100',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
