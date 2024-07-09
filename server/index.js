require("dotenv").config();
const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000;
const Database = require('./db');
const db = new Database();

//configurando o express para receber json
app.use(express.json());

//configurando o express para receber urlencoded
app.use(express.urlencoded({ extended: true }));

//rotas
app.use('/auth', require('./controllers/auth'));
app.use('/orders', require('./controllers/orders'));

//iniciando o servidor
app.listen(port, async () => {
  // verificando se o arquivo install existe para poder instalar o banco de dados
  const path = './cache/install';

  if (!fs.existsSync(path)) {
    try {
      const installSQL = fs.readFileSync('install.sql', 'utf8');
      const conn = await db.getInstance();
      await conn.query(installSQL);
      fs.writeFileSync(path, 'OK');
      console.log('Installation completed successfully.');
    } catch (err) {
      console.error('Error reading or processing install.sql file:', err);
    }
  }
  console.log(`Start app listening on port ${port}`)
})