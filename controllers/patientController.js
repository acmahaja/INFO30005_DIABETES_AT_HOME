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
const entryTypes = {
    glucose: GLUCOSE_ENUM_TYPE,
    insulin: INSULIN_ENUM_TYPE,
    steps: STEPS_ENUM_TYPE,
    weight: WEIGHT_ENUM_TYPE
}

const PATIENT_NAME = "alejandro"




const getDailyHealthData = async (patientId) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());   

    var glucoseData = await HealthDataEntry.findOne({
        for_patient: patientId,
        health_type: GLUCOSE_ENUM_TYPE,
        created: {$gte: startOfToday}
    }).lean()
    var insulinData = await HealthDataEntry.findOne({
        for_patient: patientId,
        health_type: INSULIN_ENUM_TYPE,
        created: {$gte: startOfToday}
    }).lean()
    var stepsData = await HealthDataEntry.findOne({
        for_patient: patientId,
        health_type: STEPS_ENUM_TYPE,
        created: {$gte: startOfToday}
    }).lean()
    var weightData = await HealthDataEntry.findOne({
        for_patient: patientId,
        health_type:  WEIGHT_ENUM_TYPE,
        created: {$gte: startOfToday}
    }).lean()

    // entries = {
    //     glucose: (glucoseData) ? true : false,
    //     insulin: (insulinData) ? true : false,
    //     steps: (stepsData) ? true : false,
    //     weight: (weightData) ? true : false
    // }

    entries = {
        glucose: glucoseData,
        insulin: insulinData,
        steps: stepsData,
        weight: weightData
    }
    return entries
}


const getHistoricalData = async (thisPatientId, nDays, metricType = "all") => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());  
    const NUMBER_OF_DAYS = nDays  //set number of days in historical data
    PastNDays = new Date()
    PastNDays.setDate(startOfToday.getDate() - NUMBER_OF_DAYS)
    var historical_data;
    if (metricType == GLUCOSE_ENUM_TYPE){
        historical_data = await HealthDataEntry.find({
            for_patient: thisPatientId,
            health_type: GLUCOSE_ENUM_TYPE,
            updated: {$gte: PastNDays}
        }).lean()
    }
    else if (metricType == INSULIN_ENUM_TYPE) {
        historical_data = await HealthDataEntry.find({
            for_patient: thisPatientId,
            health_type: INSULIN_ENUM_TYPE,
            updated: {$gte: PastNDays}
        }).lean()
    }
    else if (metricType == STEPS_ENUM_TYPE) {
        historical_data = await HealthDataEntry.find({
            for_patient: thisPatientId,
            health_type: STEPS_ENUM_TYPE,
            updated: {$gte: PastNDays}
        }).lean()
    }
    else if (metricType == WEIGHT_ENUM_TYPE) {
        historical_data = await HealthDataEntry.find({
            for_patient: thisPatientId,
            health_type: WEIGHT_ENUM_TYPE,
            updated: {$gte: PastNDays}
        }).lean()
    }
    else {
        historical_data = await HealthDataEntry.find({
            for_patient: thisPatientId,
            updated: {$gte: PastNDays}
        }).lean()
    }
    console.log(historical_data)
    
    healthEntryTS = {}
    for (var i=0; i<NUMBER_OF_DAYS; i++){
        d = new Date()
        d.setDate(startOfToday.getDate() - i)
        healthEntryTS[d.toDateString()] = {index: i, date: d.toDateString()}
        console.log(d.toDateString())
    }
    for (const e of historical_data){
        console.log(e.updated)
        console.log(e.health_type)
        console.log(e.value)
        d = e.updated.toDateString()
        if (d in healthEntryTS)
            healthEntryTS[d][e.health_type] = {value: e.value, comment: e.comment}
            // healthEntryTS[d][e.health_type] = e.value
    }
    // console.log(JSON.stringify(healthEntryTS))
    // console.log(Object.entries(healthEntryTS))
    //healthEntryArray = Object.entries(healthEntryTS)
    healthEntryArray = Object.values(healthEntryTS)
    return healthEntryArray
}

