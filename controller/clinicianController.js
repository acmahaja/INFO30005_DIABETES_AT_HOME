const clincian = require("../models/clincian");
const Patient = require("../models/patient");
const { clinician_authorization } = require("../utils/authorization");
const {
  get_patient_list,
  get_clinician_id,
  get_threshold,
  get_patient_data,
  get_patient_data_type,
} = require("../utils/utils");

const registerPatient = async (req, res) => {
    req.session.username = "chrispatt";

  let get_clinician = await get_clinician_id(req.session.username);
  console.log(get_clinician);
  const new_patient = new Patient({
    ...req.body,
    date_joined: Date.now(),
    assigned_clincian: get_clinician._id,
  });
  await new_patient.save()
  res.send(new_patient)
};


const renderRegisterPatient = async (req,res)=> {
  req.session.username = "chrispatt"
  let get_clinician = await get_clinician_id(req.session.username);
  res.render("clincian/patientRegister.hbs", {
    clinician: get_clinician.toJSON(),
  });
}

const isLoggedIn = (req, res, next) => {
  if (
    req.session.loggedIn &&
    req.session.username != null &&
    req.session.isClinician
  ) {
    next();
  } else {
    res.redirect("/clincian/logout");
  }
};

const loadGlucosePage = async (req, res) => {
  const patient = await Patient.findById(req.params.patientID);
  const glucose_data = await get_patient_data_type(patient, "blood_glucose");
  res.render("clincian/glucose.hbs", {patient: patient, data: glucose_data});
};

const clincianComments = async (req, res) => {
  req.session.username = "chrispatt";

  let get_clinician = await get_clinician_id(req.session.username);
  let patient_list = await get_patient_list(get_clinician);

  for (let i = 0; i < patient_list.length; i++) {
    var patient = patient_list[i];
    const patient_data = await get_patient_data(
      patient_list[i].id,
      new Date(Date.now())
    );
    var thresholds = await get_threshold(patient_list[i].id);;

    patient = { ...patient._doc, patient_data, thresholds };
  }

  res.render("clincian/comments.hbs", {
    clinician: get_clinician.toJSON(),
    patients: { patient },
  });
};

const loadDashboard = async (req, res) => {
  let get_clinician = await get_clinician_id(req.session.username);
  let patient_list = await get_patient_list(get_clinician);

  for (let i = 0; i < patient_list.length; i++) {
    var patient = patient_list[i];
    const result = await get_threshold(patient_list[i].id);
    var thresholds = result;
    const patient_data = await get_patient_data(
      patient_list[i].id,
      new Date(Date.now())
    );
    patient = { ...patient._doc, patient_data, thresholds };
  }

  res.render("clincian/dashboard.hbs", {
    clinician: get_clinician.toJSON(),
    patients: { patient },
  });
};

const clincianLogin = async (req, res) => {
  if (req.session.loggedIn === true) {
    res.redirect("/");
  }
  const { username, password } = req.body;
  const has_user = await clinician_authorization(username, password);
  if (has_user) {
    req.session.loggedIn = true;
    req.session.username = username;
    req.session.isClinician = true;
    res.redirect("/clinician/dashboard");
  } else {
    req.session.destroy();
    res.redirect("/clinician/login");
  }
};

const clincianLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/clinician/login");
};

module.exports = {
  clincianLogin,
  clincianLogout,
  isLoggedIn,
  loadDashboard,
  loadGlucosePage,
  clincianComments,
  renderRegisterPatient,
  registerPatient,
};
