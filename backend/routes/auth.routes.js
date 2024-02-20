const express = require('express')
const router = express.Router();
const { body, validationResult } = require("express-validator");
const pool = require('../db');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
// const verifyToken = require('../middleware/verifyToken');
const JWT_SECRET = "yashpanchaluasnnasuanausas"

router.post('/createUser', [
    body("userName", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be at least 5 characters long").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Check whether user exists or not in the database
    try {
        const { userName, password, email } = req.body;

        const checkUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 LIMIT 1',
            [userName]
        );

        if (checkUser.rowCount > 0) {
            return res.status(409).json({ error: "User already exists" });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const createUser = await pool.query(
                'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
                [userName, hashedPassword, email]
            );

            if (createUser.rowCount > 0) {
                return res.status(201).json({ message: "User created successfully!", user: createUser.rows[0] });
            }
        }
    } catch (error) {
        console.error("Error adding user", error);
        return res.status(500).json({ error: "Some error has occurred" });
    }
});

router.post('/loginUser', async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        //check user exits or not
        try {

            // console.log(req)

            const { userName , password } = req.body;


            const userExist = await pool.query(
            'select * from users where username = $1'
            , [userName])

            // console.log(userExist)

            // console.log(userExist)
             
            if(userExist.rowCount === 0){
                  return res.status(400).json({error : "User Does Not Exits"})
            }
            
                const user = userExist.rows[0];
                console.log(user)
    
                const passwordCompare = await bcrypt.compare(password, user.password)
    
                if(!passwordCompare){
                    return res.status(409).json({error : "Try with correct credentials"})
                }
    
                const data = {
                    users : {
                        name : userName,
                        password : password,
                        expiresIn: '24h'
                    }
                }
                
                const authToken = jwt.sign(data, JWT_SECRET);
                                
                res.status(200).json({message: "User Login SuccessFully", result: user , authToken})

        } catch (error) {
                console.log("Error Login User", error)
                res.status(500).json("Some error has occur") 
        }


    })

module.exports = router