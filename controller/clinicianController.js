const clincian = require("../models/clincian");
const patient = require("../models/patient");
const { clinician_authorization } = require("../utils/authorization");
const {
  get_patient_list,
  get_clinician_id,
  get_threshold,
  get_patient_data,
} = require("../utils/utils");


const renderRenderPatient = (req,res)=> {
  res.render("clincian/patientRegister.hbs");
}

const isLoggedIn = (req, res, next) => {
  console.log(
    req.session.loggedIn &&
      req.session.username != null &&
      req.session.isClinician
  );
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
  const get_clinician = await get_clinician_id(req.session.username);
  res.render("clincian/glucose.hbs", { clinician: get_clinician.toJSON() });
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
  renderRenderPatient,
};
