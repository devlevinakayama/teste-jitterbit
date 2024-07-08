require("dotenv").config();
const express = require('express')
const app = express()
const port = 3000
const orders = require('./controllers/orders')

app.use(express.json());
app.use('/orders', orders);

app.listen(port, async () => {
  console.log(`Start app listening on port ${port}`)
})