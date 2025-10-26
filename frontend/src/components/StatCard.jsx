import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      text: 'text-blue-600',
      glow: 'shadow-blue-500/50'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-emerald-500',
      text: 'text-green-600',
      glow: 'shadow-green-500/50'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-500 to-rose-500',
      text: 'text-red-600',
      glow: 'shadow-red-500/50'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      text: 'text-yellow-600',
      glow: 'shadow-yellow-500/50'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-pink-500',
      text: 'text-purple-600',
      glow: 'shadow-purple-500/50'
    },
  };
  
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === 'up') return <ArrowUp className="w-4 h-4" />;
    if (trend.direction === 'down') return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };
  
  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.positive) return 'text-green-600 bg-green-50';
    if (trend.positive === false) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };
  
  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div className={`absolute -inset-0.5 ${colorClasses[color].bg} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300`}></div>
      
      {/* Card content */}
      <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{title}</p>
            <h3 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${colorClasses[color].bg.replace('bg-gradient-to-br', 'from-blue-600 to-cyan-600')} bg-clip-text text-transparent`}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
            )}
            {trend && (
              <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-bold ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trend.value}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="relative">
              <div className={`absolute inset-0 ${colorClasses[color].bg} rounded-xl blur-md opacity-50`}></div>
              <div className={`relative ${colorClasses[color].bg} p-3.5 rounded-xl shadow-lg ${colorClasses[color].glow} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
