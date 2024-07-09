require("dotenv").config();
const express = require('express')
const app = express()
const port = 3000

//configurando o express para receber json
app.use(express.json());

//configurando o express para receber urlencoded
app.use(express.urlencoded({ extended: true }));

//rotas
app.use('/auth', require('./controllers/auth'));
app.use('/orders', require('./controllers/orders'));

//iniciando o servidor
app.listen(port, async () => {
  console.log(`Start app listening on port ${port}`)
})