const e = require('express');
const fs = require('fs');

let projectsList = [];

console.error = (info) => {
  console.log(`\x1b[31m${info}\x1b[0m'`);
};

const checkFS = (projects_dir) => {
  fs.access(projects_dir, (e) => {
    if (e) {
      fs.mkdir(projects_dir, (er) => {
        if (er) {
          console.error(er);
          throw Error(`·There was an error with the project directory ${er}`);
        } else {
          console.log('New Directory Created');
          return 0;
        }
      });
    }
  });
};

const listProjects = (projects_dir) => {
  checkFS(projects_dir);
  const folders = fs.readdirSync(projects_dir);
  for (i = 0; i < folders.length; i++) {
    try {
      const data = fs.readFileSync(`${projects_dir}/${folders[i]}/.pm.json`);
      const project = JSON.parse(data);
      projectsList.push(project);
    } catch (err) {
      emsg = `Error reading file from disk: ${err}`;
      console.error(emsg);
      throw Error(emsg);
    }
  }
};

const getProjects = (projects_dir) => {
  checkFS(projects_dir);

  listProjects(projects_dir);

  return projectsList;
};

const getProject = (project_directory, id) => {
  checkFS(project_directory);
  listProjects(project_directory);

  let project = null;

  projectsList.forEach((project) => {
    console.log(project);
    if (project._id === id) {
      project = project;
    }
  });

  return project;
};

module.exports = {
  getProjects,
  getProject,
  // editProject
  // makeProject,
  // deleteProject
};
