
const isAuthenticatedClinician = (req, res, next) => {
    if (!req.isAuthenticated()) {
    return res.redirect("/clinician/login");
  }
  
  return next();
};

module.exports = { isAuthenticatedClinician };
