const PatientSchema = require("../models/patient");
const patientSettingsSchema = require("../models/patient_settings");

const faker = require("faker")

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
    requires_glucose: faker.datatype.boolean(),
    requires_steps: faker.datatype.boolean(),
    requires_weight: faker.datatype.boolean(),
    requires_insulin: faker.datatype.boolean(),
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
