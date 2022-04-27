const clincian = require("../models/clincian");
const patient = require("../models/patient");
const { patient_authorization } = require("../utils/authorization");
const {
  get_patient_list,
  get_clinician_id,
  get_threshold,
  get_patient_data,
} = require("../utils/utils");


const isLoggedIn = (req,res,next)=>{
	if(req.session.loggedIn && req.session.username != null && !req.session.isClinician){
		next();
	} else {
		res.redirect('login');
	}
}

const loadDashboard = async (req,res)=> {
	
}

const patientLogin = async (req,res) => {
	if(req.session.loggedIn === true){
		res.redirect("/")
	}
	const {username, password} = req.body;
	const has_user = await patient_authorization(username, password);
	if(has_user){
		req.session.loggedIn = true;
		req.session.username = username;
        req.session.isClinician = false;
		res.redirect("/patient/dashboard")

	} else {
		req.session.destroy()
		res.redirect("/patient/login")
	}
}

const patientLogout = (req,res) => {
    req.session.destroy()
	res.redirect("/clinician/login")
}

module.exports = {
  patientLogin,
  patientLogout,
  isLoggedIn,
  loadDashboard
};