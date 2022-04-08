// connect to Mongoose model
const mongoose = require('mongoose')


// get express-validator, to validate user data in forms
const expressValidator = require('express-validator')


// // link to model
const PatientSettings = require("../models/patient_settings")
const Patient = require("../models/patient")
const HealthDataEntry = require('../models/health_data')



//handle requiest to get patient settings
const getPatientMetricSettings = async (req, res) => {

    try {
              //const patientsettings = await PatientSettings.find().populate("for_patient").findOne({}, {}).lean()

        const this_patient = await Patient.findOne({firstname: "alejandro"}, {}).lean()
        console.log(this_patient)
        const patientsettings = await PatientSettings.findOne({for_patient: this_patient._id}, {}).lean()
        console.log(patientsettings)
        res.render('testhome', {"patientsettings": patientsettings, "patient": this_patient})
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getPatientMetricSettings
}