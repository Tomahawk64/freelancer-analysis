const mongoose = require('mongoose');

/**
 * Freelancer Schema
 * Stores freelancer information including performance metrics
 */
const freelancerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    skill: {
      type: String,
      required: [true, 'Skill is required'],
      trim: true
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other']
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Age must be at least 18'],
      max: [100, 'Age cannot exceed 100']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    projectsWorked: {
      type: Number,
      required: [true, 'Projects worked is required'],
      min: [0, 'Projects worked cannot be negative'],
      default: 0
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      default: 3
    },
    lastActive: {
      type: Date,
      required: [true, 'Last active date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for performance optimization
freelancerSchema.index({ email: 1 });
freelancerSchema.index({ country: 1, skill: 1 });
freelancerSchema.index({ lastActive: -1 });

/**
 * Virtual field: Days since last active
 */
freelancerSchema.virtual('daysInactive').get(function () {
  const today = new Date();
  const lastActive = new Date(this.lastActive);
  const diffTime = Math.abs(today - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

/**
 * Virtual field: Activity status
 */
freelancerSchema.virtual('isActive').get(function () {
  return this.daysInactive <= 90;
});

/**
 * Instance method: Calculate performance index
 * Formula: 0.6 * (rating/5) + 0.3 * recencyScore + 0.1 * normalizedProjects
 */
freelancerSchema.methods.calculatePerformanceIndex = function (maxProjects = 100) {
  const normalizedRating = this.rating / 5;
  const recencyScore = 1 / (1 + this.daysInactive);
  const normalizedProjects = this.projectsWorked / maxProjects;
  
  const performanceIndex = 
    0.6 * normalizedRating +
    0.3 * recencyScore +
    0.1 * normalizedProjects;
  
  return parseFloat(performanceIndex.toFixed(4));
};

/**
 * Static method: Get analytics summary
 */
freelancerSchema.statics.getAnalyticsSummary = async function () {
  const allFreelancers = await this.find();
  
  const active = allFreelancers.filter(f => {
    const daysInactive = Math.ceil(
      (Date.now() - new Date(f.lastActive)) / (1000 * 60 * 60 * 24)
    );
    return daysInactive <= 90;
  }).length;
  
  const inactive = allFreelancers.length - active;
  
  return {
    total: allFreelancers.length,
    active,
    inactive,
    activePercentage: allFreelancers.length > 0 
      ? ((active / allFreelancers.length) * 100).toFixed(2) 
      : 0
  };
};

module.exports = mongoose.model('Freelancer', freelancerSchema);
