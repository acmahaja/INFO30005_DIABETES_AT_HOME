const mongoose = require("mongoose");
const {Schema} = mongoose;

const clinicianPatientMessageSchema = new mongoose.Schema({
    for_patient : {
        type: Schema.Types.ObjectID,
        ref: 'Patient'
    },
    message: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model(
  "ClinicianPatientMessage",
  clinicianPatientMessageSchema
);
