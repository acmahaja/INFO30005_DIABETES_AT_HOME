const {
  generateClinician,
  createChris,
  deleteClinician,
} = require("./clinician_seed");

const {
  deletePatients,
  createPat,
  generatePatient,
} = require("./patient_seed");

const {
  deletePatientSettings,
  createPatPatientSettings,
  generatePatientSettings,
} = require("./patient_settings_seed");

const {
  deleteThresholds,
  createPatThresholds,
  createPatientThresholds,
} = require("./patient_thresholds");

const { createHealthData, deleteHealth } = require("./health_data_seed");

const populateDB = async () => {
  // populate Chris and Pat
  createChris().then((chris) => {
    createPat(chris).then(async (pat) => {
      await createPatPatientSettings(pat);
      await createPatThresholds(pat);
      await createHealthData(pat);
    });

    // give Chris more clinican
    for (let i = 0; i < 10; i++) {
      generatePatient(chris).then(async (patient) => {
        await generatePatientSettings(patient);
        await createPatientThresholds(patient);
        await createHealthData(patient);
      });
    }
  });

  for (let i = 0; i < 10; i++) {
    generateClinician().then((clincian) => {
      for (let i = 0; i < 10; i++) {
        generatePatient(clincian).then(async (patient) => {
          await generatePatientSettings(patient);
          await createPatientThresholds(patient);
          await createHealthData(patient);
        });
      }
    });
  }
};

module.exports = { populateDB };
