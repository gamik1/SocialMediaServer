
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const cors = require('cors'); // Cross-Origin resource sharing
const dotenv = require('dotenv');
const helmet = require("helmet"); //Helmet helps you secure your Express apps by setting various HTTP headers.
const morgan = require('morgan'); // logger
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const mongoose = require('mongoose');
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
app.use(methodOverride('_method'));

dotenv.config();

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

mongoose.connection.on("connected", function(){  
    var db = mongoose.connections[0].db;
    gfs = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "newBucket"
    });
    console.log("gfs bucket : ",gfs);  
});



app.get("/image/profile/:id", (req, res) => {
    console.log(req.params);
    const file = gfs
        .find({
       _id: new mongoose.mongo.ObjectId(req.params.id)
      })
      .toArray((err, files) => {
        console.log(files);
        if (!files || files.length === 0) {
          return res.status(404)
            .json({
              err: "no files exist"
            });
        }
        res.setHeader('content-type', files[0].contentType);
        gfs.openDownloadStream(new mongoose.mongo.ObjectId(req.params.id))
          .pipe(res);
      });
      
  });


app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user' ,passport.authenticate('jwt', { session: false }), secureRoute);




app.listen(port, ()=> console.log(`Social Media Server Started -- on port ${port}!`));