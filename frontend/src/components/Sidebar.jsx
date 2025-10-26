import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  TrendingUp,
  Users,
  Menu,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/',
      icon: LayoutDashboard,
      label: 'Overview',
      description: 'Active vs Inactive',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      path: '/heatmap',
      icon: MapPin,
      label: 'Skill Heatmap',
      description: 'Regional Distribution',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      path: '/performance',
      icon: TrendingUp,
      label: 'Performance',
      description: 'Top Performers',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      path: '/freelancers',
      icon: Users,
      label: 'All Freelancers',
      description: 'Complete List',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 
          bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30
          backdrop-blur-xl border-r border-gray-200/50 shadow-2xl
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Freelancer Analytics
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Data Dashboard Pro</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={`
                      group relative flex items-start gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                      ${active
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                        : 'text-gray-700 hover:bg-white/80 hover:shadow-md hover:scale-102'
                      }
                    `}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-xl opacity-50"></div>
                    )}
                    <div className="relative">
                      <Icon className={`w-5 h-5 mt-0.5 transition-transform duration-300 ${active ? 'text-white scale-110' : 'text-gray-500 group-hover:text-indigo-600 group-hover:scale-110'}`} />
                    </div>
                    <div className="relative flex-1">
                      <div className={`font-semibold ${active ? 'text-white' : 'text-gray-900'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${active ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                    {active && (
                      <Sparkles className="relative w-4 h-4 text-yellow-300 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
            <div className="text-center">
              <div className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                v1.0.0 • {new Date().getFullYear()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Powered by AI Analytics
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
