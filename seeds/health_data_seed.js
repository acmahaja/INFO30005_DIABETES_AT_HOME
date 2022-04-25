const PatientSchema = require("../models/clincian")
const healthDataSchema = require("../models/health_data")

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