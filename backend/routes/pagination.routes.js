const express = require('express')
const pool = require('../db')
const router = express.Router();

// const pagination = async(tableName, page, limit, search, code) => {

//     const offSet = (page - 1) * limit

//     let params;

//     switch (tableName) {

//         case 'country':
            
//              pool.query = 
//             `select * from ${tableName} where isdeleted = false
//             and countryname ilike $1 or countrycode $1 or phonecode = $2
//             order by countryname asc limit $3 offset $4
//             `;
//             params = [`%${search}%`,code, limit,offSet]   
//             break;

//         case 'state':
            
//             pool.query = 
//             `select * from ${tableName} where isdeleted = false
//             and statename ilike $1
//             order by countryname asc limit $2 offset $3`;

//             params = [`%${search}%`, limit, offSet]   
//             break;

//         case 'city' :

//             pool.query = 
//             `select * from ${tableName} where isdeleted = false
//             and cityname ilike $1 order by cityname limit $2 offset $3`;

//             params = [`%${search}%`,limit,offSet]
//             break;
    
//         default:
//             throw new Error('Invalid table name');
//     }

// }
const pagination = async(tableName, page, limit, search, code, sortOrder) => {

    const offSet = (page - 1) * limit;
    // console.log(offSet)
    
    let params,codeParams;
    codeParams = code || '';
    // console.log(sortOrder)

    const intCode = parseInt(codeParams)

    // console.log(typeof intCode)

    // console.log(page)
    // console.log(limit)
    // console.log(searchParams)
    // console.log( codeParams)
    
    
    switch (tableName) {
        case 'country':
             params = [`%${search}%`, `%${search}%`,intCode]    
             return await pool.query(
                `SELECT * FROM ${tableName} WHERE isdeleted = false
                 AND (countryname ILIKE $1 OR countrycode ILIKE $2 OR phonecode::text = $3)
                `,
                params
             );
        case 'state':
             params = [`%${search}%`]   
             return await pool.query(
              `SELECT s.*, c.countryname  FROM state s JOIN country c ON s.countryid = c.countryid WHERE s.isdeleted = false AND (s.statename ILIKE $1 OR c.countryname ILIKE $1) ORDER BY s.statename ${sortOrder === 'ASC' ? 'ASC' : 'DESC'}`,
                params
             );
        case 'city':
             params = [`%${search}%`];
             return await pool.query(
                `SELECT city.*, state.statename, country.countryname 
                FROM city
                JOIN state ON city.stateid = state.stateid
                JOIN country ON city.countryid = country.countryid
                WHERE city.isdeleted = false
                AND ( country.countryname ILIKE $1 OR state.statename ILIKE $1 OR city.cityname ILIKE $1 )`,
                params
             );
        default:
            throw new Error('Invalid table name');
    }
}

router.post('/pagination/:tableName' , async(req,res)=> {

    try {

        const { tableName } = req.params;
        const { page,limit,code,search } = req.body

        // console.log(tableName, page , limit , code, search)

        // console.log(typeof code)

        const result = await pagination(tableName, page, limit, search, code)

        // console.log(result)

        res.status(200).json({result : result.rows})
    } catch (error) {
        console.error('Error during pagination:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

module.exports = router