const express = require('express')
const pool = require('../db')
const router = express.Router();

router.post('/:tableName', async (req, res) => {

  const { tableName } = req.params;
  const { page, limit, sortOrder, sortBy } = req.body
  console.log(tableName, page, limit, sortOrder, sortBy)

  // console.log(page, limit, sortOrder, sortBy,tableName )

  const totalCountQuery = `SELECT COUNT(*) FROM ${tableName} where isdeleted = false`;
  const total = await pool.query(totalCountQuery);
  const totalCount = total.rows[0].count;

  //   const query = `
  //   SELECT * FROM ${tableName}
  //   where isdeleted = false
  //   ORDER BY ${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
  //   LIMIT $1 OFFSET $2
  // `;
  let query;
  if (tableName === 'country') {
    query = `
    SELECT * FROM country
      where isdeleted = false
      ORDER BY ${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
      LIMIT $1 OFFSET $2
    `
  }
  else if (tableName === 'state') {
    query = `
    SELECT state.*, country.countryname
    FROM state 
    JOIN country  ON state.countryid = country.countryid
    WHERE state.isdeleted = false
    ORDER BY ${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
    LIMIT $1 OFFSET $2
    `;
  }
  else if(tableName ==='city'){
    query = `
    SELECT city.*, country.countryname, state.statename
    FROM city 
    JOIN country ON city.countryid = country.countryid
    JOIN state  ON city.stateid = state.stateid
    WHERE city.isdeleted = false
    ORDER BY ${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
    LIMIT $1 OFFSET $2
    `;
  }
  else {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  const result = await pool.query(query, [limit, (page - 1) * limit]);


  res.status(200).json({
    data: result.rows,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    }
  })

})

module.exports = router