const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
} = require('../controllers/projectsController');

const router = express.Router();

// Get all Projects
router.get('/', getProjects);

// Get one project
router.get('/:id', getProject);

// Create a new Project
router.post('/', createProject);

// Update a Project
router.patch('/:id');

// Remove a Project
router.delete('/:id');

module.exports = router;
