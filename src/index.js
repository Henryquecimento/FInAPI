const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());


/* Middleware */

function verifyIfCpfExists(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find(customer => customer.cpf === cpf);

  if (!customer) return res.status(400).json({
    error: 'Customer not found!'
  });

  req.customer = customer;

  next();
}

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

app.get('/statement', verifyIfCpfExists, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);

});

app.listen(3333, () => console.log("Server is running!"));