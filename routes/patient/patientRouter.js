const passport = require("passport");
const express = require("express")
const patientRouter = express.Router();

const patientController = require('../../controller/patientController')
const {isLoggedIn} = require('../../controller/patientController');
const patient = require("../../models/patient");

const {   
    isAuthenticatedClinician,
    isAuthenticatedPatient
} = require("../auth");


patientRouter.get("/dashboard", 
        isAuthenticatedPatient,
        patientController.loadDashboard);

patientRouter.get("/dataentry", 
        isAuthenticatedPatient,
        patientController.getDataEntryPage);

patientRouter.get("/info", 
        isAuthenticatedPatient,
        patientController.loadPatientInfoPage);

patientRouter.post("/info",
        isAuthenticatedPatient,
        patientController.postUpdateUserInfo)

//glucose data
patientRouter.get("/glucose/month", 
        isAuthenticatedPatient,
        patientController.loadPatientGlucoseDataPageMonth);

patientRouter.get("/glucose/all", 
        isAuthenticatedPatient,
        patientController.loadPatientGlucoseDataPageAll);

//insulin data
patientRouter.get("/insulin/month", 
        isAuthenticatedPatient,
        patientController.loadPatientInsulinDataPageMonth);

patientRouter.get("/insulin/all", 
        isAuthenticatedPatient,
        patientController.loadPatientInsulinDataPageAll);

//weight data
patientRouter.get("/weight/month", 
        isAuthenticatedPatient,
        patientController.loadPatientWeightDataPageMonth);

patientRouter.get("/weight/all",
        isAuthenticatedPatient,
        patientController.loadPatientWeightDataPageAll);

//steps data
patientRouter.get("/steps/month", 
        isAuthenticatedPatient,
        patientController.loadPatientStepsDataPageMonth);
patientRouter.get("/steps/all", 
        isAuthenticatedPatient,
        patientController.loadPatientStepsDataPageAll); 


patientRouter.post("/dataentry/add/save", 
        isAuthenticatedPatient,
        patientController.postAddHealthData);

patientRouter.post("/dataentry/update/save",        
        isAuthenticatedPatient,
        patientController.postUpdateHealthData);


patientRouter.post("/login", 
    passport.authenticate("patient-local", {
        successRedirect: "/patient/dashboard",
        failureRedirect: "/patient/login"
    })
);


patientRouter.get("/logout", patientController.patientLogout);

patientRouter.get('/login', (req,res)=> {
    res.render('patient/login.hbs')
})

module.exports = patientRouter;