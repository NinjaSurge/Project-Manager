const { v4: uuidv4, validate } = require('uuid');
const fs = require('fs');

/**
 * @description Checks if the project directory exists
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 */
const checkFS = (project_directory) => {
  try {
    fs.existsSync(project_directory);
  } catch (err) {
    throw new Error(`No Projects Directory Detected at ${project_directory}`);
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

  return projectsList;
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

    return listProjects(project_directory);
  } catch (err) {
    throw new Error(
      'There was a problem reading projects from the project directory'
    );
  }
};

/**
 * @description Returns the project config file
 * @author NinjaSurge
 * @param {String} project_directory - The directory containing all the projects
 * @param {String} id - The id of the project to be returned
 * @return {*} - returns the project object with a matching id
 */
const getProject = (project_directory, id) => {
  // Checks
  checkFS(project_directory);

  if (!validate(id)) throw new Error('Unable to validate project id');

  return listProjects(project_directory).find((p) => p._id === id);
};

/**
 * @description Returns a relative file location from the project directory
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 * @param {*} id - The id of the project to be returned
 * @param {String} filePath - The file path within the project directory to return
 * @return {*} File Data
 */
const getProjectFile = (project_directory, id, filePath) => {
  checkFS(project_directory);

  let projectFile = null;

  if (!validate(id)) throw new Error('Unable to validate id');
  listProjects(project_directory).forEach((p) => {
    if (p._id === id) {
      if (fs.existsSync(`${project_directory}/${p.name}/${filePath}`)) {
        return (projectFile = `/${p.name}/${filePath}`);
      } else {
        throw new Error('File does not exist');
      }
    }
  });
  return projectFile;
};

/**
 * @description Changes project information
 * @author NinjaSurge
 * @param {*} project_directory - The directory containing all the projects
 * @param {*} id - The id of the project to change
 * @param {*} project_info - The information needed to change the project
 * @return {*}
 */
const editProject = (project_directory, id, project_info) => {
  // Checks for project folder
  checkFS(project_directory);

  // Find Project
  let project = getProject(project_directory, id);

  //Compare and change information
  let data = getProject(project_directory, id);
  for (const project_key in project) {
    // if !=, !undefined, and !_id
    if (
      JSON.stringify(project[project_key]) !==
        JSON.stringify(project_info[project_key]) &&
      JSON.stringify(project_info[project_key]) !== undefined &&
      project_key !== '_id'
    ) {
      data[project_key] = project_info[project_key];
    }
  }

  // Rename
  const dir = `${project_directory}/${project.name}`;
  const new_dir = `${project_directory}/${project_info.name}`;
  if (!fs.existsSync(dir)) return { error: "Folder or Project Doesn't Exist" };
  try {
    fs.renameSync(dir, new_dir);
    fs.writeFileSync(`${new_dir}/.pm.json`, JSON.stringify(data), 'utf8');
  } catch (err) {
    throw new Error('Error moving files');
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
    project_info,
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
  getProjectFile,
  editProject,
  makeProject,
  deleteProject,
};
