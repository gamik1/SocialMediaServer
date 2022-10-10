
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Cross-Origin resource sharing
const dotenv = require('dotenv');
const helmet = require("helmet"); //Helmet helps you secure your Express apps by setting various HTTP headers.
const morgan = require('morgan'); // logger
require('./Models/db');
const passport = require('passport');
const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');
const UserModel = require('./Models/User');
const app = express();
const port = 8800;

require("./Auth/auth");



app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

dotenv.config();

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

// Handle errors.
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.json({ error: err });
// });


app.listen(port, ()=> console.log(`Social Media Server Started -- on port ${port}!`));