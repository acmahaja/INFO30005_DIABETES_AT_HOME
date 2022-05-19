const mongoose = require("mongoose");
const {Schema} = mongoose;

const clinicianPatientNoteSchema = new mongoose.Schema({
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
    note: {
        type: String
    }
})


module.exports = mongoose.model(
  "ClinicianPatientNote",
  clinicianPatientNoteSchema
);
