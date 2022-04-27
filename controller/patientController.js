const ClincianSchema = require("../models/clincian");
const PatientSchema = require("../models/patient");
const PatientSettings = require("../models/patient_settings");
const { patient_authorization } = require("../utils/authorization");
const { getDailyHealthData } = require("../utils/utils");

const GLUCOSE_ENUM_TYPE = "blood_glucose";
const WEIGHT_ENUM_TYPE = "weight";
const INSULIN_ENUM_TYPE = "insulin";
const STEPS_ENUM_TYPE = "steps";
const entryTypes = {
  glucose: GLUCOSE_ENUM_TYPE,
  insulin: INSULIN_ENUM_TYPE,
  steps: STEPS_ENUM_TYPE,
  weight: WEIGHT_ENUM_TYPE,
};

const isLoggedIn = (req, res, next) => {
  if (
    req.session.loggedIn &&
    req.session.username != null &&
    !req.session.isClinician
  ) {
    next();
  } else {
    res.redirect("login");
  }
};

const patientLogin = async (req, res) => {
  if (req.session.loggedIn === true) {
    res.redirect("/");
  }
  const { username, password } = req.body;
  const has_user = await patient_authorization(username, password);

  if (has_user) {
    req.session.loggedIn = true;
    req.session.username = username;
    req.session.isClinician = false;
    res.redirect("/patient/dashboard");
  } else {
    req.session.destroy();
    res.redirect("/patient/login");
  }
};

const patientLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/clinician/login");
};

const getDataEntryPage = async (req, res) => {
  req.session.username = "patstuart";
  const this_patient = await PatientSchema.findOne({
    username: req.session.username,
  });

  console.log(this_patient);

  const patientsettings = await PatientSettings.findOne({
    for_patient: this_patient._id,
  });

  entries = await getDailyHealthData(this_patient._id);

  res.render("patient/patientAddInfo", {
    patient: this_patient,
    patientsettings: patientsettings,
    entry: entries,
    entrytypes: entryTypes,
  });
};

module.exports = {
  patientLogin,
  patientLogout,
  isLoggedIn,
  getDataEntryPage,
};
