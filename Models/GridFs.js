const mongoose = require('mongoose');

var GridfsSchema = new mongoose.Schema({
    filename: String
}, {strict: false});

const GridFs = mongoose.model('GridFs', GridfsSchema, 'newBucket.files' );
module.exports = GridFs;