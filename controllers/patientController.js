// connect to Mongoose model
const mongoose = require('mongoose')


// get express-validator, to validate user data in forms
const expressValidator = require('express-validator')


// // link to model
const PatientSettings = require("../models/patient_settings")
const Patient = require("../models/patient")
const HealthDataEntry = require('../models/health_data')

const GLUCOSE_ENUM_TYPE = 'blood_glucose'
const WEIGHT_ENUM_TYPE = 'weight'
const INSULIN_ENUM_TYPE = 'insulin'
const STEPS_ENUM_TYPE = 'steps'


//handle requiest to get patient settings
const getPatientMetricSettings = async (req, res) => {

    try {
              //const patientsettings = await PatientSettings.find().populate("for_patient").findOne({}, {}).lean()

        const this_patient = await Patient.findOne({firstname: "alejandro"}, {}).lean()
        console.log(this_patient)
        const patientsettings = await PatientSettings.findOne({for_patient: this_patient._id}, {}).lean()
        console.log(patientsettings)

        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());   
        var glucoseData = await HealthDataEntry.findOne({
            for_patient: this_patient._id,
            health_type: GLUCOSE_ENUM_TYPE,
            created: {$gte: startOfToday}
        }).lean()
        var insulinData = await HealthDataEntry.findOne({
            for_patient: this_patient._id,
            health_type: INSULIN_ENUM_TYPE,
            created: {$gte: startOfToday}
        }).lean()
        var stepsData = await HealthDataEntry.findOne({
            for_patient: this_patient._id,
            health_type: STEPS_ENUM_TYPE,
            created: {$gte: startOfToday}
        }).lean()
        var weightData = await HealthDataEntry.findOne({
            for_patient: this_patient._id,
            health_type:  WEIGHT_ENUM_TYPE,
            created: {$gte: startOfToday}
        }).lean()

        //console.log(glucoseData)
        // var glucoseEntry = (glucoseData) ? true : false
        // var insulinEntry = (insulinData) ? true : false
        // var stepsEntry = (stepsData) ? true : false
        // var weightEntry = (weightData) ? true : false
        entries = {
            glucose: (glucoseData) ? true : false,
            insulin: (insulinData) ? true : false,
            steps: (stepsData) ? true : false,
            weight: (weightData) ? true : false
        }
        entryTypes = {
            glucose: GLUCOSE_ENUM_TYPE,
            insulin: INSULIN_ENUM_TYPE,
            steps: STEPS_ENUM_TYPE,
            weight: WEIGHT_ENUM_TYPE
        }
        console.log(entries)


        res.render('testhome', {
            "patientsettings": patientsettings, 
            "patient": this_patient, 
            "entry": entries,
            "entrytype": entryTypes
        })
    } catch (err) {
        console.log(err)
    }
}



const postUpdateHealthData = async (req, res) => {
    var this_user = req.body["user_id"]
    var health_type = req.body["health_type"]
    var value = req.body["data_value"]


    var filter = { 
        to_patient: this_user,
        health_type: health_type
    }
    var update = {
        value: value,
        updated: Date.now()
    }
    var options = { sort : {created : -1} }

    prevEntry = await HealthDataEntry.findOne(filter, {}, options).lean()

    await HealthDataEntry.findOneAndUpdate(filter, update, options)
        .then( (res) => { console.log(res) })
        .catch((err) => { console.log(err) })

    updatedEntry = await HealthDataEntry.findOne(filter, {}, options).lean()
    res.render('testpost', {
        "newentry": JSON.stringify(updatedEntry),
        "preventry": JSON.stringify(prevEntry)
    }) 
}

const postAddHealthData = async (req, res) => {
    var this_user = req.body["user_id"]
    var health_type = req.body["health_type"]
    var value = req.body["data_value"]
    const newHealthData = new HealthDataEntry({
        to_patient: this_user,
        health_type: health_type,
        value: value,
        created: Date.now(),
        updated: Date.now()
    })
    console.log(this_user, health_type, value, Date.now())
    await newHealthData.save()
        .then( (res) => { console.log(res) })
        .catch((err) => { console.log(err) })
    newEntry = await HealthDataEntry.findOne({this_patient:this_user, health_type:health_type}, {}, {sort: {created: -1}}).lean()
    res.render('testpost', {"newentry": JSON.stringify(newEntry)}) //req.body["glucose_info"]
}

module.exports = {
    getPatientMetricSettings,
    postAddHealthData,
    postUpdateHealthData
}