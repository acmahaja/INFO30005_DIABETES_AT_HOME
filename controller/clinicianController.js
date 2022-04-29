const clincian = require("../models/clincian");
const patient = require("../models/patient");
const { clinician_authorization} = require("../utils/authorization")
const {
  get_patient_list,
  get_clinician_id,
  get_threshold,
  get_patient_data,
} = require("../utils/utils");



// check if clincian is logged in
const isLoggedIn = (req,res,next)=>{
	console.log(
    req.session.loggedIn &&
      req.session.username != null &&
      req.session.isClinician
  );
	if(req.session.loggedIn && req.session.username != null && req.session.isClinician){
		next();
	} else {
		
		res.redirect("/clincian/logout");
	}
}


// render patient glucose page
// *not implemented yet*
const loadGlucosePage = async (req,res) => {
	const get_clinician = await get_clinician_id(req.session.username);
	res.render('clincian/glucose.hbs', { clinician: get_clinician.toJSON() });
}

// load patient dashboard
const loadDashboard = async (req,res)=> {
	let get_clinician = await get_clinician_id(req.session.username);
	let patient_list = await get_patient_list(get_clinician);
	
	// combine patient threshold and daily patient's daily data
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
	
	// render clincian dashboard
    res.render("clincian/dashboard.hbs", {
      clinician: get_clinician.toJSON(),
      patients: {patient} ,
    });
}


// function to implement to check clincian login request
const clincianLogin = async (req,res) => {
	if(req.session.loggedIn === true){
		res.redirect("/")
	}
	const {username, password} = req.body;
	
	// check if clincian is in database
	const has_user = await clinician_authorization(username, password);
	if(has_user){
		req.session.loggedIn = true;
		req.session.username = username;
        req.session.isClinician = true;
		res.redirect("/clinician/dashboard")

	} else {
		req.session.destroy()
		res.redirect("/clinician/login")
	}
}

// logout clinician
const clincianLogout = (req,res) => {
    req.session.destroy()
	res.redirect("/clinician/login")
}

module.exports = {
  clincianLogin,
  clincianLogout,
  isLoggedIn,
  loadDashboard,
  loadGlucosePage
};