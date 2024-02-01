const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config();
const cookieParser = require('cookie-parser')
const { auth } = require('./routes')
const database = require('./app/config/database')
const cors = require('cors')

const PORT = process.env.PORT || 3000;

const app = express();
const baseUrl = '/api/v1/zinema';

database();

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(`${baseUrl}/auth`, auth);


app.get(baseUrl, (req, res) => {
    res.json({
        'message' : "Welcome to Zinema API"
    })
    return
})


app.listen(PORT, () => {
    console.log(`Port is running on ${PORT}`);
})