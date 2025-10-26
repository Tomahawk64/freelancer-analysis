import React, { useState, useEffect } from 'react';
import { freelancerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Search, Filter, Star, Briefcase, Calendar, MapPin, UserCheck, UserX } from 'lucide-react';

const FreelancersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freelancers, setFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterActive, setFilterActive] = useState('all');
  const [countries, setCountries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [freelancersRes, countriesRes, skillsRes] = await Promise.all([
        freelancerAPI.getAll({ page: currentPage, limit: 100 }),
        freelancerAPI.getCountries(),
        freelancerAPI.getSkills()
      ]);
      
      setFreelancers(freelancersRes.data.data);
      setTotalPages(freelancersRes.data.totalPages);
      setCountries(countriesRes.data.data);
      setSkills(skillsRes.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner message="Loading freelancers..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  
  // Apply filters
  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = filterCountry === 'all' || freelancer.country === filterCountry;
    const matchesSkill = filterSkill === 'all' || freelancer.skill === filterSkill;
    const matchesActive = filterActive === 'all' ||
                         (filterActive === 'active' && freelancer.isActive) ||
                         (filterActive === 'inactive' && !freelancer.isActive);
    
    return matchesSearch && matchesCountry && matchesSkill && matchesActive;
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Freelancers</h1>
        <p className="text-gray-600 mt-1">Complete list of registered freelancers</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Total</p>
          <p className="text-2xl font-bold text-blue-900">{filteredFreelancers.length}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm text-green-700 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-900">
            {filteredFreelancers.filter(f => f.isActive).length}
          </p>
        </div>
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm text-red-700 mb-1">Inactive</p>
          <p className="text-2xl font-bold text-red-900">
            {filteredFreelancers.filter(f => !f.isActive).length}
          </p>
        </div>
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1">Avg Rating</p>
          <p className="text-2xl font-bold text-yellow-900">
            {(filteredFreelancers.reduce((sum, f) => sum + f.rating, 0) / filteredFreelancers.length).toFixed(1)}
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                placeholder="Search by name or email..."
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
        
        {(searchTerm || filterCountry !== 'all' || filterSkill !== 'all' || filterActive !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCountry('all');
              setFilterSkill('all');
              setFilterActive('all');
            }}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Freelancers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFreelancers.map((freelancer) => (
          <div key={freelancer._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{freelancer.name}</h3>
                <p className="text-sm text-gray-600">{freelancer.email}</p>
              </div>
              {freelancer.isActive ? (
                <UserCheck className="w-5 h-5 text-green-500" />
              ) : (
                <UserX className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{freelancer.country}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="badge badge-warning">{freelancer.skill}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-gray-700">{freelancer.rating}/5</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{freelancer.projectsWorked} projects</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  {new Date(freelancer.lastActive).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              {freelancer.isActive ? (
                <span className="badge badge-success">Active</span>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="badge badge-danger">
                    Inactive ({freelancer.daysInactive} days)
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredFreelancers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No freelancers found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default FreelancersList;
