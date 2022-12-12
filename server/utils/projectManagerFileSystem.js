const { v4: uuidv4, validate } = require('uuid');
const fs = require('fs');

let projectsList = [];

/**
 * @description Checks if the project directory exists
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 */
const checkFS = (project_directory) => {
  try {
    fs.existsSync(project_directory);
  } catch (err) {
    console.error(err);
    throw new Error('No Projects Directory Detected');
  }
};

/**
 * @description Adds all project config files it finds in the project_directory to a local list
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 */
const listProjects = (project_directory) => {
  checkFS(project_directory);
  projectsList = [];
  const folders = fs.readdirSync(project_directory);
  for (i = 0; i < folders.length; i++) {
    try {
      if (!fs.existsSync(`${project_directory}/${folders[i]}/.pm.json`))
        continue;
      const data = fs.readFileSync(
        `${project_directory}/${folders[i]}/.pm.json`
      );
      const project = JSON.parse(data);
      projectsList.push(project);
    } catch (err) {
      throw new Error(`Error reading file from disk: ${err}`);
    }
  }
};

/**
 * @description returns an array of all project configs in the project_dir
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 * @return {*} [ ...projectsList ]
 */
const getProjects = (project_directory) => {
  try {
    checkFS(project_directory);

    listProjects(project_directory);

    return projectsList;
  } catch (err) {
    console.error(err);
    throw new Error('There was a problem reading the Project Directory');
  }
};

/**
 * @description Returns the project config file
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 * @param {*} id - The id of the project to be returned
 * @return {*}
 */
const getProject = (project_directory, id) => {
  checkFS(project_directory);
  listProjects(project_directory);

  let project = null;

  if (!validate(id)) throw new Error('Unable to validate id');
  projectsList.forEach((p) => {
    if (p._id === id) {
      return (project = p);
    }
  });
  return project;
};

/**
 * @description changes project information
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 * @param {*} id - The id of the project to change
 * @param {*} project_info - The information needed to change the project
 * @return {*}
 */
const editProject = (project_directory, id, project_info) => {
  // Checks for project folder
  checkFS(project_directory);

  let project = getProject(project_directory, id);

  // Create the folder structure and config file
  const dir = `${project_directory}/${project.name}`;
  if (!fs.existsSync(dir)) return { error: "Folder or Project Doesn't Exist" };
  try {
    fs.writeFileSync(`${dir}/.pm.json`, JSON.stringify(project_info), 'utf8');
    fs.renameSync(dir, `${project_directory}/${project_info.name}`);
  } catch (err) {
    throw new Error('[pmfs]: ' + err);
  }
  project = getProject(project_directory, id);
  // Return the edited Project
  return project;
};

/**
 * @description Handles the creation of a new project directory/config file
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 * @param {*} project_info - The name of the project (Other information in the future)
 * @return {*}
 */
const makeProject = (project_directory, project_info) => {
  // Checks for project folder
  checkFS(project_directory);

  // Handle incoming project information
  const uuid = uuidv4();
  const info = {
    name: project_info.name,
    _id: uuid,
  };

  // Create the folder structure and config file
  const dir = `${project_directory}/${project_info.name}`;
  if (fs.existsSync(dir)) return { error: 'Folder or Project Already Exists' };

  try {
    fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/.pm.json`, JSON.stringify(info), 'utf8');
  } catch (err) {
    throw new Error('[pmfs]: ' + err);
  }

  // Return the created Project
  return getProject(project_directory, uuid);
};

/**
 * @description deletes project (directory and contents) from disk
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 * @param {*} id - The id of the project to be deleted
 * @return {*} - a list of the remaining projects
 */
const deleteProject = (project_directory, id) => {
  // Directory Check
  checkFS(project_directory);
  if (!validate(id)) throw new Error('Unable to validate id');

  // retrieves project information
  listProjects(project_directory);
  const project = getProject(project_directory, id);

  // deletes files on disk
  try {
    fs.rmSync(`${project_directory}/${project.name}`, {
      recursive: true,
      force: true,
    });
  } catch (er) {
    throw new Error(er);
  }
  // update projectList
  listProjects(project_directory);
  // Returns a list of the remaining projects
  return getProjects(project_directory);
};

module.exports = {
  getProjects,
  getProject,
  editProject,
  makeProject,
  deleteProject,
};