//handle requiest to get patient settings
const getPatientMetricSettings = async (req, res) => {

    try {
              //const patientsettings = await PatientSettings.find().populate("for_patient").findOne({}, {}).lean()

        const this_patient = await Patient.findOne({firstname: PATIENT_NAME}, {}).lean()
        console.log(this_patient)
        const patientsettings = await PatientSettings.findOne({for_patient: this_patient._id}, {}).lean()
        console.log(patientsettings)

        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());   
        // var glucoseData = await HealthDataEntry.findOne({
        //     for_patient: this_patient._id,
        //     health_type: GLUCOSE_ENUM_TYPE,
        //     created: {$gte: startOfToday}
        // }).lean()
        // var insulinData = await HealthDataEntry.findOne({
        //     for_patient: this_patient._id,
        //     health_type: INSULIN_ENUM_TYPE,
        //     created: {$gte: startOfToday}
        // }).lean()
        // var stepsData = await HealthDataEntry.findOne({
        //     for_patient: this_patient._id,
        //     health_type: STEPS_ENUM_TYPE,
        //     created: {$gte: startOfToday}
        // }).lean()
        // var weightData = await HealthDataEntry.findOne({
        //     for_patient: this_patient._id,
        //     health_type:  WEIGHT_ENUM_TYPE,
        //     created: {$gte: startOfToday}
        // }).lean()

        // entries = {
        //     glucose: (glucoseData) ? true : false,
        //     insulin: (insulinData) ? true : false,
        //     steps: (stepsData) ? true : false,
        //     weight: (weightData) ? true : false
        // }

        entries = await getDailyHealthData(this_patient._id)

        // // GET HISTORICAL DATA
        const NUMBER_OF_DAYS = 10  //set number of days in historical data
        // PastTenDays = new Date()
        // PastTenDays.setDate(startOfToday.getDate() - NUMBER_OF_DAYS)
        // const historical_data = await HealthDataEntry.find({
        //     for_patient: this_patient._id,
        //     updated: {$gte: PastTenDays}
        // }).lean()
        // console.log(historical_data)
        
        // healthEntryTS = {}
        // for (var i=0; i<NUMBER_OF_DAYS; i++){
        //     d = new Date()
        //     d.setDate(startOfToday.getDate() - i)
        //     healthEntryTS[d.toDateString()] = {index: i, date: d.toDateString()}
        //     console.log(d.toDateString())
        // }
        // for (const e of historical_data){
        //     console.log(e.updated)
        //     console.log(e.health_type)
        //     console.log(e.value)
        //     d = e.updated.toDateString()
        //     if (d in healthEntryTS)
        //         healthEntryTS[d][e.health_type] = e.value
        // }
        // healthEntryArray = Object.values(healthEntryTS)
        healthEntryArray = await getHistoricalData(this_patient._id, NUMBER_OF_DAYS)
        console.log(healthEntryArray)
        //console.log(glucoseData)
        // var glucoseEntry = (glucoseData) ? true : false
        // var insulinEntry = (insulinData) ? true : false
        // var stepsEntry = (stepsData) ? true : false
        // var weightEntry = (weightData) ? true : false
        
        //get entries to know if Add or Update each daily data entry

        // entryTypes = {
        //     glucose: GLUCOSE_ENUM_TYPE,
        //     insulin: INSULIN_ENUM_TYPE,
        //     steps: STEPS_ENUM_TYPE,
        //     weight: WEIGHT_ENUM_TYPE
        // }
        console.log(entries)

        res.render('testhome', {
            "patientsettings": patientsettings, 
            "patient": this_patient, 
            "entry": entries,
            "entrytypes": entryTypes,
            "historicaldata": healthEntryArray
        })
    } catch (err) {
        console.log(err)
    }
}

const getGlucoseDataPage = async (req, res) => {
    const METRIC_TYPE = GLUCOSE_ENUM_TYPE
    const this_patient = await Patient.findOne({firstname: PATIENT_NAME}, {}).lean()
    const NUMBER_OF_DAYS = 16
    healthEntryArray = await getHistoricalData(this_patient._id, NUMBER_OF_DAYS, METRIC_TYPE)
    res.render('glucosedata', {
        entrytypes: entryTypes,
        "historicaldata": healthEntryArray
    })
}

const getInsulinDataPage = async (req, res) => {
    METRIC_TYPE = INSULIN_ENUM_TYPE
    const this_patient = await Patient.findOne({firstname: PATIENT_NAME}, {}).lean()
    const NUMBER_OF_DAYS = 16
    healthEntryArray = await getHistoricalData(this_patient._id, NUMBER_OF_DAYS, METRIC_TYPE)
    res.render('insulindata', {
        entrytypes: entryTypes,
        "historicaldata": healthEntryArray
    })
}

