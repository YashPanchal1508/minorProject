const express = require('express')
const pool = require('../db');
const { escapeIdentifier } = require('pg');
const router = express.Router();


router.post('/getCountry', async (req, res) => {
  try {
    let { page, limit,sort,column } = req.body;

    // First query to get the total count
    const totalCountQuery = await pool.query('SELECT COUNT(*) FROM country WHERE isdeleted = false');
    const totalCount = totalCountQuery.rows[0].count;

    const offset = (page - 1) * limit
    let query;
    query = `SELECT * FROM country WHERE isdeleted = false `

    if(sort &&  column){
        query +=  ` ORDER BY ${column} ${sort === 'asc' ? "ASC" : "DESC"}`
    }

    query += ` LIMIT $1 OFFSET $2`
    // Second query to get paginated data
    const result = await pool.query(query, [limit, offset]
    );
    
    res.status(200).json({
      data: result.rows,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/createCountry', async (req, res) => {
  const { countryname, countrycode, phonecode } = req.body;

  if (!countryname || !countrycode || !phonecode) {
    return res.status(400).send("Missing fields");
  }

  try {
    // Check if country name already exists
    let result = await pool.query('SELECT * FROM country WHERE LOWER(countryname) = LOWER($1)', [countryname]);

    if (result.rowCount > 0) {
      const existingCountry = result.rows[0];
      if (existingCountry.isdeleted) {
        // Update existing country's isdeleted flag to false
        const updatedQuery = await pool.query('UPDATE country SET isdeleted = false WHERE countryname = $1', [countryname]);
        return res.status(200).json({ updateMessage: "Country Updated", rows: updatedQuery.rows });
      } else {
        return res.status(400).json({ error: 'Country already exists' });
      }
    } else {
      // Country name does not exist, proceed with insertion
      const finalResult = await pool.query('INSERT INTO country (countryname, countrycode, phonecode) VALUES (LOWER($1), LOWER($2), $3) RETURNING *', [countryname, countrycode, phonecode]);
      return res.status(200).json({ updateMessage: "Country Added", rows: finalResult.rows });
    }
  } catch (error) {
    console.error('Error creating/updating country:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.delete('/deleteCountry/:id', async(req,res) => {

    const id = req.params.id;
    try {

        const result = await pool.query('UPDATE country SET isdeleted = true WHERE countryid = $1 RETURNING *', [id])

        if(result.rowCount > 0){
            res.status(200).json({message : `country with ID ${id} deleted successfully.`, result: result.rows})
        }else{
            res.status(404).json({message: 'No user found'})
        }



    } catch (error) {
        console.log("error deleting user", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.put('/updateCountry', async(req,res) => {

    const {countryName, countryCode, phoneCode, id} = req.body;


    try {
        const result = await pool.query(
          'UPDATE country SET countryname = LOWER($1), countrycode = LOWER  ($2), phonecode = $3 WHERE countryid = $4 RETURNING *',
          [countryName, countryCode, phoneCode, id]
        );
      
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Country not found.' });
        }
      
        res.status(200).json({ message: 'Country successfully updated', country: result.rows[0] });
      } catch (error) {
        console.error('Error updating country:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

})

router.post('/checkDuplicateCountry', async (req, res) => {
  try {
    const { countryName } = req.body;

    if (typeof countryName !== 'string') {
      return res.status(400).json({ error: 'Invalid countryName provided' });
    }

    // Check for duplicate city name
    const duplicateCity = await pool.query(
      'SELECT COUNT(*) FROM country WHERE LOWER(countryname) = LOWER($1) AND isdeleted = false',
      [countryName.toLowerCase()]
    );

    res.status(200).json({
      isDuplicate: duplicateCity.rows[0].count > 0, // Check the count in the first row
    });
  } catch (error) {
    console.error('Error checking duplicate country name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router