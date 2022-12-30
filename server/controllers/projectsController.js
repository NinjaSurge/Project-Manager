const path = require('path');
const pmfs = require('../utils/projectManagerFileSystem');

const projects_dir = __dirname + '/../../Projects';

const required_fields = ['name', 'readme'];

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

  // Checking for required fields
  let empty_fields = [];
  for (const field in required_fields) {
    if (data[required_fields[field]] === undefined)
      empty_fields.push(required_fields[field]);
  }

  // Aditional field checks
  let invalid_fields = [];
  if (data.name === '') invalid_fields.push('name must not be empty');

  if (empty_fields.length != 0) {
    res
      .status(400)
      .json({ error: 'Must fill out all fields', fields: empty_fields });
    return;
  } else if (invalid_fields.length != 0) {
    res
      .status(400)
      .json({ error: 'Some fields are invalid', fields: invalid_fields });
  } else {
    try {
      const project = pmfs.editProject(projects_dir, id, data);
      res.status(200).json(project);
    } catch (err) {
      throw Error(err);
    }
  }
};

const createProject = (req, res) => {
  const data = req.body;

  // Checking for required fields
  let empty_fields = [];
  for (const field in required_fields) {
    if (data[required_fields[field]] === undefined)
      empty_fields.push({
        field_name: required_fields[field],
        description: 'Must be filled out',
      });
  }

  // Aditional field checks
  let invalid_fields = [];
  if (data.name === '')
    invalid_fields.push({
      field_name: 'name',
      description: 'name must not be empty',
    });

  if (empty_fields.length != 0) {
    res
      .status(400)
      .json({
        error: 'ALL Required fields must be filled out.',
        fields: empty_fields,
      });
    return;
  } else if (invalid_fields.length != 0) {
    res
      .status(400)
      .json({ error: 'Some fields are invalid', fields: invalid_fields });
  } else {
    const project = pmfs.makeProject(projects_dir, data);
    res.status(200).json(project);
  }
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
