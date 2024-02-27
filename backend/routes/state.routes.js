const express = require('express')
const pool = require('../db')
const router = express.Router();

router.post('/getState', async (req, res) => {

    const { page, limit,sort, column } = req.body;

    console.log(page,limit,sort,column)
    try {
        const totalStateCount = await pool.query('SELECT COUNT(*) FROM state WHERE isdeleted = false');
        const finalTotal = parseInt(totalStateCount.rows[0].count)

        const offset = (page - 1) * limit
            let query;

            query = `SELECT state.*, country.countryname FROM state JOIN country  ON state.countryid = country.countryid  WHERE state.isdeleted = false`

            if(sort && column){
                    query +=  ` ORDER BY ${column} ${sort === 'asc' ? 'ASC' : 'DESC'}`
            }

            query += ' LIMIT $1 OFFSET $2'  
        let result = await pool.query(query, [limit, offset])

        if (result) {
            res.status(200).json({
                data: result.rows,
                pagination: {
                    finalTotal,
                    totalPages: Math.ceil(finalTotal / limit),
                    currentPage: page
                }
            })
        }
        else {
            console.log("Cannot get state")
            res.status(500).json({ error: "Cannot get state" })
        }

    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.post('/addState', async (req, res) => {

    const { statename, countryid, page, limit} = req.body

    try {

        if (!statename || !countryid) {
            return res.status(400).send("Missing fields");
        }

        let findState = await pool.query('select * from state where lower(statename) = lower ($1)', [statename])

        if (findState.rowCount > 0) {
            const existingState = findState.rows[0];
            if (existingState.isdeleted) {
                const updatedQuery = await pool.query('UPDATE state SET countryid = $1, isdeleted = false WHERE statename = $2', [countryid, statename]);
                const totalCountQuery = await pool.query('SELECT COUNT(*) FROM city WHERE isdeleted = false');
                const totalCount = totalCountQuery.rows[0].count;
                const offset = (page - 1) * limit;

                const allData = await pool.query('SELECT state.*, country.countryname FROM state JOIN country ON state.countryid = country.countryid  WHERE state.isdeleted = false LIMIT $1 OFFSET $2', [limit, offset]);

                return res.status(200).json({ updateMessage: "State Updated", fResult: allData.rows, pagination: {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    currentPage: page,
                  } });
            } else {
                return res.status(400).json({ error: 'State already exists' });
            }
        } else {
            const result = await pool.query(
                'INSERT INTO state (statename, countryid) VALUES (LOWER($1), $2) RETURNING *', [statename, countryid]
            );

                const totalCountQuery = await pool.query('SELECT COUNT(*) FROM state WHERE isdeleted = false');
                const totalCount = totalCountQuery.rows[0].count;

                // Fetch paginated data of existing countries
                const offset = (page - 1) * limit;
             const allData = await pool.query('SELECT state.*, country.countryname FROM state JOIN country ON state.countryid = country.countryid  WHERE state.isdeleted = false LIMIT $1 OFFSET $2', [limit, offset]);

            if (result.rows.length > 0) {
                res.status(201).json({ message: 'State added successfully', fResult: allData.rows, pagination: {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    currentPage: page,
                  } });
            } else {
                res.status(400).json({ errorMessage: 'Failed to add state' });
            }

        }
    } catch (error) {
        console.log("Error adding State", error);
        res.status(500).json({ message: "Internal server error" })
    }


})

router.delete('/deleteState/:id', async (req, res) => {
    const id = req.params.id;
    const {page,limit} = req.body
    try {
        // Check if the state is associated with any cities
        const cityCheck = await pool.query('SELECT * FROM city WHERE stateid = $1 and isdeleted = false', [id]);

        if (cityCheck.rows.length > 0) {
            // If the state is associated with cities, return a message indicating the association
            return res.status(200).json({ message: 'Cannot delete state as it is associated with cities.' });
        }

        // If the state is not associated with any cities, proceed with deletion
        const result = await pool.query('UPDATE state SET isdeleted = true WHERE stateid = $1 RETURNING *', [id])

        const offset = (page - 1) * limit;
      
            const totalCountQuery = await pool.query('SELECT COUNT(*) FROM state WHERE isdeleted = false');
            const totalCount = totalCountQuery.rows[0].count;
      const finalResult = await pool.query('SELECT state.*, country.countryname FROM state JOIN country  ON state.countryid = country.countryid  WHERE state.isdeleted = false limit $1 offset $2', [limit,offset])


        if (result.rowCount > 0) {
            return res.status(200).json({ message: `State deleted successfully.`, result: finalResult.rows, pagination:{
                totalCount,
              totalPages: Math.ceil(totalCount / limit),
              currentPage: page,
              } });
        } else {
            return res.status(404).json({ message: 'No state found with the provided ID.' });
        }
    } catch (error) {
        console.log("Error deleting state:", error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/updateState', async (req, res) => {

    const { data, countryid, id } = req.body;


    if (!countryid) {
        return res.status(400).json({ error: 'Country ID is required.' });
    }

    const existingState = await pool.query('SELECT COUNT(*) FROM state WHERE LOWER(statename) = LOWER($1) AND countryid = $2 AND isdeleted = false', [data.toLowerCase(), countryid]);

    console.log(existingState.rows[0].count)

    if(existingState.rows[0].count > 0){
        return res.status(404).json({ error: 'State already exists.' });
    }

    try {
        const result = await pool.query(
            'UPDATE state SET statename = $1, countryid = $2 WHERE stateid = $3 RETURNING *',
            [data, countryid, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'State not found.' });
        }

        const fResult = await pool.query(
            'SELECT s.*, c.countryname FROM state s JOIN country c ON s.countryid = c.countryid WHERE s.stateid = $1',
            [id]
          );

          const updatedStateWithCountryName = fResult.rows[0];

        res.status(200).json({ message: 'State successfully updated', country: updatedStateWithCountryName });
    } catch (error) {
        console.error('Error updating country:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.get('/getAllCountries', async (req, res) => {
    try {
        const result = await pool.query('select * from country where isdeleted = false');
        res.status(200).json({ result: result.rows })


    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
})
router.post('/getAllStates', async (req, res) => {
    const { countryid } = req.body;
    if (!countryid) {
        return res.status(400).json({ error: 'Country id is required' });
      }
    try {
        const result = await pool.query('SELECT state.* FROM state JOIN country ON state.countryid = country.countryid WHERE country.countryid = $1 AND state.isdeleted = false',[countryid]);

        res.status(200).json({ result: result.rows })

    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
})

router.post('/checkDuplicateState', async (req, res) => {
    try {
      const { statename } = req.body;
  
      if (typeof statename !== 'string') {
        return res.status(400).json({ error: 'Invalid countryName provided' });
      }
  
      // Check for duplicate city name
      const duplicateState = await pool.query(
        'SELECT COUNT(*) FROM state WHERE LOWER(statename) = LOWER($1) AND isdeleted = false',
        [statename.toLowerCase()]
      );
  
      res.status(200).json({
        isDuplicate: duplicateState.rows[0].count > 0, // Check the count in the first row
      });
    } catch (error) {
      console.error('Error checking duplicate country name:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router


