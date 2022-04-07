// connect to Mongoose model
const mongoose = require('mongoose')
const PatientSettings = require("../models/patient_settings")
const Patient = require("../models/patient")

// get express-validator, to validate user data in forms
const expressValidator = require('express-validator')


// // link to model
// const HealthDataEntry = require('../models/health_data')
// const Patient = require('../models/patient')
// const PatientSettings = require('../models/patient_settings')


//handle requiest to get patient settings
const getPatientMetricSettings = async (req, res) => {

    //get patient by name, then connect to get for_patienr?
    //PatientSettings.find(data => data.for_patient === req.params.id)
    try {
        //const patientsettings = await PatientSettings.findOne({firstname: "alejandro"})
        //const patientsettings = await PatientSettings.find().populate("for_patient").findOne({"for_patient.firstname": "gonzalo"}, {}).lean()
        //const patientsettings = await PatientSettings.find().populate("for_patient").findOne({}, {}).lean()
        // const patientsettings = await PatientSettings.find().populate({
        //    path: "for_patient",
        //     match: {
        //         'firstname': "alejandro"
        //     }}).lean()
        //const patientsettings = await PatientSettings.findOne()

        const this_patient = await Patient.findOne({firstname: "alejandro"}, {}).lean()
        console.log(this_patient)
        const patientsettings = await PatientSettings.findOne({for_patient: this_patient._id}, {}).lean()
        console.log(patientsettings)
        res.render('testhome', {"patientsettings": patientsettings})
    } catch (err) {
        console.log(err)
    }
}

/*
// handle request to get all data
const getAllPeopleData = (req, res) => {
    res.render('allData.hbs', {data: peopleData}) // send data to browser
}

// handle request to get one data instance
const getDataById = (req, res) => {
    // search the database by ID
    const data = peopleData.find(data => data.id === req.params.id)

    // return data if this ID exists
    if (data) {
        res.render('oneData.hbs', {oneItem: data})
    } else {
        // You can decide what to do if the data is not found.
        // Currently, an empty list will be returned.
        res.send([])
    }
}

// add an object to the database
const insertData = (req,res) => {
    // push the incoming JSON object to the array. (Note, we are not validating the data - should fix this later.)
    console.log(req.body)
    peopleData.push(req.body)
    // return the updated database
    res.send(peopleData)
}

module.exports = {
    getAllPeopleData,
    getDataById,
    insertData
}

*/
module.exports = {
    getPatientMetricSettings
}