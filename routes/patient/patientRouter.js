const express = require("express")

const patientRouter = express.Router();

const patientController = require('../../controller/patientController')
const {isLoggedIn} = require('../../controller/patientController');
const patient = require("../../models/patient");


patientRouter.get("/dashboard", patientController.loadDashboard);
patientRouter.get("/dataentry", patientController.getDataEntryPage);
patientRouter.get("/info", patientController.loadPatientInfoPage);
//glucose data
patientRouter.get("/glucose/month", patientController.loadPatientGlucoseDataPageMonth);
patientRouter.get("/glucose/all", patientController.loadPatientGlucoseDataPageAll);
//insulin data
patientRouter.get("/insulin/month", patientController.loadPatientInsulinDataPageMonth);
patientRouter.get("/insulin/all", patientController.loadPatientInsulinDataPageAll);
//weight data
patientRouter.get("/weight/month", patientController.loadPatientWeightDataPageMonth);
patientRouter.get("/weight/all", patientController.loadPatientWeightDataPageAll);
//steps data
patientRouter.get("/steps/month", patientController.loadPatientStepsDataPageMonth);
patientRouter.get("/steps/all", patientController.loadPatientStepsDataPageAll); 


patientRouter.post("/dataentry/add/save", patientController.postAddHealthData);
patientRouter.post("/dataentry/update/save",patientController.postUpdateHealthData);


patientRouter.post("/login", patientController.patientLogin);

patientRouter.get("/logout", patientController.patientLogout);

patientRouter.get('/login', (req,res)=> {
    res.render('patient/login.hbs')
})

module.exports = patientRouter;