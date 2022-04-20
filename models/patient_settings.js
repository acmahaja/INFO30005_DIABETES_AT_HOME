const mongoose = require("mongoose");
const patient = require("./patient")
const {Schema} = mongoose;

const patientSettingsSchema = new mongoose.Schema({
    for_patient : {
        type: Schema.Types.ObjectID,
        ref: 'Patient'
    },
    requires_glucose : {
        type: Boolean,
        required : [true, "Blood Glucose option can't be blank"]
    },
    requires_steps : {
        type: Boolean,
        required : [true, "Steps option can't be blank"]
    },
    requires_weight : {
        type: Boolean,
        required : [true, "Weight option can't be blank"]
    },
    requires_insulin : {
        type: Boolean,
        required : [true, "Insulin option can't be blank"]
    },
})


module.exports = mongoose.model('PatientSettings', patientSettingsSchema);
