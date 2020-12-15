const express = require('express'); // 1º importo o modulo express

const server = express(); // 2º Crio uma variavel que ira receber a funcao express

server.use(express.json()); // Diz ao express que vai receber no formato json

// Query params = ?teste=1
// Route params = /users/1
// Request Body = { "name": "Leonardo Neville", "email": "leoneville_@hotmail.com" }

// CRUD - Create, Read, Update, Delete

const users = ['Gatsby', 'Durden', 'Tyler'];

server.use((req, res, next) => { //middleware global
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) { //middleware local
  console.log(req.body.name);
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required'});
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' })
  }

  req.user = user;
  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params; // Consome o route params
  //const nome = req.query.nome; // Consome os query params
  
  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;
  
  users.push(name);

  return res.json(users);
});

server.put('/users/:index',checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);

});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000); // 3º chamo o metodo listen para criar um localserver
                     // passando a porta que eu quero como parametro