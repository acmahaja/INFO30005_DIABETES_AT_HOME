const auth = require("../utils/authorization")


const clincianLogin = async (req,res) => {
	if(req.session.loggedIn === true){
		res.redirect("/")
	}
	const {username, password} = req.body
	const has_user = await auth.clinician_authorization(username, password);
	if(has_user){
		req.session.loggedIn = true;
		req.session.username = username;
        req.session.isClinician = true;
		res.redirect("/clincian/dashboard")

	} else {
		req.session.destroy()
		res.redirect("/clincian/login")
	}
}

const clincianLogout = (req,res) => {
    req.session.destroy()
	res.redirect("/")
}

module.exports = {
    clincianLogin,
    clincianLogout
}