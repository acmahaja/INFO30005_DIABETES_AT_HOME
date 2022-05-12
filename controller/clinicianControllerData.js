const Patient = require("../models/patient");

const {
  get_clinician_id,
  get_patient_all_data,
  get_patient_settings,
  get_threshold,
  get_patient_data_type,
} = require("../utils/utils");

const loadGlucosePage = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const data = await get_patient_all_data(patient);
  const get_clinician = await get_clinician_id(req.session.username);
  const patient_settings = await get_patient_settings(patient)
  const patient_thresholds = await get_threshold(patient._id)
  const glucose_data = await get_patient_data_type(patient, 'blood_glucose')
  res.render("clincian/glucose.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    patient_settings: patient_settings,
    patient_thresholds: patient_thresholds,
    data: data,
    health: JSON.stringify(glucose_data),
  });
};

module.exports = {
  loadGlucosePage,
};
