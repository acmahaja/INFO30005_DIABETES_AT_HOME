const Patient = require("../models/patient");

const {
  get_clinician_id,
  get_patient_all_data,
  get_patient_settings,
  get_threshold,
  get_patient_data_type,
} = require("../utils/utils");

const loadSpecificData = async (req,res)=>{
    if (
      !(
        req.params.Type === "blood_glucose" ||
        req.params.Type === "steps" ||
        req.params.Type === "weight" ||
        req.params.Type === "insulin"
      )
    ) {
      return res.redirect(
        `/clinician/${req.params.PatientID}/data`
      );
    }

  const patient = await Patient.findById(req.params.PatientID);
  const data = await get_patient_all_data(patient);
  const get_clinician = await get_clinician_id(req.session.username);
  const patient_settings = await get_patient_settings(patient)
  const patient_thresholds = await get_threshold(patient._id)
  const glucose_data = await get_patient_data_type(patient, req.params.Type)
  
  res.render("clincian/data/data.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    patient_settings: patient_settings,
    patient_thresholds: patient_thresholds,
    type: req.params.Type,
    data: data,
    health: JSON.stringify(glucose_data),
  });
}

const loadDataPage = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const patient_settings = await get_patient_settings(patient);
  if (req.params.Type === undefined) {
    if (patient_settings.requires_glucose) {
      return res.redirect(`/clinician/${req.params.PatientID}/data/blood_glucose`);
    }
    if (patient_settings.requires_steps) {
      return res.redirect(`/clinician/${req.params.PatientID}/data/steps`);
    }
    if (patient_settings.requires_weight) {
      return res.redirect(`/clinician/${req.params.PatientID}/data/weight`);
    }
    if (patient_settings.requires_insulin) {
      return res.redirect(`/clinician/${req.params.PatientID}/data/insulin`);
    }
  } else {
      if (
        !(
          req.params.Type === "blood_glucose" ||
          req.params.Type === "steps" ||
          req.params.Type === "weight" ||
          req.params.Type === "insulin"
        )
      ) {
        return res.redirect(
          `/clinician/${req.params.PatientID}/data/${req.params.Type}`
        );
      }
  }
  const data = await get_patient_all_data(patient);
  const get_clinician = await get_clinician_id(req.session.username);
  const patient_thresholds = await get_threshold(patient._id);
  const glucose_data = await get_patient_data_type(patient, req.params.Type);

  res.render("clincian/data/data.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    patient_settings: patient_settings,
    patient_thresholds: patient_thresholds,
    type: req.params.Type,
    data: data,
    health: JSON.stringify(glucose_data),
  });
}

module.exports = {
  loadSpecificData,
  loadDataPage,
};
