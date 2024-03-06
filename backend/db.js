const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'yash',
});

pool.connect((err) => {
    if (err) {
        
        throw new Error('Failed to connect to PostgreSQL database: ' + err.message);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

module.exports = pool;
