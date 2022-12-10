const fs = require('fs');
const pmfs = require('../utils/pmfs');

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

const createProject = (req, res) => {};

module.exports = { getProjects, getProject, createProject };
