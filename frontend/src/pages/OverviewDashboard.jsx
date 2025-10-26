import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Users, UserCheck, UserX, Mail, AlertCircle } from 'lucide-react';
import { freelancerAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

const OverviewDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [selectedFreelancers, setSelectedFreelancers] = useState([]);
  const [sendingEmails, setSendingEmails] = useState(false);
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await freelancerAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectFreelancer = (freelancerId) => {
    setSelectedFreelancers(prev => {
      if (prev.includes(freelancerId)) {
        return prev.filter(id => id !== freelancerId);
      } else {
        return [...prev, freelancerId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedFreelancers.length === analytics.inactiveFreelancers.length) {
      setSelectedFreelancers([]);
    } else {
      setSelectedFreelancers(analytics.inactiveFreelancers.map(f => f.id));
    }
  };
  
  const handleSendEmails = async () => {
    if (selectedFreelancers.length === 0) {
      toast.error('Please select at least one freelancer');
      return;
    }
    
    try {
      setSendingEmails(true);
      const response = await freelancerAPI.reactivate(selectedFreelancers);
      toast.success(`Successfully sent ${response.data.data.emailsSent} email(s)!`);
      setSelectedFreelancers([]);
    } catch (err) {
      console.error('Error sending emails:', err);
      toast.error(err.response?.data?.message || 'Failed to send emails');
    } finally {
      setSendingEmails(false);
    }
  };
  
  if (loading) return <LoadingSpinner message="Loading analytics..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAnalytics} />;
  if (!analytics) return null;
  
  const { activitySummary, inactiveFreelancers } = analytics;
  
  // Chart data with modern gradients
  const chartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [activitySummary.active, activitySummary.inactive],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // Green
          'rgba(239, 68, 68, 0.8)'     // Red
        ],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 4,
        hoverOffset: 15,
        hoverBorderWidth: 6
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 24,
          font: {
            size: 14,
            weight: '600'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 16,
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = activitySummary.total;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };
  
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-10 h-10" />
            Overview Dashboard
          </h1>
          <p className="text-indigo-100 text-lg">Freelancer activity and engagement metrics</p>
        </div>
      </div>
      
      {/* Stats Grid with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Freelancers"
          value={activitySummary.total}
          icon={Users}
          color="blue"
          subtitle="Registered in system"
        />
        <StatCard
          title="Active Freelancers"
          value={activitySummary.active}
          icon={UserCheck}
          color="green"
          subtitle={`${activitySummary.activePercentage}% of total`}
        />
        <StatCard
          title="Inactive Freelancers"
          value={activitySummary.inactive}
          icon={UserX}
          color="red"
          subtitle={`${activitySummary.inactivePercentage}% of total`}
        />
        <StatCard
          title="Engagement Rate"
          value={`${activitySummary.activePercentage}%`}
          icon={AlertCircle}
          color="yellow"
          subtitle="Last 90 days"
        />
      </div>
      
      {/* Chart Section with Glass Effect */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Activity Distribution
              </h3>
            </div>
            <div className="h-80">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <p className="text-sm text-indigo-800 font-medium">
                <strong>💡 Note:</strong> Active freelancers are those who logged in within the last 90 days.
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Quick Insights
              </h3>
            </div>
            <div className="space-y-4">
              <div className="relative overflow-hidden p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-green-900 text-lg">Active Users</span>
                </div>
                <p className="text-sm text-green-700 font-medium leading-relaxed">
                  {activitySummary.active} freelancers are actively engaged with the platform.
                </p>
              </div>
              
              <div className="relative overflow-hidden p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <UserX className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-red-900 text-lg">Inactive Users</span>
                </div>
                <p className="text-sm text-red-700 font-medium leading-relaxed">
                  {activitySummary.inactive} freelancers haven't been active in over 90 days.
                </p>
              </div>
              
              <div className="relative overflow-hidden p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-yellow-900 text-lg">Re-engagement Needed</span>
                </div>
                <p className="text-sm text-yellow-700 font-medium leading-relaxed">
                  Consider sending re-engagement emails to inactive freelancers below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inactive Freelancers Table with Modern Design */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
        <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <UserX className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Inactive Freelancers ({inactiveFreelancers.length})
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Freelancers who haven't been active for more than 90 days
                </p>
              </div>
            </div>
            {selectedFreelancers.length > 0 && (
              <button
                onClick={handleSendEmails}
                disabled={sendingEmails}
                className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold hover:scale-105 disabled:hover:scale-100"
              >
                <Mail className="w-5 h-5" />
                {sendingEmails ? 'Sending...' : `Send Email (${selectedFreelancers.length})`}
              </button>
            )}
          </div>
          
          {inactiveFreelancers.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20"></div>
                <UserCheck className="relative w-20 h-20 text-green-500 mx-auto mb-4" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                🎉 Great! All freelancers are active.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedFreelancers.length === inactiveFreelancers.length}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-4 focus:ring-indigo-100 cursor-pointer transition-all"
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>Skill</th>
                    <th>Last Active</th>
                    <th>Days Inactive</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveFreelancers.map((freelancer, index) => (
                    <tr key={freelancer.id} className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-colors duration-200" style={{animationDelay: `${index * 50}ms`}}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedFreelancers.includes(freelancer.id)}
                          onChange={() => handleSelectFreelancer(freelancer.id)}
                          className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-4 focus:ring-indigo-100 cursor-pointer transition-all"
                        />
                      </td>
                      <td className="font-semibold text-gray-900">{freelancer.name}</td>
                      <td className="text-gray-600">{freelancer.email}</td>
                      <td className="font-medium text-gray-700">{freelancer.country}</td>
                      <td>
                        <span className="badge badge-warning">{freelancer.skill}</span>
                      </td>
                      <td className="text-gray-600">{new Date(freelancer.lastActive).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-danger">
                          {freelancer.daysInactive} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
