const express = require('express')
const { default: mongoose } = require('mongoose')

// create our Router object
const patientRouter = express.Router()

// require patient controller
const patientController = require('../controllers/patientController')

patientRouter.get('/homepage', patientController.getPatientMetricSettings)
patientRouter.get('/dataentry', patientController.getDataEntryPage)
patientRouter.post('/dataentry/add', patientController.postAddDataPage)
patientRouter.post('/dataentry/update', patientController.postUpdateDataPage)
patientRouter.post('/dataentry/add/save', patientController.postAddHealthData)
patientRouter.post('/dataentry/update/save', patientController.postUpdateHealthData)

patientRouter.post('/dataentry/update', patientController.postUpdateHealthData)

//temp pages
patientRouter.get('/glucose', (req, res) => {res.send("<h1>Glucose data page<h1> <a href='/patient/homepage'> Go back to homepage </a>")})
patientRouter.get('/insulin', (req, res) => {res.send("<h1>Insulin data page<h1> <a href='/patient/homepage'> Go back to homepage </a>")})
patientRouter.get('/weight', (req, res) => {res.send("<h1>Weight data page<h1> <a href='/patient/homepage'> Go back to homepage </a>")})
patientRouter.get('/steps', (req, res) => {res.send("<h1>Steps data page<h1> <a href='/patient/homepage'> Go back to homepage </a>")})




// export the router
module.exports = patientRouter
