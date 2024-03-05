const { Pool } = require('pg');

const connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`;

const pool = new Pool({
    connectionString: connectionString,
})
pool.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected')
    }
})

module.exports = pool