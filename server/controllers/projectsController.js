const fs = require('fs');
const pmfs = require('../utils/projectManagerFileSystem');

const projects_dir = '../Projects';

const getProjects = (req, res) => {
  const data = pmfs.getProjects(projects_dir);

  if (data.length == 0) {
    res.status(200).json({ text: 'There are no projects in the directory' });
  } else {
    res.status(200).json(data);
  }
};

const getProject = (req, res) => {
  const { id } = req.params;
  console.log('ping');
  try {
    const data = pmfs.getProject(projects_dir, id);
    res.status(200).json(data);
  } catch (err) {
    throw Error(err);
  }
};

const createProject = (req, res) => {
  const data = req.body;
  const project = pmfs.makeProject(projects_dir, data);
  console.log(project);
  res.status(200).json(project);
};

const deleteProject = (req, res) => {
  const { id } = req.params;
  const project = pmfs.deleteProject(projects_dir, id);
  res.status(200).json(project);
};

module.exports = { getProjects, getProject, createProject, deleteProject };
