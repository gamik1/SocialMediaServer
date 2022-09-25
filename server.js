
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Cross-Origin resource sharing
const dotenv = require('dotenv');
const helmet = require("helmet"); //Helmet helps you secure your Express apps by setting various HTTP headers.
const morgan = require('morgan'); // logger
require('./Models/db');


const app = express();
const port = 3000;



app.use(cors());
app.use(helmet());

dotenv.config();

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send("<h1>This is server</h1>");
});



app.listen(port, ()=> console.log(`Social Media Server Started -- on port ${port}!`));