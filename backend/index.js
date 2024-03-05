const express = require('express')
const app = express();
const bodyParser = require("body-parser")
const cors = require('cors');

app.use(cors({
    origin: 'https://65e6ffa738de878e772b5214--eclectic-twilight-56bc1f.netlify.app',
    credentials: true
}
));

app.use(bodyParser.json());
const PORT = 8000

// Api routes 
app.use('/api/country' , require('./routes/country.routes'))
app.use('/api/state' , require('./routes/state.routes'))
app.use('/api/city' , require('./routes/city.routes'))
app.use('/api/user' , require('./routes/auth.routes'))
app.use('/api' , require('./routes/pagination.routes'))
app.use('/api/sort' , require('./routes/sort.routes'))



app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})