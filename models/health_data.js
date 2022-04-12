const mongoose = require("mongoose");
const patient = require("./patient")
const {Schema} = mongoose;

const healthDataSchema = new mongoose.Schema({
   to_patient : {
        type: Schema.Types.ObjectID,
        ref: 'Patient'
    },
    health_type : {
        type: String,
        enum: ['blood_glucose', 'weight', 'insulin', 'steps'],
        required: true
    },
    value : {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        required: true
    },
    updated: {
        type: Date,
        required: true
    }
})


module.exports = mongoose.model('HealthDataEntry', healthDataSchema);
