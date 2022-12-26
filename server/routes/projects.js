const express = require('express');
const {
  getProjects,
  getProject,
  getProjectFile,
  editProject,
  createProject,
  deleteProject,
} = require('../controllers/projectsController');

const router = express.Router();

// Get all Projects
router.get('/', getProjects);

// Get one project
router.get('/:id', getProject);

// Get one project file
router.get('/:id/:filePath', getProjectFile);

// Create a new Project
router.post('/', createProject);

// Update a Project
router.patch('/:id', editProject);

// Remove a Project
router.delete('/:id', deleteProject);

module.exports = router;
