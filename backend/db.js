const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'yash',
})
   pool.connect((err) => {
    if (err) {
     console.error('connection error', err.stack)
    }else{
     console.log('connected')}
    })

   module.exports = pool