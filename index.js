require("dotenv").config();
const express = require('express')
const app = express()
const port = 3000
const Database = require('./db')
const db = new Database();

app.get('/orders', (req, res) => {
  
})

app.listen(port, async () => {
  console.log(`Start app listening on port ${port}`)
})