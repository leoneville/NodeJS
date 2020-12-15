const express = require('express');

const server = express();

server.use(express.json());

var count = 0;
const projects = [];

function checkIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(where => where.id == id);
  
  if (!project) {
    return res.status(400).json({ error: "Nonexistent project !!" })
  }

  return next();
}



server.use((req, res, next) => {
  count += 1;
  if (count == 1) {
    console.log(`Foi feita ${count} requisição`)
  } else {
    console.log(`Foram feitas ${count} requisições`);
  }
  
  next();
})



server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  project = {
    id,
    title,
    tasks: []
  };

  req.title = title;

  projects.push(project);

  return res.json(projects);
});



server.post('/projects/:id/tasks', checkIdExists, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(where => where.id == id);

  project.tasks.push(title);
  
  return res.json(projects);

});



server.get('/projects', (req, res) => {
  
  return res.json(projects);
});



server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(where => where.id == id);
  project.title = title;

  return res.json(project)
});



server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const localIndex = projects.findIndex(where => where.id == id);

  projects.splice(localIndex, 1);

  return res.send();
});



server.listen(3000);