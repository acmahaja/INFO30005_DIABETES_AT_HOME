const PatientSchema = require("../models/patient")
const healthDataSchema = require("../models/health_data")
const {generate_random_date} = require("../utils/utils")

const mongoose = require("mongoose");
const { all } = require("express/lib/application");

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


const createHealthData = async () => {
    const all_patients = await PatientSchema.find({});
    all_patients.forEach(async (patient)=>{
        for (let i = 0; i < 500; i++) {
            const new_data = new healthDataSchema({
                "patient_id": patient._id,
                "health_type": 'blood_glucose',
                "value": Math.random()*80+140,
                "created": generate_random_date(new Date(2012, 0, 1), new Date(Date.now()))
            })
            await new_data.save()
        }

    })

}

const deleteHealth = async () => {
    const entries = await healthDataSchema.find({})
    entries.forEach(
        async (entry) => await healthDataSchema.findByIdAndRemove(entry.id)
        )
    
}

deleteHealth().then(()=> {console.log("cleared patient db")})
    .then(() => createHealthData().then(()=> {console.log("generated data");}));
