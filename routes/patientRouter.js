const express = require('express')

// create our Router object
const patientRouter = express.Router()

// require patient controller
const patientController = require('../controllers/patientController')

patientRouter.get('/homepage', patientController.getPatientMetricSettings)


// export the router
module.exports = patientRouter
