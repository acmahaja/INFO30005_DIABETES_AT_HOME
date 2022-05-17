const Patient = require("../models/patient");
const PatientSettings = require("../models/patient_settings");

const {
  get_clinician_id,
  get_patient_all_data,
  get_patient_settings,
  get_threshold,
  get_patient_data_type,
} = require("../utils/utils");

const updatePatientInfo = async (req, res) => {

  const data = JSON.parse(JSON.stringify(req.body));

  await PatientSettings.findOneAndUpdate(
    { for_patient: req.params.PatientID },
    {
      for_patient: req.params.PatientID,
      requires_glucose: data.requires_glucose === "on" ? true : false,
      requires_steps: data.requires_steps === "on" ? true : false,
      requires_weight: data.requires_weight === "on" ? true : false,
      requires_insulin: data.requires_insulin === "on" ? true : false,
    }
  );


  res.redirect(`/clinician/${req.params.PatientID}/info`);
};

const loadPatientInfo = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);
  const settings = await PatientSettings.findOne({for_patient: req.params.PatientID})
  res.render("clincian/info/patient_info.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    settings: settings
  });
};

module.exports = {
  loadPatientInfo,
  updatePatientInfo,
};
