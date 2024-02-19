const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config();
const cookieParser = require('cookie-parser')
const { auth } = require('./routes')
const database = require('./app/config/database')
const cors = require('cors')
const User = require('./app/model/User');

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


app.get(`${baseUrl}/allUser`, async (req, res) => {
    return res.json({
        'data' : await User.find({})
    })
})
app.get(baseUrl, (req, res) => {
    return res.json({
        'message' : "Welcome to Zinema API"
    })
})


app.listen(PORT, () => {
    console.log(`Port is running on ${PORT}`);
})