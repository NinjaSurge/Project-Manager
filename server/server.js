const express = require('express');
const fs = require('fs');
const { globalWare } = require('./middleWare/middleware');
const projectRoutes = require('./routes/projects');

const settings = {
  PORT: 4000,
  projects_dir: '../Projects',
};

const app = express();

app.use(express.json());

app.use(globalWare);

app.use('/api/projects', projectRoutes);

// Catch All
app.get('*', (req, res) => {
  res.send('Not Found');
});

app.listen(settings.PORT, () => {
  console.log(`Starting Server on Port ${settings.PORT}`);
});
