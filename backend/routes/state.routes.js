const express = require('express')
const pool = require('../db')
const router = express.Router();

router.post('/getState', async (req, res) => {

    const { page, limit,sort,column } = req.body;


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

    const { statename, countryid } = req.body

    try {

        if (!statename || !countryid) {
            return res.status(400).send("Missing fields");
        }

        let findState = await pool.query('select * from state where lower(statename) = lower ($1)', [statename])

        if (findState.rowCount > 0) {
            const existingState = findState.rows[0];
            if (existingState.isdeleted) {
                const updatedQuery = await pool.query('UPDATE state SET isdeleted = false WHERE statename = $1', [statename]);
                return res.status(200).json({ updateMessage: "State Updated", rows: updatedQuery.rows });
            } else {
                return res.status(400).json({ error: 'State already exists' });
            }
        } else {
            const result = await pool.query(
                'INSERT INTO state (statename, countryid) VALUES (LOWER($1), $2) RETURNING *', [statename, countryid]
            );

            if (result.rows.length > 0) {
                res.status(201).json({ message: 'State added successfully', result: result.rows[0] });
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

    try {

        const result = await pool.query('UPDATE state SET isdeleted = true WHERE stateid = $1 RETURNING *', [id])

        if (result.rowCount > 0) {
            // const updatedData = await pool.query(
            // 'SELECT state.*, country.countryname FROM state join country on state.countryid = country.countryid  WHERE state.isdeleted = false and country.isdeleted = false');
            res.status(200).json({ message: 'State with ID deleted successfully.' });
        } else {
            res.status(404).json({ errorMessage: 'No state found' })
        }

    } catch (error) {
        console.log("error deleting state", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/updateState', async (req, res) => {

    const { data, countryid, id } = req.body;

    console.log(countryid, data, id)

    if (!countryid) {
        return res.status(400).json({ error: 'Country ID is required.' });
    }

    try {
        const result = await pool.query(
            'UPDATE state SET statename = LOWER($1), countryid = $2 WHERE stateid = $3 RETURNING *',
            [data, countryid, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'State not found.' });
        }

        res.status(200).json({ message: 'State successfully updated', country: result.rows[0] });
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


