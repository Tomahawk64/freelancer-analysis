import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { freelancerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Trophy, Star, Briefcase, Calendar, Award, Search } from 'lucide-react';

const PerformanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterSkill, setFilterSkill] = useState('all');
  const [countries, setCountries] = useState([]);
  const [skills, setSkills] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsRes, countriesRes, skillsRes] = await Promise.all([
        freelancerAPI.getAnalytics(),
        freelancerAPI.getCountries(),
        freelancerAPI.getSkills()
      ]);
      
      setAnalytics(analyticsRes.data.data);
      setCountries(countriesRes.data.data);
      setSkills(skillsRes.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner message="Loading performance data..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!analytics) return null;
  
  const { performanceMetrics } = analytics;
  
  // Apply filters
  const filteredMetrics = performanceMetrics.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = filterCountry === 'all' || freelancer.country === filterCountry;
    const matchesSkill = filterSkill === 'all' || freelancer.skill === filterSkill;
    
    return matchesSearch && matchesCountry && matchesSkill;
  });
  
  // Top 10 performers
  const topPerformers = filteredMetrics.slice(0, 10);
  
  // Chart data
  const chartData = topPerformers.map(f => ({
    name: f.name.split(' ')[0], // First name only for chart
    performanceIndex: (f.performanceIndex * 100).toFixed(1),
    rating: f.rating,
    projects: f.projectsWorked
  }));
  
  // Get performance tier
  const getPerformanceTier = (index) => {
    if (index >= 0.8) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (index >= 0.6) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (index >= 0.4) return { label: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };
  
  // Calculate stats
  const avgPerformance = (filteredMetrics.reduce((sum, f) => sum + f.performanceIndex, 0) / filteredMetrics.length).toFixed(4);
  const avgRating = (filteredMetrics.reduce((sum, f) => sum + f.rating, 0) / filteredMetrics.length).toFixed(2);
  const avgProjects = Math.round(filteredMetrics.reduce((sum, f) => sum + f.projectsWorked, 0) / filteredMetrics.length);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
        <p className="text-gray-600 mt-1">Top performing freelancers by performance index</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-900">Avg Performance</h4>
          </div>
          <p className="text-3xl font-bold text-blue-700">{(avgPerformance * 100).toFixed(1)}%</p>
          <p className="text-xs text-blue-600 mt-1">Across all freelancers</p>
        </div>
        
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <h4 className="text-sm font-medium text-yellow-900">Avg Rating</h4>
          </div>
          <p className="text-3xl font-bold text-yellow-700">{avgRating}/5</p>
          <p className="text-xs text-yellow-600 mt-1">Client satisfaction</p>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-medium text-green-900">Avg Projects</h4>
          </div>
          <p className="text-3xl font-bold text-green-700">{avgProjects}</p>
          <p className="text-xs text-green-600 mt-1">Completed projects</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="input w-full pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill
            </label>
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Skills</option>
              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {(searchTerm || filterCountry !== 'all' || filterSkill !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCountry('all');
              setFilterSkill('all');
            }}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Top 10 Chart */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Top 10 Performers
          </h3>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis label={{ value: 'Performance Index (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="performanceIndex" name="Performance Index" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Performance Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detailed Performance Metrics ({filteredMetrics.length} freelancers)
        </h3>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Country</th>
                <th>Skill</th>
                <th>Rating</th>
                <th>Projects</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Performance Index</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.slice(0, 50).map((freelancer, index) => {
                const tier = getPerformanceTier(freelancer.performanceIndex);
                
                return (
                  <tr key={freelancer.id} className="hover:bg-gray-50">
                    <td>
                      <div className="flex items-center gap-2">
                        {index < 3 && (
                          <Trophy className={`w-4 h-4 ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            'text-orange-600'
                          }`} />
                        )}
                        <span className="font-semibold">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="font-medium">{freelancer.name}</td>
                    <td>{freelancer.country}</td>
                    <td>
                      <span className="badge badge-warning">{freelancer.skill}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{freelancer.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{freelancer.projectsWorked}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(freelancer.lastActive).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      {freelancer.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-danger">Inactive</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${freelancer.performanceIndex * 100}%` }}
                          />
                        </div>
                        <span className="font-semibold text-sm">
                          {(freelancer.performanceIndex * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${tier.color}`}>
                        {tier.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
