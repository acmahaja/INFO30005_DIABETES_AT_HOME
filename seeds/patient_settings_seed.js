const PatientSchema = require("../models/patient");
const patientSettingsSchema = require("../models/patient_settings");

const deletePatientSettings = async () => {
  const entries = await patientSettingsSchema.find({});
  entries.forEach(
    async (entry) => await patientSettingsSchema.findByIdAndRemove(entry._id)
  );
};

const createPatPatientSettings = async (patient) => {
  const new_data = new patientSettingsSchema({
    for_patient: patient._id,
    requires_glucose: true,
    requires_steps: false,
    requires_weight: true,
    requires_insulin: true,
  });
  await new_data.save();
};

const generatePatientSettings = async (patient) => {
  const new_data = new patientSettingsSchema({
    for_patient: patient._id,
    requires_glucose: (Math.floor(Math.random() + 0.45) > 0.5),
    requires_steps: (Math.floor(Math.random() + 0.45) > 0.5),
    requires_weight: (Math.floor(Math.random() + 0.45) > 0.5),
    requires_insulin: (Math.floor(Math.random() + 0.45) > 0.5),
  });
  try {
    await new_data.save()
  } catch (error) {
    console.log("something broke");
    console.log(error);
  }
};

module.exports = {
  deletePatientSettings,
  createPatPatientSettings,
  generatePatientSettings,
};
