require("dotenv").config();
const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', require('./controllers/auth'));
app.use('/orders', require('./controllers/orders'));

app.listen(port, async () => {
  console.log(`Start app listening on port ${port}`)
})