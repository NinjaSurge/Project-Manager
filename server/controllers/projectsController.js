const path = require('path');
const pmfs = require('../utils/projectManagerFileSystem');

const projects_dir = __dirname + '/../../Projects';

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
  try {
    const data = pmfs.getProject(projects_dir, id);
    res.status(200).json(data);
  } catch (err) {
    throw Error(err);
  }
};

const getProjectFile = (req, res) => {
  console.log('====getProjectFile(pc)====');
  const { id, filePath } = req.params;
  if (!filePath) {
    res.status(400).json({ error: 'Must send a filePath in the body' });
    throw new Error('No filePath Specified');
  }
  try {
    if (decodeURIComponent(filePath).includes('../')) {
      res.status(401).json({ error: 'You sneaky hacker, you ;P' });
    }
    const data = pmfs.getProjectFile(
      projects_dir,
      id,
      decodeURIComponent(filePath)
    );
    res.status(200).sendFile(data, { root: projects_dir });
  } catch (err) {
    res.status(500).send('There was an error grabbing the file');
    throw Error(err);
  }
};

const editProject = (req, res) => {
  const data = req.body;
  const { id } = req.params;
  try {
    const project = pmfs.editProject(projects_dir, id, data);
    console.log(project);
    res.status(200).json(project);
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

module.exports = {
  getProjects,
  getProject,
  getProjectFile,
  editProject,
  createProject,
  deleteProject,
};
