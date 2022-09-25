
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Cross-Origin resource sharing



const app = express();
const port = 3000;



app.use(cors());



// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send("<h1>This is server</h1>");
});



app.listen(port, ()=> console.log(`Social Media Server Started -- on port ${port}!`));