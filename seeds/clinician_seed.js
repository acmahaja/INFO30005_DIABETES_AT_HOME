const {first_names, last_names} = require("./seedHelpers")
const ClincianSchema = require("../models/clincian")

const mongoose = require("mongoose");
const { findById } = require("../models/clincian");

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

const deleteClinician = async () => {
    const entries = await ClincianSchema.find({})
    entries.forEach(
        async (entry) => await ClincianSchema.findByIdAndRemove(entry.id)
        )
    console.log("cleared clinician db")
}

const createChris = async () => {
    const entry = await ClincianSchema({
        "username": "chrispatt",
        "password": "password",
        "firstname": "chris",
        "middlename": "",
        "lastname": "patt",
        "dob": '1993-09-28',
        "email": "chris.patt@email.com",
        "date_joined": '2021-04-11'
    })
    try {
      await entry.save().then(()=>console.log("saved chris"))
    } catch (error) {
        console.log("Something Broke");
    }
}

const generateClinician = async () => {
    for (let int = 0; int < 50; int++) {
        const firstnameIndex = Math.floor(Math.random()*first_names.length)
        const lastnameIndex = Math.floor(Math.random() *last_names.length)       
        if(ClincianSchema.find({"username": first_names[firstnameIndex].toLowerCase() + "" + last_names[lastnameIndex].toLowerCase()}) ==null)
            return;
        const entry = await ClincianSchema({
           "username": first_names[firstnameIndex].toLowerCase() + "" + last_names[lastnameIndex].toLowerCase(),
           "password": "password",
           "firstname": first_names[firstnameIndex],
           "middlename": "",
           "lastname": last_names[lastnameIndex],
           "dob": (1980 + Math.floor(Math.random() * 42)) + "-" + Math.floor(Math.random() * 12) + "-" + Math.floor(Math.random() * 28),
           "email": first_names[firstnameIndex].toLowerCase() + "." + last_names[lastnameIndex].toLowerCase() + "@email.com",
           "date_joined": '2021-04-11'
       })
        try {
           await entry.save()
        } catch (error) {
            continue;
        }
   }
}


deleteClinician()
    .then(()=> {createChris()})
    .then(() => { generateClinician()})

