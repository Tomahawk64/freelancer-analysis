require('dotenv').config();
const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Freelancer = require('../src/models/Freelancer');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Predefined data for realistic distribution
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'India', 'Pakistan', 'Bangladesh', 'Philippines',
  'Ukraine', 'Poland', 'Brazil', 'Mexico', 'Spain',
  'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark'
];

const skills = [
  'Web Development', 'Mobile Development', 'UI/UX Design', 'Graphic Design',
  'Content Writing', 'SEO Marketing', 'Data Analysis', 'Machine Learning',
  'DevOps', 'Project Management', 'Video Editing', 'Animation',
  'Copywriting', 'Digital Marketing', 'Cloud Architecture'
];

const genders = ['Male', 'Female', 'Other'];

/**
 * Generate random date within last N days
 */
const getRandomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

/**
 * Generate a single freelancer with realistic data
 */
const generateFreelancer = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  
  // Create mix of active (30%) and inactive (70%) freelancers for demo
  const isActive = Math.random() > 0.7;
  const lastActive = isActive 
    ? getRandomDate(90)  // Active: within last 90 days
    : getRandomDate(365); // Inactive: can be up to 1 year
  
  return {
    name,
    email,
    country: faker.helpers.arrayElement(countries),
    skill: faker.helpers.arrayElement(skills),
    gender: faker.helpers.arrayElement(genders),
    age: faker.number.int({ min: 22, max: 55 }),
    projectsWorked: faker.number.int({ min: 0, max: 100 }),
    rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    lastActive
  };
};

/**
 * Seed database with demo freelancers
 */
const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seed...\n');
    
    // Clear existing data
    const existingCount = await Freelancer.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing freelancers`);
      console.log('🗑️  Clearing existing data...');
      await Freelancer.deleteMany({});
      console.log('✅ Existing data cleared\n');
    }
    
    // Generate freelancers
    const freelancersToCreate = 50;
    console.log(`📝 Generating ${freelancersToCreate} demo freelancers...\n`);
    
    const freelancers = [];
    for (let i = 0; i < freelancersToCreate; i++) {
      freelancers.push(generateFreelancer());
    }
    
    // Insert into database
    const insertedFreelancers = await Freelancer.insertMany(freelancers);
    
    console.log(`✅ Successfully created ${insertedFreelancers.length} freelancers\n`);
    
    // Display statistics
    const totalCount = await Freelancer.countDocuments();
    const activeCount = insertedFreelancers.filter(f => {
      const daysInactive = Math.ceil((Date.now() - new Date(f.lastActive)) / (1000 * 60 * 60 * 24));
      return daysInactive <= 90;
    }).length;
    const inactiveCount = totalCount - activeCount;
    
    // Skill distribution
    const skillCounts = {};
    insertedFreelancers.forEach(f => {
      skillCounts[f.skill] = (skillCounts[f.skill] || 0) + 1;
    });
    
    // Country distribution
    const countryCounts = {};
    insertedFreelancers.forEach(f => {
      countryCounts[f.country] = (countryCounts[f.country] || 0) + 1;
    });
    
    console.log('📊 ========================================');
    console.log('SEED SUMMARY');
    console.log('========================================');
    console.log(`Total Freelancers: ${totalCount}`);
    console.log(`Active (≤90 days): ${activeCount} (${((activeCount/totalCount)*100).toFixed(1)}%)`);
    console.log(`Inactive (>90 days): ${inactiveCount} (${((inactiveCount/totalCount)*100).toFixed(1)}%)`);
    console.log('\n📍 Top 5 Countries:');
    Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([country, count]) => {
        console.log(`   ${country}: ${count}`);
      });
    console.log('\n💼 Top 5 Skills:');
    Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([skill, count]) => {
        console.log(`   ${skill}: ${count}`);
      });
    console.log('========================================\n');
    
    console.log('🎉 Database seeding completed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(() => {
  seedDatabase();
});
