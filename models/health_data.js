const mongoose = require("mongoose");
const patient = require("./patient")
const {Schema} = mongoose;

const healthDataSchema = new mongoose.Schema({
    patient_id : {
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
    created: {
        type: Date,
        required: true
    },
    updated: {
        type: Date,
        // required: true
    },
    comments: {
        type: String
    }
})


module.exports = mongoose.model('HealthDataEntry', healthDataSchema);
