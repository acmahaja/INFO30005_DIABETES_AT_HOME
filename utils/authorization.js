const mongoose = require("mongoose");
const PatientSchema = require("../models/patient");
const ClincianSchema = require("../models/clincian");


// check if patient is in database and password is correct
async function patient_authorization(check_username, check_password) {
  const result = await PatientSchema.findOne({ username: check_username });
  return result === null
    ? false
    : result.username === check_username && result.password === check_password;
}

// check if clinician is in database and password is correct
async function clinician_authorization(check_username, check_password) {
  const result = await ClincianSchema.findOne({ username: check_username });
  return result === null
    ? false
    : result.username === check_username && result.password === check_password;
}

// function to add new patient to the database 
async function add_patient(username, password) {
  const new_patient = new PatientSchema({
    username,
    password,
  });

  await new_patient.save().then(() => console.log("data saved"));
}

// export functions to database
module.exports = { patient_authorization, clinician_authorization };
