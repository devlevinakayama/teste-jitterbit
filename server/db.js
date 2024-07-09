/**
 * Classe responsável por criar a conexão com o banco de dados PostgreSQL
 * 
 * @version 1.0.0
 */
class Database {
    /**
     * Construtor da classe
     */
    constructor(){
        this.pool = null;
    }

    /**
     * Método responsável por criar a conexão com o banco de dados, caso já existir uma conexão, a mesma é retornada
     * 
     * @returns {Promise} Retorna uma conexão com o banco de dados
     */
    async getInstance(){
        if(this.pool !== null) 
            return this.pool.connect();
     
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