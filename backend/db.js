const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

pool.connect((err) => {
    if (err) {
        
        throw new Error('Failed to connect to PostgreSQL database: ' + err.message);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

module.exports = pool;
