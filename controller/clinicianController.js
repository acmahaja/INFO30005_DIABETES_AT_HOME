const clincian = require("../models/clincian");
const { clinician_authorization} = require("../utils/authorization")
const { get_patient_list, get_clinician_id } = require("../utils/utils")


const isLoggedIn = (req,res,next)=>{
	if(req.session.loggedIn && req.session.username != null && req.session.isClinician){
		next();
	} else {
		res.redirect('login');
	}
}

const loadDashboard = async (req,res)=> {
	const get_clinician = await get_clinician_id(req.session.username);
	const patient_list = await get_patient_list(get_clinician)
	console.log(patient_list);
    res.render('clincian/dashboard.hbs', {clinician: get_clinician.toJSON(), patients: {patient_list}})
}

const clincianLogin = async (req,res) => {
	if(req.session.loggedIn === true){
		res.redirect("/")
	}
	const {username, password} = req.body;
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

const clincianLogout = (req,res) => {
	console.log("logging out person");
    req.session.destroy()
	res.redirect("/clinician/login")
}

module.exports = {
    clincianLogin,
    clincianLogout,
	isLoggedIn,
	loadDashboard
}