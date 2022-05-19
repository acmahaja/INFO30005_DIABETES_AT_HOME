const mongoose = require("mongoose");
const patient = require("./patient")
const {Schema} = mongoose;

const patientSettingsSchema = new mongoose.Schema({
  for_patient: {
    type: Schema.Types.ObjectID,
    ref: "Patient",
  },
  requires_glucose: {
    type: Boolean,
    default: false,
    required: [true, "Blood Glucose option can't be blank"],
  },
  requires_steps: {
    type: Boolean,
    default: false,
    required: [true, "Steps option can't be blank"],
  },
  requires_weight: {
    type: Boolean,
    default: false,
    required: [true, "Weight option can't be blank"],
  },
  requires_insulin: {
    type: Boolean,
    default: false,
    required: [true, "Insulin option can't be blank"],
  },
});


module.exports = mongoose.model('PatientSettings', patientSettingsSchema);
