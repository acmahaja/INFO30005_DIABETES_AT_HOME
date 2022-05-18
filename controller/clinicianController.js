const Patient = require("../models/patient");
const PatientSettings = require("../models/patient_settings");

const { clinician_authorization } = require("../utils/authorization");
const {
  get_patient_list,
  get_clinician_id,
  get_threshold,
  get_patient_data,
  get_patient_data_type,
} = require("../utils/utils");

const renderPatientInfo = async (req, res) => {
  const { PatientID } = req.params;
  let get_clinician = await get_clinician_id(req.user.username);

  let patient = await Patient.findById(PatientID);
  let patient_settings = await PatientSettings.findOne({
    for_patient: PatientID,
  });
  var thresholds = await get_threshold(PatientID);

  res.render("clincian/info", {
    assigned_clincian: get_clinician ,
    patient_settings: patient_settings,
    patient: patient ,
    thresholds: thresholds,
  });
};

const registerPatient = async (req, res) => {

  let get_clinician = await get_clinician_id(req.user.username);
  const new_patient = new Patient({
    ...req.body,
    date_joined: Date.now(),
    secret: "INFO30005",
    assigned_clincian: get_clinician._id,
    
  });

  const new_patient_settings = new PatientSettings({
    for_patient: new_patient._id,
  });

  await new_patient.save();
  new_patient_settings.save();
  res.redirect(`/clinician/${new_patient._id}/info`);
};

const renderRegisterPatient = async (req, res) => {
  let get_clinician = await get_clinician_id(req.user.username);
  res.render("clincian/patientRegister.hbs", {
    clinician: get_clinician ,
  });
};

const clincianComments = async (req, res) => {
  let get_clinician = await get_clinician_id(req.user.username);
  let patient_list = await get_patient_list(get_clinician);
  var patient_info = [];
  for (let i = 0; i < patient_list.length; i++) {
    var patient = patient_list[i];

    const result = await get_threshold(patient_list[i].id);
    var thresholds = result;
    const patient_data = await get_patient_data(
      patient_list[i]._id,
      new Date(Date.now())
    );
    const patient_settings = await PatientSettings.findOne({
      for_patient: patient_list[i]._id,
    });
    patient = { ...patient._doc, patient_data, thresholds, patient_settings };
    patient_info.push(patient);
  }

  res.render("clincian/comments.hbs", {
    clinician: get_clinician ,
    patients: { patient_info },
  });
};

const loadDashboard = async (req, res) => {
  let get_clinician = await get_clinician_id(req.user.username);
  let patient_list = await get_patient_list(get_clinician);
  var patients = [];
  for (let i = 0; i < patient_list.length; i++) {
    var patient = patient_list[i];

    const result = await get_threshold(patient_list[i].id);
    var thresholds = result;
    const patient_data = await get_patient_data(
      patient_list[i]._id,
      new Date(Date.now())
    );
    const patient_settings = await PatientSettings.findOne({
      for_patient: patient_list[i]._id,
    });
    patient = { ...patient._doc, patient_data, thresholds, patient_settings };
    patients.push(patient);
  }

  res.render("clincian/dashboard.hbs", {
    clinician: get_clinician,
    patients: { patient_info: patients },
  });
};



const clincianLogout = (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect("/clinician/login");
};

module.exports = {
  clincianLogout,
  loadDashboard,
  clincianComments,
  renderRegisterPatient,
  registerPatient,
  renderPatientInfo,
};
