const mongoose = require('mongoose')
require('dotenv').config();


mongoose.connect(`${process.env.MONGO_DB}`, {useNewUrlParser: true});
mongoose.connection.on('error', error => console.log(error) );
mongoose.connection.on("connected", function(){    
    console.log("server is connected to Databse");
});
mongoose.Promise = global.Promise;