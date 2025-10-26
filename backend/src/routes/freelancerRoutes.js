const express = require('express');
const router = express.Router();
const {
  getAllFreelancers,
  getFreelancerById,
  createFreelancer,
  updateFreelancer,
  deleteFreelancer,
  getAnalytics,
  reactivateFreelancers,
  getCountries,
  getSkills
} = require('../controllers/freelancerController');

// Analytics routes (must be before :id routes)
router.get('/analytics', getAnalytics);
router.post('/reactivate', reactivateFreelancers);

// Filter routes
router.get('/filters/countries', getCountries);
router.get('/filters/skills', getSkills);

// CRUD routes
router.route('/')
  .get(getAllFreelancers)
  .post(createFreelancer);

router.route('/:id')
  .get(getFreelancerById)
  .put(updateFreelancer)
  .delete(deleteFreelancer);

module.exports = router;
