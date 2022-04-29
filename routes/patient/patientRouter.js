const express = require("express")

const patientRouter = express.Router();

const patientController = require('../../controller/patientController')
const {isLoggedIn} = require('../../controller/patientController');
const patient = require("../../models/patient");

//patient dashboard
patientRouter.get("/dashboard", patientController.loadDashboard);

//data entry page
patientRouter.get("/dataentry", patientController.getDataEntryPage);

//post for adding data
patientRouter.post("/dataentry/add/save", patientController.postAddHealthData);
//post for updating data
patientRouter.post("/dataentry/update/save",patientController.postUpdateHealthData);

//patient login post
patientRouter.post("/login", patientController.patientLogin);
//patient logout
patientRouter.get("/logout", patientController.patientLogout);
//patient login get
patientRouter.get('/login', (req,res)=> {
    res.render('patient/login.hbs')
})

module.exports = patientRouter;