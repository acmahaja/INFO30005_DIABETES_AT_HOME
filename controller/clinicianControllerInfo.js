const Patient = require("../models/patient");
const PatientSettings = require("../models/patient_settings");
const patientThresholdsSchema = require("../models/patient_thresholds");

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


    if (
    data.requires_glucose === "on" &&
    (await patientThresholdsSchema.findOne({
      for_patient: req.params.PatientID,
      health_type: "blood_glucose",
    })) === null
  ) {
    const newData = new patientThresholdsSchema({
      for_patient: req.params.PatientID,
      health_type: "blood_glucose",
      min_value: 0,
      max_value: 0,
    });
    newData.save();
  }
  ///
  if (
    data.requires_steps === "on" &&
    (await patientThresholdsSchema.findOne({
      for_patient: req.params.PatientID,
      health_type: "steps",
    })) === null
  ) {
    const newData = new patientThresholdsSchema({
      for_patient: req.params.PatientID,
      health_type: "steps",
      min_value: 0,
      max_value: 0,
    });

    newData.save();
  }
  ///
  if (
    data.requires_weight === "on" &&
    (await patientThresholdsSchema.findOne({
      for_patient: req.params.PatientID,
      health_type: "weight",
    })) === null
  ) {
    const newData = new patientThresholdsSchema({
      for_patient: req.params.PatientID,
      health_type: "weight",
      min_value: 0,
      max_value: 0,
    });
    newData.save();
  }
  ///
  if (
    data.requires_insulin === "on" &&
    (await patientThresholdsSchema.findOne({
      for_patient: req.params.PatientID,
      health_type: "insulin",
    })) === null
  ) {
    const newData = new patientThresholdsSchema({
      for_patient: req.params.PatientID,
      health_type: "insulin",
      min_value: 0,
      max_value: 0,
    });
    newData.save();
  }

  res.redirect(`/clinician/${req.params.PatientID}/info`);
};

const loadPatientInfo = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);
  const settings = await PatientSettings.findOne({
    for_patient: req.params.PatientID,
  });
  const thresholds = await get_threshold(req.params.PatientID);
  res.render("clincian/info/patient_info.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    settings: settings,
    thresholds: thresholds,
  });
};

module.exports = {
  loadPatientInfo,
  updatePatientInfo,
};
