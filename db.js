/**
 * Classe responsável por criar a conexão com o banco de dados PostgreSQL
 * 
 * @version 1.0.0
 */
class Database {
    constructor(){
        this.pool = null;
    }
    async getInstance(){
        if(this.pool !== null){
            console.log('utilizou a o pool já criado');
            return this.pool.connect();
        }
     
        console.log(process.env.CONNECTION_STRING);
        const { Pool } = require('pg');
        this.pool = new Pool({
            connectionString: process.env.CONNECTION_STRING
        });
     
        const client = await this.pool.connect();
        console.log("Iniciou PostgreSQL!");
     
        const res = await client.query('SELECT NOW()');
        console.log(res.rows[0]);
        client.release();
     
        return this.pool.connect();
    }
}

module.exports = Database;