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
  const { countryname, countrycode, phonecode,page,limit } = req.body;

  if (!countryname || !countrycode || !phonecode) {
    return res.status(400).send("Missing fields");
  }

  try {
    // Check if country name already exists
    let fresult = await pool.query('SELECT * FROM country WHERE LOWER(countryname) = LOWER($1)', [countryname]);

    if (fresult.rowCount > 0) {
      const existingCountry = fresult.rows[0];
      if (existingCountry.isdeleted) {
        // Update existing country's isdeleted flag to false
        const updatedQuery = await pool.query('UPDATE country SET isdeleted = false WHERE countryname = $1 RETURNING *', [existingCountry.countryname]);
        const totalCountQuery = await pool.query('SELECT COUNT(*) FROM country WHERE isdeleted = false');
        const totalCount = totalCountQuery.rows[0].count;
  
        // Fetch paginated data of existing countries
        const offset = (page - 1) * limit;
        const allData = await pool.query('SELECT * FROM country WHERE isdeleted = false LIMIT $1 OFFSET $2', [limit, offset]);
        return res.status(200).json({
          result: allData.rows,
          pagination: {
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
          }
        });
      } else {
        return res.status(400).json({ error: 'Country already exists'});
      }
    } else {
      // Country name does not exist, proceed with insertion
      const finalResult = await pool.query('INSERT INTO country (countryname, countrycode, phonecode) VALUES ($1, $2, $3) RETURNING *', [countryname, countrycode, phonecode]);
      
      const totalCountQuery = await pool.query('SELECT COUNT(*) FROM country WHERE isdeleted = false');
      const totalCount = totalCountQuery.rows[0].count;

      // Fetch paginated data of existing countries
      const offset = (page - 1) * limit;
      const allData = await pool.query('SELECT * FROM country WHERE isdeleted = false LIMIT $1 OFFSET $2', [limit, offset]);

      res.status(200).json({
        result: allData.rows,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
        }
      });

    }
  } catch (error) {
    console.error('Error creating/updating country:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deleteCountry/:id', async (req, res) => {
  const id = req.params.id;
  const {page,limit} = req.body
  try {
      // Check if the country is associated with any state
      const stateCheck = await pool.query('SELECT * FROM state WHERE countryid = $1 AND isdeleted = false', [id]);

      if (stateCheck.rows.length > 0) {
          // If the country is associated with states, return a message indicating the association
          return res.status(400).json({ message: 'Cannot delete country as it is associated with states.' });
      }

      // If the country is not associated with any states, proceed with deletion
      const result = await pool.query('UPDATE country SET isdeleted = true WHERE countryid = $1 RETURNING *', [id])
      const offset = (page - 1) * limit;
      
            const totalCountQuery = await pool.query('SELECT COUNT(*) FROM country WHERE isdeleted = false');
            const totalCount = totalCountQuery.rows[0].count;
      const finalResult = await pool.query('select * from country where isdeleted = false limit $1 offset $2', [limit,offset])

      // Fetch paginated data of existing countries
      if (result.rowCount > 0) {
          return res.status(200).json({ message: `Country deleted successfully.`, finalResult: finalResult.rows,pagination:{
            totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          } });
      } else {
          return res.status(404).json({ message: 'No country found with the provided ID.' });
      }
  } catch (error) {
      console.log("Error deleting country:", error)
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updateCountry', async (req, res) => {
  const { id, countryName, countryCode, phoneCode, page, limit} = req.body;

  try {

    const existingCountry = await pool.query(
    'select * from country where LOWER(countryname) = LOWER($1) AND isdeleted = false',
      [countryName])

      if (existingCountry.rows[0].phonecode === phoneCode && existingCountry.rows[0].countryname === countryName && existingCountry.rows[0].countrycode === countryCode) {
        return res.status(400).json({ error: 'Country already exists.' });
      }

    // Update country data in the database
    const result = await pool.query(
      'UPDATE country SET countryname = $1, countrycode = $2, phonecode = $3 WHERE countryid = $4 RETURNING *',
      [countryName, countryCode, phoneCode, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Country not found.' });
    }

    // Fetch the total count of countries
    // const totalCountQuery = await pool.query('SELECT COUNT(*) FROM country WHERE isdeleted = false');
    // const totalCount = totalCountQuery.rows[0].count;

    // // Calculate the total number of pages based on the limit
    // const totalPages = Math.ceil(totalCount / limit);

    // // Calculate the offset based on the current page and limit
    // const offset = (page - 1) * limit;

    // // Fetch the data for the current page after the update
    // const updatedData = await pool.query(
    //   'SELECT * FROM country WHERE isdeleted = false ORDER BY countryid LIMIT $1 OFFSET $2',
    //   [limit, offset]
    // );

       
    const totalCountQuery = await pool.query('SELECT COUNT(*) FROM country WHERE isdeleted = false');
    const totalCount = totalCountQuery.rows[0].count;

    // Fetch paginated data of existing countries
    const offset = (page - 1) * limit;
    const allData = await pool.query('SELECT * FROM country WHERE isdeleted = false LIMIT $1 OFFSET $2', [limit, offset]);

    res.status(200).json({
      result: allData.rows,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      }
    });

  } catch (error) {
    console.error('Error updating country:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// router.post('/checkDuplicateCountry', async (req, res) => {
//   try {
//     const { countryName } = req.body;

//     if (typeof countryName !== 'string') {
//       return res.status(400).json({ error: 'Invalid countryName provided' });
//     }

//     // Check for duplicate city name
//     const duplicateCity = await pool.query(
//       'SELECT COUNT(*) FROM country WHERE LOWER(countryname) = LOWER($1) AND isdeleted = false',
//       [countryName.toLowerCase()]
//     );

//     res.status(200).json({
//       isDuplicate: duplicateCity.rows[0].count > 0, // Check the count in the first row
//     });
//   } catch (error) {
//     console.error('Error checking duplicate country name:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


module.exports = router