const mongoose = require("mongoose");
const PatientSchema = require("../models/patient")
const ClincianSchema = require("../models/clincian")

async function basic_authorization(check_username, check_password){
    const result = await PatientSchema.findOne({username: check_username})
    return result === null ? false : result.username === check_username && result.password === check_password
}

async function clinician_authorization(check_username, check_password){
    const result = await ClincianSchema.findOne({username: check_username})
    return result === null ? false : result.username === check_username && result.password === check_password
}



async function add_patient(username, password) {
    const new_patient = new PatientSchema(
        {
            username, 
            password
        }
    )

    await new_patient.save().then(()=> console.log("data saved"));z
}

module.exports = {basic_authorization, clinician_authorization}