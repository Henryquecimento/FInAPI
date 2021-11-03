const express = require('express');
const { v4: uuid } = require('uuid');

const customers = [];

const app = express();

app.use(express.json());

app.post('/account', (req, res) => {
  const { cpf, name } = req.body;

  const id = uuid();

  customers.push({
    id,
    cpf,
    name,
    statement: []
  });

  return res.status(201).send('Customer was successfully created!');

});


app.listen(3333, () => console.log("Server is running!"));