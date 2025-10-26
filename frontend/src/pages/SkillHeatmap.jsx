import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { freelancerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Filter, TrendingUp } from 'lucide-react';

const SkillHeatmap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
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
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner message="Loading heatmap data..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!analytics) return null;
  
  const { skillDistribution } = analytics;
  
  // Transform data for visualization
  const getChartData = () => {
    const data = [];
    
    Object.entries(skillDistribution).forEach(([country, skills]) => {
      // Filter by selected country
      if (selectedCountry !== 'all' && country !== selectedCountry) return;
      
      Object.entries(skills).forEach(([skill, count]) => {
        // Filter by selected skill
        if (selectedSkill !== 'all' && skill !== selectedSkill) return;
        
        data.push({
          country,
          skill,
          count,
          label: `${country} - ${skill}`
        });
      });
    });
    
    return data.sort((a, b) => b.count - a.count).slice(0, 20);
  };
  
  // Get top skills by country
  const getTopSkillsByCountry = () => {
    const topSkills = {};
    
    Object.entries(skillDistribution).forEach(([country, skills]) => {
      const sortedSkills = Object.entries(skills)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      topSkills[country] = sortedSkills;
    });
    
    return topSkills;
  };
  
  const chartData = getChartData();
  const topSkillsByCountry = getTopSkillsByCountry();
  
  // Colors for bars
  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Regional Skill Heatmap</h1>
        <p className="text-gray-600 mt-1">Distribution of skills across different countries</p>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
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
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
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
        
        {(selectedCountry !== 'all' || selectedSkill !== 'all') && (
          <button
            onClick={() => {
              setSelectedCountry('all');
              setSelectedSkill('all');
            }}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {/* Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Skill Distribution (Top 20)
        </h3>
        
        {chartData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No data available for selected filters</p>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  angle={-45}
                  textAnchor="end"
                  height={150}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="count" name="Number of Freelancers" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      {/* Top Skills by Country */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Top Skills by Country
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(topSkillsByCountry).slice(0, 12).map(([country, skills]) => (
            <div key={country} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">{country}</h4>
              <div className="space-y-2">
                {skills.map(([skill, count], index) => (
                  <div key={skill} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Total Countries</h4>
          <p className="text-3xl font-bold text-blue-700">{countries.length}</p>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h4 className="text-sm font-medium text-green-900 mb-2">Total Skills</h4>
          <p className="text-3xl font-bold text-green-700">{skills.length}</p>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Unique Combinations</h4>
          <p className="text-3xl font-bold text-purple-700">
            {Object.values(skillDistribution).reduce((acc, skills) => acc + Object.keys(skills).length, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillHeatmap;
