const express = require('express');
const app = express();
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId; 
require('dotenv').config();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World I am now working on express js after a long time')
})

app.listen(process.env.PORT || 8080)