const PatientSchema = require("../models/patient")
const ClincianSchema = require("../models/clincian")


async function get_patient_list(clincian){
    if(clincian == null){
        result = await PatientSchema.find({})
            .select('username firstname middlename lastname dob email date_joined bio image')
    } else {
        result = await PatientSchema.find({"assigned_clincian": String(clincian._id) })
            .select('username firstname middlename lastname dob email date_joined bio image')
    }
    return result;
}

async function get_clinician_id(username){
    const result = await ClincianSchema.findOne({"username": username})
        .select('username firstname middlename lastname dob email date_joined bio image')
    return result;
}

module.exports = {get_patient_list, get_clinician_id}