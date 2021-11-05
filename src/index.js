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

function getBalance(statement) {

  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + Number(operation.amount);
    } else {
      return acc - Number(operation.amount);
    }
  }, 0);

  return balance;
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

app.post('/deposit', verifyIfCpfExists, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  customer.statement.push({
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  });

  return res.status(201).json({
    message: "Deposit was performed successfully!"
  })

});

app.post('/withdraw', verifyIfCpfExists, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) return res.status(400).json({ error: "Insufficient funds" })

  return res.status(200).json({ message: "Withdraw was performed successfully!" });

});

app.get('/statement/date', verifyIfCpfExists, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement) =>
    statement.created_at.toDateString() === new Date(dateFormat).toDateString());

  return res.status(200).json(statement);
});

app.put('/account', verifyIfCpfExists, (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return res.json({ message: "Update was performed successfully!" });
});

app.get('/account', verifyIfCpfExists, (req, res) => {
  const { customer } = req;

  return res.json(customer);
});

app.delete('/account', verifyIfCpfExists, (req, res) => {
  const { customer } = req;

  customers.splice(customer, 1);

  return res.status(200).json(customers);
});

app.listen(3333, () => console.log("Server is running!"));