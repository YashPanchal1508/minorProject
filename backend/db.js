const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
});

pool.connect((err) => {
    if (err) {
        
        throw new Error('Failed to connect to PostgreSQL database: ' + err.message);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

module.exports = pool;
