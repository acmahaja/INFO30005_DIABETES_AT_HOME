
const isAuthenticatedClinician = (req, res, next) => {
    if (!req.isAuthenticated()) {
    return res.redirect("/clinician/login");
  }
  return next();
};

const isAuthenticatedPatient = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log('not authenticated patient')
    return res.redirect("/patient/login");
  }
  return next();
}

module.exports = { 
  isAuthenticatedClinician,
  isAuthenticatedPatient
};
