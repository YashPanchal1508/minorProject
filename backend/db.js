const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
})
   pool.connect((err) => {
    if (err) {
     console.error('connection error', err.stack)
    }else{
     console.log('connected')}
    })

   module.exports = pool