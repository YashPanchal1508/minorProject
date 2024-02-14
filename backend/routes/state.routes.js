const express = require('express')
const pool = require('../db')
const router = express.Router();

router.post('/getState', async(req,res) => {

    const { page , limit } = req.body;

    
    try {
        // let result = await pool.query(
            //     'SELECT stateid, statename FROM state JOIN country ON state.countryid = country.countryid WHERE country.countryid = $1 AND',
            //     [countryId]
            //     )

            const totalStateCount = await pool.query('SELECT COUNT(*) FROM state join country on state.countryid = country.countryid WHERE country.isdeleted = false'); 
            const finalTotal = parseInt( totalStateCount.rows[0].count)
            
            const offset = (page - 1) * limit
            
        let result = await pool.query('SELECT state.*, country.countryname FROM state JOIN country  ON state.countryid = country.countryid  WHERE country.isdeleted = false LIMIT $1 OFFSET $2',
        [limit,offset])

            if(result){
                res.status(200).json({
                    data: result.rows,
                    pagination : {
                        finalTotal,
                        totalPages : Math.ceil(finalTotal / limit),
                        currentPage : page
                    }
                })
            }
            else{
                console.log("Cannot get state")
                res.status(500).json({error: "Cannot get state"})
            }

    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.post('/addState', async(req,res)=> {

    const {statename, countryid} = req.body

    try {

        if (!statename || !countryid) {
            return res.status(400).send("Missing fields");
          }

          let findState = await pool.query('select * from state where lower(statename) = lower ($1)', [statename])

          if(findState.rowCount > 0){
            const existingState = findState.rows[0];
            if(existingState.isdeleted){
                const updatedQuery = await pool.query('UPDATE state SET isdeleted = false WHERE statename = $1', [statename]);
                return res.status(200).json({ updateMessage: "State Updated", rows: updatedQuery.rows });
            }else { 
                return res.status(400).json({ error: 'State already exists' });
              }
          }else{
            const result = await pool.query(
                'INSERT INTO state (statename, countryid) VALUES (LOWER($1), $2) RETURNING *', [statename, countryid]
                );
    
              if (result.rows.length > 0) {
                res.status(201).json({ message: 'State added successfully', result: result.rows[0]});
              } else {
                res.status(400).json({ errorMessage: 'Failed to add state' });
              }
    
          }
    } catch (error) {
        console.log("Error adding State",error);
        res.status(500).json({message : "Internal server error"})
    }


})

router.delete('/deletestate/:id', async(req,res) => {

    const id = req.params.id;
   
    try {

        const result = await pool.query('UPDATE state SET isdeleted = true WHERE stateid = $1 RETURNING *', [id])

        if(result.rowCount > 0){
            res.status(200).json({message : 'country with ID deleted successfully.', result: result.rows})
        }else{
            res.status(404).json({errorMessage: 'No state found'})
        }

    } catch (error) {
        console.log("error deleting state", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/updateState/:id', async(req,res) => {

    const {stateName} = req.body;
    const {id} = req.params;

    
    try {
        const result = await pool.query(
          'UPDATE state SET statename = LOWER($1) WHERE stateid = $2 RETURNING *',
          [stateName, id]
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

router.get('/getAllCountries', async(req,res)=> {
        try {
                const result = await pool.query('select * from country where isdeleted = false');
                res.status(200).json({result : result.rows})


        } catch (error) {
            res.status(500).json("Internal Server Error")
        }
})


module.exports = router


