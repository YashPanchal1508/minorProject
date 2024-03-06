const express = require('express')
const app = express();
const bodyParser = require("body-parser")
const cors = require('cors');
const dotenv = require('dotenv').config()


app.use(cors());

app.use(bodyParser.json());
const PORT = 8000

// Api routes 
app.use('/api/country' , require('./routes/country.routes'))
app.use('/api/state' , require('./routes/state.routes'))
app.use('/api/city' , require('./routes/city.routes'))
app.use('/api/user' , require('./routes/auth.routes'))
app.use('/api' , require('./routes/pagination.routes'))
app.use('/api/sort' , require('./routes/sort.routes'))

app.get('/', (req,res)=> {
        res.send("API is running")
})


app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})