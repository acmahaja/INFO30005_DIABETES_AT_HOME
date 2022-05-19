const mongoose = require("mongoose");
const {Schema} = mongoose;

const clinicianPatientMessageSchema = new mongoose.Schema({
    for_clincian : {
        type: Schema.Types.ObjectID,
        ref: 'Clinician'
    },
    for_patient : {
        type: Schema.Types.ObjectID,
        ref: 'Patient'
    },
    created: {
        type: Date
    },
    message: {
        type: String
    }
})


module.exports = mongoose.model(
  "ClinicianPatientMessage",
  clinicianPatientMessageSchema
);
