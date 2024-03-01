const express = require('express')
const pool = require('../db');
const router = express.Router();

router.post('/addCity', async (req, res) => {
    const { cityName, countryId, stateId, page ,limit } = req.body;
    try {
       
        // Check if the city already exists
        const existingCity = await pool.query('SELECT * FROM city WHERE LOWER(cityname) = LOWER($1) AND isdeleted = true', [cityName]);
        
        if (existingCity.rows.length > 0) {
            // City already exists
            const city = existingCity.rows[0];
            if (city.isdeleted) {
                    const updateResult = await pool.query(
                    'UPDATE city SET countryid =$1, stateid = $2, cityname = $3 ,isdeleted = false WHERE cityid = $4', [countryId, stateId, cityName ,city.cityid])
                    const totalCountQuery = await pool.query('SELECT COUNT(*) FROM city WHERE isdeleted = false');
                    const totalCount = totalCountQuery.rows[0].count;
                    const offset = (page - 1) * limit;
    
                    const allData = await pool.query('SELECT city.*, country.countryname, state.statename FROM city JOIN country ON city.countryid = country.countryid JOIN state ON city.stateid = state.stateid  WHERE city.isdeleted = false limit $1 offset $2', [limit,offset]);

                       return res.status(200).json({ updateMessage: 'City already exists and has been activated.', fResult: allData.rows, pagination : {
                           totalCount,
                           totalPages: Math.ceil(totalCount / limit),
                           currentPage: page,
                       }  });
            }
               else {
                    return res.status(500).json({ error: 'Failed to activate city.' });
                }
        }
        else{
           // If city doesn't exist, insert a new city
        const cityResult = await pool.query(
            'INSERT INTO city (countryid, stateid, cityname) VALUES ($1, $2, $3) RETURNING *',
            [countryId, stateId, cityName]
        );
                const totalCountQuery = await pool.query('SELECT COUNT(*) FROM city WHERE isdeleted = false');
                const totalCount = totalCountQuery.rows[0].count;

      // Fetch paginated data of existing countries
                const offset = (page - 1) * limit;

                const allData = await pool.query('SELECT city.*, country.countryname, state.statename FROM city JOIN country ON city.countryid = country.countryid JOIN state ON city.stateid = state.stateid  WHERE city.isdeleted = false limit $1 offset $2', [limit,offset]);

        if (cityResult.rows.length > 0) {
            return res.status(200).json({ message: 'City Added successfully', fResult: allData.rows, pagination : {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
            } });
        } else {
            console.error('Error adding city');
            return res.status(500).json({ error: 'Failed to add city.' });
        }
    }

    } catch (error) {
        console.error('Error adding city:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/removeCity', async (req, res) => {
    const { cityId,page,limit } = req.body;

    try {

        const result = await pool.query(
            'UPDATE city SET isdeleted = true WHERE cityid = $1 RETURNING *'
            , [cityId])

            const offset = (page - 1) * limit;
      
            const totalCountQuery = await pool.query('SELECT COUNT(*) FROM city WHERE isdeleted = false');
            const totalCount = totalCountQuery.rows[0].count;

            
            const allData = await pool.query('SELECT city.*, country.countryname, state.statename FROM city JOIN country ON city.countryid = country.countryid JOIN state ON city.stateid = state.stateid  WHERE city.isdeleted = false limit $1 offset $2', [limit,offset]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: `City Deleted Successfully`, result: allData.rows , pagination:{
                totalCount,
              totalPages: Math.ceil(totalCount / limit),
              currentPage: page,
              } })
        } else {
            res.status(404).json({ message: 'No city found' })
        }

    } catch (error) {
        console.error("Error deleting city", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.put('/updateCity',async (req, res) => {
    let { cityId, cityName, stateId, countryId } = req.body;

    // const countryResult = await pool.query('SELECT * FROM country WHERE countryid = $1', [countryId]);
    // const stateResult = await pool.query('SELECT * FROM state WHERE stateid = $1', [stateId]);

    // if(countryResult.rows.length === 0 || stateResult.rows.length === 0){
    //     return res.status(404).json({ error: 'Country or state not found.' });
    // }

    // Check if the city already exists
    const existingCity = await pool.query('SELECT COUNT(*) FROM city WHERE LOWER(cityname) = LOWER($1) AND stateid = $2 AND isdeleted = false', [cityName.toLowerCase(),stateId]);


    if(existingCity.rows[0].cityname === cityName && existingCity.rows[0].stateid === stateId){
        return res.status(404).json({ error: 'City already exists.' });
    }

    const cityUpdate = await pool.query(
        'UPDATE city SET cityname = $1, stateid = $2, countryid = $3 WHERE cityid = $4 RETURNING *',
        [cityName, stateId, countryId ,cityId])

        const fResult = await pool.query(
              'SELECT city.*, country.countryname, state.statename FROM city JOIN country ON city.countryid = country.countryid JOIN state ON city.stateid = state.stateid WHERE city.isdeleted = false AND city.cityid = $1', [cityId]);    

          const updatedCityWithCountryName = fResult.rows[0];

    if (cityUpdate) {
        res.status(200).json({ message: "City Updated Successfully", city: updatedCityWithCountryName })
    }
    else {
        res.status(500).json({ error: 'Server Error!' })
    }

})

router.post('/getCity',async (req, res) => {

    const {page , limit, sort, column} = req.body
    console.log(sort , column)

    const totalStateCount = await pool.query('SELECT COUNT(*) FROM city WHERE isdeleted = false'); 
    const finalTotal = parseInt( totalStateCount.rows[0].count)

    const offset = (page - 1) * limit

    let query;

   query =   
   `SELECT city.*, country.countryname, state.statename
    FROM city
    INNER JOIN country ON city.countryid = country.countryid
    INNER JOIN state ON city.stateid = state.stateid
    WHERE city.isdeleted = false`

    if(sort && column){
            query += ` ORDER BY ${column} ${sort === 'desc' ? 'DESC' : 'ASC'}`;
    }

    query += ` LIMIT $1 OFFSET $2`;

    try {
        const result = await pool.query(query, [limit,offset]
        )

        res.status(200).json({
            data: result.rows,
            pagination: {
                finalTotal,
                totalPages : Math.ceil(finalTotal / limit),
                currentPage : page
            }

        })

    } catch (error) {
        console.error("Error Getting city", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/checkDuplicateCity', async (req, res) => {
    try {
      const { cityName } = req.body;
  
      if (typeof cityName !== 'string') {
        return res.status(400).json({ error: 'Invalid countryName provided' });
      }
  
      // Check for duplicate city name
      const duplicateCity = await pool.query(
        'SELECT COUNT(*) FROM city WHERE LOWER(cityname) = LOWER($1) AND isdeleted = false',
        [cityName.toLowerCase()]
      );
  
      res.status(200).json({
        isDuplicate: duplicateCity.rows[0].count > 0, // Check the count in the first row
      });
    } catch (error) {
      console.error('Error checking duplicate city name:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router