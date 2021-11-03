const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

app.post('/account', (req, res) => {
  const { cpf, name } = req.body;

  const userAlreadyExists = customers.some((customer) => customer.cpf === cpf);

  if (userAlreadyExists) return res.status(400).send('User already exists!');

  customers.push({
    id: uuid(),
    cpf,
    name,
    statement: []
  });

  return res.status(201).send('Customer was successfully created!');

});


app.listen(3333, () => console.log("Server is running!"));