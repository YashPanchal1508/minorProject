const express = require('express')
const pool = require('../db')
const router = express.Router();

router.get('/getstate', async(req,res) => {

    const { countryId } = req.body;

    try {
        let result = await pool.query(
            'SELECT stateid, statename FROM state JOIN country ON state.countryid = country.countryid WHERE country.countryid = $1',
            [countryId]
            )

        // let result = await pool.query('select * from state')

            if(result){
                res.send(result.rows)
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


router.post('/addstate', async(req,res)=> {

    const {statename,  countryid} = req.body

    try {

          const result = await pool.query(
            'INSERT INTO state (statename, countryid) VALUES (LOWER($1), $2) RETURNING *', [statename, countryid]
            );

          if (result.rows.length > 0) {
            res.status(201).json({ message: 'State added successfully'});
          } else {
            res.status(400).json({ message: 'Failed to add state' });
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
            res.status(200).json({message : `country with ID ${id} deleted successfully.`})
        }else{
            res.status(404).json({message: 'No state found'})
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


module.exports = router


