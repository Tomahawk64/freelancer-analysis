const Freelancer = require('../models/Freelancer');
const {
  calculateDaysInactive,
  calculatePerformanceIndex,
  getSkillDistributionByCountry,
  getInactiveFreelancers,
  getActivitySummary
} = require('../utils/analytics');

/**
 * @desc    Get all freelancers
 * @route   GET /api/freelancers
 * @access  Public
 */
exports.getAllFreelancers = async (req, res) => {
  try {
    const { country, skill, active, search, page = 1, limit = 50 } = req.query;
    
    // Build query
    const query = {};
    
    if (country) query.country = country;
    if (skill) query.skill = skill;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query
    const freelancers = await Freelancer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastActive: -1 })
      .exec();
    
    const count = await Freelancer.countDocuments(query);
    
    // Filter by active status if specified
    let filteredFreelancers = freelancers;
    if (active !== undefined) {
      const isActive = active === 'true';
      filteredFreelancers = freelancers.filter((f) => {
        const daysInactive = calculateDaysInactive(f.lastActive);
        return isActive ? daysInactive <= 90 : daysInactive > 90;
      });
    }
    
    // Add computed fields
    const freelancersWithMetrics = filteredFreelancers.map((f) => {
      const daysInactive = calculateDaysInactive(f.lastActive);
      return {
        ...f.toObject(),
        daysInactive,
        isActive: daysInactive <= 90
      };
    });
    
    res.status(200).json({
      success: true,
      count: filteredFreelancers.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: freelancersWithMetrics
    });
  } catch (error) {
    console.error('Error in getAllFreelancers:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get single freelancer by ID
 * @route   GET /api/freelancers/:id
 * @access  Public
 */
exports.getFreelancerById = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer not found'
      });
    }
    
    const daysInactive = calculateDaysInactive(freelancer.lastActive);
    const freelancersAll = await Freelancer.find();
    const maxProjects = Math.max(...freelancersAll.map(f => f.projectsWorked));
    const performanceIndex = calculatePerformanceIndex(freelancer, maxProjects);
    
    res.status(200).json({
      success: true,
      data: {
        ...freelancer.toObject(),
        daysInactive,
        isActive: daysInactive <= 90,
        performanceIndex
      }
    });
  } catch (error) {
    console.error('Error in getFreelancerById:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Create new freelancer
 * @route   POST /api/freelancers
 * @access  Public
 */
exports.createFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Freelancer created successfully',
      data: freelancer
    });
  } catch (error) {
    console.error('Error in createFreelancer:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Update freelancer
 * @route   PUT /api/freelancers/:id
 * @access  Public
 */
exports.updateFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Freelancer updated successfully',
      data: freelancer
    });
  } catch (error) {
    console.error('Error in updateFreelancer:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete freelancer
 * @route   DELETE /api/freelancers/:id
 * @access  Public
 */
exports.deleteFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
    
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Freelancer deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteFreelancer:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get analytics data
 * @route   GET /api/freelancers/analytics
 * @access  Public
 */
exports.getAnalytics = async (req, res) => {
  try {
    // Fetch all freelancers
    const freelancers = await Freelancer.find();
    
    if (freelancers.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No freelancers found. Please seed the database.',
        data: {
          activitySummary: { total: 0, active: 0, inactive: 0, activePercentage: 0, inactivePercentage: 0 },
          skillDistribution: {},
          performanceMetrics: []
        }
      });
    }
    
    // Calculate max projects for normalization
    const maxProjects = Math.max(...freelancers.map(f => f.projectsWorked));
    
    // Get activity summary
    const activitySummary = getActivitySummary(freelancers);
    
    // Get skill distribution by country
    const skillDistribution = getSkillDistributionByCountry(freelancers);
    
    // Calculate performance index for all freelancers
    const performanceMetrics = freelancers.map((f) => {
      const daysInactive = calculateDaysInactive(f.lastActive);
      const performanceIndex = calculatePerformanceIndex(f, maxProjects);
      
      return {
        id: f._id,
        name: f.name,
        country: f.country,
        skill: f.skill,
        rating: f.rating,
        projectsWorked: f.projectsWorked,
        lastActive: f.lastActive,
        daysInactive,
        isActive: daysInactive <= 90,
        performanceIndex
      };
    });
    
    // Sort by performance index
    performanceMetrics.sort((a, b) => b.performanceIndex - a.performanceIndex);
    
    // Get inactive freelancers
    const inactiveFreelancers = getInactiveFreelancers(freelancers).map((f) => ({
      id: f._id,
      name: f.name,
      email: f.email,
      country: f.country,
      skill: f.skill,
      lastActive: f.lastActive,
      daysInactive: calculateDaysInactive(f.lastActive)
    }));
    
    res.status(200).json({
      success: true,
      data: {
        activitySummary,
        skillDistribution,
        performanceMetrics,
        inactiveFreelancers,
        topPerformers: performanceMetrics.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Send re-engagement emails to inactive freelancers
 * @route   POST /api/freelancers/reactivate
 * @access  Public
 */
exports.reactivateFreelancers = async (req, res) => {
  try {
    const { freelancerIds } = req.body;
    
    if (!freelancerIds || !Array.isArray(freelancerIds) || freelancerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of freelancer IDs'
      });
    }
    
    // Fetch freelancers
    const freelancers = await Freelancer.find({ _id: { $in: freelancerIds } });
    
    if (freelancers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No freelancers found with provided IDs'
      });
    }
    
    // Mock EmailJS integration
    // In production, this would call EmailJS API
    const emailResults = freelancers.map((f) => ({
      freelancerId: f._id,
      name: f.name,
      email: f.email,
      status: 'sent',
      message: `Re-engagement email sent to ${f.email}`,
      timestamp: new Date()
    }));
    
    console.log('📧 Mock Email Sent:', emailResults);
    
    res.status(200).json({
      success: true,
      message: `Successfully sent ${emailResults.length} re-engagement email(s)`,
      data: {
        emailsSent: emailResults.length,
        results: emailResults,
        note: 'This is a mock implementation. Configure EmailJS credentials in .env for real emails.'
      }
    });
  } catch (error) {
    console.error('Error in reactivateFreelancers:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get unique countries
 * @route   GET /api/freelancers/filters/countries
 * @access  Public
 */
exports.getCountries = async (req, res) => {
  try {
    const countries = await Freelancer.distinct('country');
    res.status(200).json({
      success: true,
      data: countries.sort()
    });
  } catch (error) {
    console.error('Error in getCountries:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get unique skills
 * @route   GET /api/freelancers/filters/skills
 * @access  Public
 */
exports.getSkills = async (req, res) => {
  try {
    const skills = await Freelancer.distinct('skill');
    res.status(200).json({
      success: true,
      data: skills.sort()
    });
  } catch (error) {
    console.error('Error in getSkills:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
