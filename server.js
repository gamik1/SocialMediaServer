
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require('cors'); // Cross-Origin resource sharing
const dotenv = require('dotenv');
const helmet = require("helmet"); //Helmet helps you secure your Express apps by setting various HTTP headers.
const morgan = require('morgan'); // logger
require('./Models/db');
const passport = require('passport');
const routes = require('./Routes/routes');
const secureRoute = require('./Routes/secure-routes');
const UserModel = require('./Models/User');

const app = express();

const port = process.env.PORT || 8800;

require("./Auth/auth");



app.use(cors());
app.use(express.json()); 
app.use(helmet());
app.use(morgan("common"));

dotenv.config();

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use("/images", express.static(path.join(__dirname, "public/uploads")));


app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user' ,passport.authenticate('jwt', { session: false }), secureRoute);




app.listen(port, ()=> console.log(`Social Media Server Started -- on port ${port}!`));