const getStepsDataPage = async (req, res) => {
    METRIC_TYPE = STEPS_ENUM_TYPE
    const this_patient = await Patient.findOne({firstname: PATIENT_NAME}, {}).lean()
    const NUMBER_OF_DAYS = 16
    healthEntryArray = await getHistoricalData(this_patient._id, NUMBER_OF_DAYS, METRIC_TYPE)
    res.render('stepsdata', {
        entrytypes: entryTypes,
        "historicaldata": healthEntryArray
    })
}

const getWeightDataPage = async (req, res) => {
    METRIC_TYPE = WEIGHT_ENUM_TYPE
    const this_patient = await Patient.findOne({firstname: PATIENT_NAME}, {}).lean()
    const NUMBER_OF_DAYS = 16
    healthEntryArray = await getHistoricalData(this_patient._id, NUMBER_OF_DAYS, METRIC_TYPE)
    res.render('weightdata', {
        entrytypes: entryTypes,
        "historicaldata": healthEntryArray
    })
}

const getDataEntryPage = async (req, res) => {
    const this_patient = await Patient.findOne({firstname: PATIENT_NAME}, {}).lean()
    const patientsettings = await PatientSettings.findOne({for_patient: this_patient._id}, {}).lean()
    entries = await getDailyHealthData(this_patient._id)
    console.log(entries)
    res.render('dataentry', {
        "patient": this_patient,
        "patientsettings": patientsettings,
        "entry": entries,
        "entrytypes": entryTypes
    })
}

const postAddDataPage = async (req, res) => {
    var this_patient = req.body["user_id"]
    var health_type = req.body["health_type"]
    console.log(health_type)
    console.log(this_patient)
    res.render('addentry', {
        "patientid": this_patient,
        "entrytype": health_type,
        "entrytypes": entryTypes
    })
}

const postUpdateDataPage = async (req, res) => {
    var this_patient = req.body["user_id"]
    var health_type = req.body["health_type"]
    console.log(health_type)
    console.log(this_patient)
    res.render('updateentry', {
        "patientid": this_patient,
        "entrytype": health_type,

    })
}


const postUpdateHealthData = async (req, res) => {
    var this_user = req.body["user_id"]
    var health_type = req.body["health_type"]
    var value = req.body["data_input"]
    var comment = req.body["text_input"]


    var filter = { 
        to_patient: this_user,
        health_type: health_type
    }
    var update = {
        value: value,
        comment: comment,
        updated: Date.now()
    }
    var options = { sort : {created : -1} }

    prevEntry = await HealthDataEntry.findOne(filter, {}, options).lean()

    await HealthDataEntry.findOneAndUpdate(filter, update, options)
        .then( (res) => { console.log(res) })
        .catch((err) => { console.log(err) })

    updatedEntry = await HealthDataEntry.findOne(filter, {}, options).lean()
    //res.redirect('back')
    res.redirect('/patient/dataentry')
    // res.render('testpost', {
    //      "newentry": JSON.stringify(updatedEntry),
    //      "preventry": JSON.stringify(prevEntry)
    // }) 
}

// const postDataEntry = async

const postAddHealthData = async (req, res) => {
    var this_user = req.body["user_id"]
    var health_type = req.body["health_type"]
    var value = req.body["data_input"]
    var comment = req.body["text_input"]

    const newHealthData = new HealthDataEntry({
        to_patient: this_user,
        health_type: health_type,
        value: value,
        comment: comment,
        created: Date.now(),
        updated: Date.now()
    })
    console.log(this_user, health_type, value, comment, Date.now())
    await newHealthData.save()
        .then( (res) => { console.log(res) })
        .catch((err) => { console.log(err) })
    newEntry = await HealthDataEntry.findOne({this_patient:this_user, health_type:health_type}, {}, {sort: {created: -1}}).lean()
    // res.render('testpost', {"newentry": JSON.stringify(newEntry)}) //req.body["glucose_info"]
    // res.redirect('back')
    res.redirect('/patient/dataentry')
}

module.exports = {
    getPatientMetricSettings,
    getDataEntryPage,
    getGlucoseDataPage,
    getInsulinDataPage,
    getStepsDataPage,
    getWeightDataPage,
    postAddDataPage,
    postUpdateDataPage,
    postAddHealthData,
    postAddHealthData,
    postUpdateHealthData
}