const {first_names, last_names} = require("./seedHelpers")
const PatientSchema = require("../models/patient")
const ClinicianSchema = require("../models/clincian")

const mongoose = require("mongoose");
console.warn("Dev Environment: " + process.env.NODE_ENV);

mongoose.connect(
    process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : 'mongodb://localhost:27017/diabetes-at-home',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'diabetes-at-home'
    }
).then(() => console.log(`Mongo connected to port ${db.host}:${db.port}`))

const db = mongoose.connection.on('error', err => {
    console.error(err)
    process.exit(1)
})

const deletePatients = async () => {
    const entries = await PatientSchema.find({})
    entries.forEach(
        async (entry) => await PatientSchema.findByIdAndRemove(entry.id)
        )
    console.log("cleared patient db")
}

const createPat = async () => {
    const findChris = await ClinicianSchema.findOne({"username": "chrispatt"})
    const entry = await PatientSchema({
        "username": "patstuart",
        "password": "password",
        "firstname": "pat",
        "middlename": "",
        "lastname": "stuart",
        "dob": '2000-03-28',
        "email": "pat.stuart@email.com",
        "date_joined": '2021-11-11',
        "assigned_clincian": findChris._id
    })
    try {
      await entry.save().then(()=>console.log("saved pat \n"))
    } catch (error) {
        console.log("Something Broke");
    }
}

const generateClinician = async () => {

    await ClinicianSchema.find({})
        .then(async (allClinicians)=> {


    for (let int = 0; int < 500; int++) {
        const firstnameIndex = Math.floor(Math.random()*first_names.length)
        const lastnameIndex = Math.floor(Math.random() *last_names.length)      
        if(PatientSchema.find({"username": first_names[firstnameIndex].toLowerCase() + "" + last_names[lastnameIndex].toLowerCase()}) ==null)
            return;
        const entry = await PatientSchema({
           "username": first_names[firstnameIndex].toLowerCase() + "" + last_names[lastnameIndex].toLowerCase(),
           "password": "password",
           "firstname": first_names[firstnameIndex],
           "middlename": "",
           "lastname": last_names[lastnameIndex],
           "dob": (1980 + Math.floor(Math.random() * 42)) + "-" + Math.floor(Math.random() * 12) + "-" + Math.floor(Math.random() * 28),
           "email": first_names[firstnameIndex].toLowerCase() + "." + last_names[lastnameIndex].toLowerCase() + "@email.com",
           "date_joined": '2021-04-11',
           "assigned_clincian": allClinicians[Math.floor(Math.random()*allClinicians.length)]._id
       })
        try {
           await entry.save()
        } catch (error) {
            continue;
        }
        
    }
    })
}


deletePatients()
    .then(()=> {createPat()})
    .then(() => { generateClinician()})

