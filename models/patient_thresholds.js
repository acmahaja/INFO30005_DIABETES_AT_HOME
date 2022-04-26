const mongoose = require("mongoose");
const patient = require("./patient");
const { Schema } = mongoose;

const patientThresholdsSchema = new mongoose.Schema({
  for_patient: {
    type: Schema.Types.ObjectID,
    ref: "Patient",
  },
  health_type: {
    type: String,
    enum: ["blood_glucose", "weight", "insulin", "steps"],
    required: true,
  },
  max_value: {
    type: Number,
    required: true,
  },
  min_value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("PatientSettings", patientThresholdsSchema);
