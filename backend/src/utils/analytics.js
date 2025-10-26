/**
 * Analytics Utility Functions
 * Contains all calculation logic for freelancer performance metrics
 */

/**
 * Calculate days inactive for a freelancer
 * @param {Date} lastActive - Last active date
 * @returns {number} Days since last active
 */
const calculateDaysInactive = (lastActive) => {
  const today = new Date();
  const lastActiveDate = new Date(lastActive);
  const diffTime = Math.abs(today - lastActiveDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculate normalized rating (0-1 scale)
 * @param {number} rating - Rating value (1-5)
 * @returns {number} Normalized rating
 */
const normalizeRating = (rating) => {
  return rating / 5;
};

/**
 * Calculate recency score based on days inactive
 * @param {number} daysInactive - Days since last active
 * @returns {number} Recency score (0-1)
 */
const calculateRecencyScore = (daysInactive) => {
  return 1 / (1 + daysInactive);
};

/**
 * Calculate normalized projects
 * @param {number} projectsWorked - Number of projects worked
 * @param {number} maxProjects - Maximum projects in dataset
 * @returns {number} Normalized projects (0-1)
 */
const normalizeProjects = (projectsWorked, maxProjects) => {
  if (maxProjects === 0) return 0;
  return projectsWorked / maxProjects;
};

/**
 * Calculate Performance Index
 * Formula: 0.6 * normalizedRating + 0.3 * recencyScore + 0.1 * normalizedProjects
 * @param {Object} freelancer - Freelancer object
 * @param {number} maxProjects - Maximum projects in dataset
 * @returns {number} Performance index
 */
const calculatePerformanceIndex = (freelancer, maxProjects) => {
  const daysInactive = calculateDaysInactive(freelancer.lastActive);
  const normalizedRating = normalizeRating(freelancer.rating);
  const recencyScore = calculateRecencyScore(daysInactive);
  const normalizedProjectsValue = normalizeProjects(freelancer.projectsWorked, maxProjects);
  
  const performanceIndex = 
    0.6 * normalizedRating +
    0.3 * recencyScore +
    0.1 * normalizedProjectsValue;
  
  return parseFloat(performanceIndex.toFixed(4));
};

/**
 * Determine if freelancer is active (within 90 days)
 * @param {Date} lastActive - Last active date
 * @returns {boolean} Active status
 */
const isActiveFreelancer = (lastActive) => {
  const daysInactive = calculateDaysInactive(lastActive);
  return daysInactive <= 90;
};

/**
 * Get skill distribution by country
 * @param {Array} freelancers - Array of freelancer objects
 * @returns {Object} Skill distribution grouped by country
 */
const getSkillDistributionByCountry = (freelancers) => {
  const distribution = {};
  
  freelancers.forEach((freelancer) => {
    const { country, skill } = freelancer;
    
    if (!distribution[country]) {
      distribution[country] = {};
    }
    
    if (!distribution[country][skill]) {
      distribution[country][skill] = 0;
    }
    
    distribution[country][skill]++;
  });
  
  return distribution;
};

/**
 * Get top performers by performance index
 * @param {Array} freelancers - Array of freelancer objects with performance index
 * @param {number} limit - Number of top performers to return
 * @returns {Array} Top performers
 */
const getTopPerformers = (freelancers, limit = 10) => {
  return freelancers
    .sort((a, b) => b.performanceIndex - a.performanceIndex)
    .slice(0, limit);
};

/**
 * Get inactive freelancers (>90 days)
 * @param {Array} freelancers - Array of freelancer objects
 * @returns {Array} Inactive freelancers
 */
const getInactiveFreelancers = (freelancers) => {
  return freelancers.filter((freelancer) => {
    const daysInactive = calculateDaysInactive(freelancer.lastActive);
    return daysInactive > 90;
  });
};

/**
 * Get activity summary statistics
 * @param {Array} freelancers - Array of freelancer objects
 * @returns {Object} Activity summary
 */
const getActivitySummary = (freelancers) => {
  const active = freelancers.filter((f) => isActiveFreelancer(f.lastActive)).length;
  const inactive = freelancers.length - active;
  
  return {
    total: freelancers.length,
    active,
    inactive,
    activePercentage: freelancers.length > 0 
      ? parseFloat(((active / freelancers.length) * 100).toFixed(2))
      : 0,
    inactivePercentage: freelancers.length > 0
      ? parseFloat(((inactive / freelancers.length) * 100).toFixed(2))
      : 0
  };
};

module.exports = {
  calculateDaysInactive,
  normalizeRating,
  calculateRecencyScore,
  normalizeProjects,
  calculatePerformanceIndex,
  isActiveFreelancer,
  getSkillDistributionByCountry,
  getTopPerformers,
  getInactiveFreelancers,
  getActivitySummary
};
