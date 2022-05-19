const PatientSchema = require("../models/patient");
const patientThresholdsSchema = require("../models/patient_thresholds");

const deleteThresholds = async () => {
  const entries = await patientThresholdsSchema.find({});
  entries.forEach(
    async (entry) => await patientThresholdsSchema.findByIdAndRemove(entry.id)
  );
  console.log("cleared patient thresholds db");
};

const createPatThresholds = async (findPat) => {
  const entry_blood_glucose = await patientThresholdsSchema({
    for_patient: findPat._id,
    health_type: "blood_glucose",
    max_value: 200,
    min_value: 130,
  });
  const entry_steps = await patientThresholdsSchema({
    for_patient: findPat._id,
    health_type: "steps",
    max_value: 10000,
    min_value: 2000,
  });
  const entry_weight = await patientThresholdsSchema({
    for_patient: findPat._id,
    health_type: "weight",
    max_value: 85,
    min_value: 60,
  });
  const entry_insulin = await patientThresholdsSchema({
    for_patient: findPat._id,
    health_type: "insulin",
    max_value: 3,
    min_value: 1,
  });
  try {
    await entry_blood_glucose.save();
    await entry_steps.save();
    await entry_weight.save();
    await entry_insulin.save();
  } catch (error) {
    console.log("Something Broke");
    console.log(error);
  }
};

const createPatientThresholds = async (patient) => {
  const entry_blood_glucose = await patientThresholdsSchema({
    for_patient: patient._id,
    health_type: "blood_glucose",
    max_value: Math.round(Math.random() * 200),
    min_value: Math.round(Math.random() * 130),
  });
  const entry_steps = await patientThresholdsSchema({
    for_patient: patient._id,
    health_type: "steps",
    max_value: Math.round(Math.random() * 10000),
    min_value: Math.round(Math.random() * 1000),
  });
  const entry_weight = await patientThresholdsSchema({
    for_patient: patient._id,
    health_type: "weight",
    max_value: 85,
    min_value: 60,
  });
  const entry_insulin = await patientThresholdsSchema({
    for_patient: patient._id,
    health_type: "insulin",
    max_value: 3,
    min_value: 1,
  });
  try {
    await entry_blood_glucose.save();
    await entry_steps.save();
    await entry_weight.save();
    await entry_insulin.save();
  } catch (error) {
    console.log("Something Broke");
    console.log(error);
  }
};

module.exports = {
  deleteThresholds,
  createPatThresholds,
  createPatientThresholds,
};
