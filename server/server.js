const express = require('express');
const fs = require('fs');

const projects_dir = '../Projects';

fs.access(projects_dir, (e) => {
  if (e) {
    fs.mkdir(projects_dir, (e) => {
      if (e) {
        console.log(e);
      } else {
        console.log('New Directory Created');
      }
    });
  } else {
    console.log('Directory Exists');
  }
});

const data = fs.readdirSync(projects_dir);

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.get('*', (req, res) => {
  res.json(data);
});

app.listen(3000);
