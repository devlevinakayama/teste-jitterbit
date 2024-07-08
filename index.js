const express = require('express')
const app = express()
const port = 3000

app.get('/orders', (req, res) => {
  
})

app.listen(port, () => {
  console.log(`Start app listening on port ${port}`)
})