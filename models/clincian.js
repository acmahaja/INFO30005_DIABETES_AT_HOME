const mongoose = require("mongoose");

const clincianSchema = new mongoose.Schema({
username: {
        type: String,
        required: [true, "Username can't be blank"]
    }, 
    firstname : {
        type: String,
        required: [true, "First name can't be blank"]
    },
    middlename : {
        type: String
    }, 
    lastname : {
        type: String,
        required: [true, "Last name can't be blank"]
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth can't be blank"]
    },
    email: {
        type: String, 
        required: [true, "email can't be blank"]
    },
    date_joined : {
        type: Date,
        required: [true, "missing joined date"]
    },
    bio : {
        type: String,
    }
});


module.exports = clincianSchema;


