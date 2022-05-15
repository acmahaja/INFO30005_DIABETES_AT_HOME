const ClincianSchema = require("../models/clincian");
const PatientSchema = require("../models/patient");
const patientSettingsSchema = require("../models/patient_settings");
const HealthDataEntry = require("../models/health_data");
const { patient_authorization } = require("../utils/authorization");
const {
  getDailyHealthData,
  get_threshold,
  get_patient_data,
  calc_engagement_rate,
  get_top5_leaderboard,
  update_clinician_message,
  show_badge,
  get_clinician_message,
  get_patient_settings,
  get_patient_all_data,
  getHistoricalData
} = require("../utils/utils");

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

const postAddHealthData = async (req, res) => {
  var this_user = req.body["user_id"];
  var health_type = req.body["health_type"];
  var value = req.body["data_input"];
  var comment = req.body["text_input"];


  const newHealthData = new HealthDataEntry({
    patient_id: this_user,
    health_type: health_type,
    value: value,
    comments: comment,
    created: Date.now(),
    updated: Date.now(),
  });


  await newHealthData
    .save()

    .catch((err) => {
      console.log(err);
    });
  newEntry = await HealthDataEntry.findOne(
    { this_patient: this_user, health_type: health_type },
    {},
    { sort: { created: -1 } }
  );
  res.redirect("/patient/dataentry");
};

const isLoggedIn = (req, res, next) => {
  if (
    req.session.loggedIn &&
    req.session.username != null &&
    !req.session.isClinician
  ) {
    next();
  } else {
    res.redirect("/patient/logout");
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
  res.redirect("/patient/login");
};

const getDataEntryPage = async (req, res) => {
  req.session.username = "patstuart";
  const this_patient = await PatientSchema.findOne({
    username: req.session.username,
  });

  const patientsettings = await patientSettingsSchema.findOne({
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

const postUpdateHealthData = async (req, res) => {
  var this_user = req.session;
  var health_type = req.body["health_type"];
  var value = req.body["data_input"];
  var comment = req.body["text_input"];

  if (value != "" || comment != "") {
    var filter = {
      patient_id: this_user,
      health_type: health_type,
    };

    if (comment == "") {
      var update = {
        value: value,
        updated: Date.now(),
      };
    } else if (value == "") {
      var update = {
        comments: comment,
        updated: Date.now(),
      };
    } else {
      var update = {
        value: value,
        comments: comment,
        updated: Date.now(),
      };
    }
    var options = { sort: { created: -1 } };

    prevEntry = await HealthDataEntry.findOne(filter, {}, options).lean();

    await HealthDataEntry.findOneAndUpdate(filter, update, options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    //updatedEntry = await HealthDataEntry.findOne(filter, {}, options).lean();
  }
  //res.redirect('back')
  res.redirect("/patient/dataentry");
};

const loadDashboard = async (req, res) => {
  req.session.username = "patstuart";
  var patient = await PatientSchema.findOne({ username: req.session.username });
  var patient_threshold = await get_threshold(patient.id);
  var now = new Date();
  var patient_data = await get_patient_data(patient.id, new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  var patient_settings = await get_patient_settings(patient);
  patient_data = { ...patient._doc, patient_threshold, patient_data, patient_settings };
  var message = await get_clinician_message(patient);
  var engagement_rate = await calc_engagement_rate(patient);
  var badge = await show_badge(patient);
  //var timeseries = await get_patient_all_data(patient);
  var timeseries = await getHistoricalData(patient,10);
  var leaderboard = await get_top5_leaderboard();
  res.render("patient/patientDashboard", {
    patient: patient_data,
    clinicianmessage: message,
    engagement: engagement_rate,
    showBadge: badge,
    historicaldata: timeseries,
    leaderboard: leaderboard

  });
};

module.exports = {
  patientLogin,
  patientLogout,
  isLoggedIn,
  getDataEntryPage,
  postAddHealthData,
  postUpdateHealthData,
  loadDashboard,
};
