const express = require('express')
const { default: mongoose } = require('mongoose')

// create our Router object
const patientRouter = express.Router()

// require patient controller
const patientController = require('../controllers/patientController')

patientRouter.get('/homepage', patientController.getPatientMetricSettings)

patientRouter.post('/data/add', patientController.postAddHealthData)

patientRouter.post('/data/update', patientController.postUpdateHealthData)

patientRouter.get('/disconnect', (req, res) => {mongoose.disconnect(); res.send("disconnected mongodb")})

// export the router
module.exports = patientRouter
