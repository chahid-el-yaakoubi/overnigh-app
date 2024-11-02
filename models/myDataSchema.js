const mongoose = require('mongoose');
const schema = mongoose.Schema;


// create a new schema object

const custemerSchema = new schema({
    FirstName : String,
    LastName : String,
    Email : String,
    password : String,
    Phone : String,
    Age : Number,
    Country : String,
    Gender : String,
}, {timestamps: true});



// create a model from the schema

const MydataCustemer = mongoose.model('Custemer', custemerSchema)

module.exports = MydataCustemer;

