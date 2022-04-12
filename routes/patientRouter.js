const express = require('express')
const { default: mongoose } = require('mongoose')

// create our Router object
const patientRouter = express.Router()

// require patient controller
const patientController = require('../controllers/patientController')

patientRouter.get('/homepage', patientController.getPatientMetricSettings)

patientRouter.post('/data/add', patientController.postAddHealthData)

patientRouter.post('/data/update', patientController.postUpdateHealthData)

//temp pages
patientRouter.get('/glucose', (req, res) => {res.send("<h1>Glucose data page<h1> <a href='/patient/homepage'> Go back to homepage </a>")})
patientRouter.get('/insulin', (req, res) => {res.send("<h1>Insulin data page<h1> <a href='/patient/homepage'> Go back to homepage </a>")})
patientRouter.get('/weight', (req, res) => {res.send("<h1>Weight data page<h1> <a href='/patient/homepage'> Go back to homepage </a>")})
patientRouter.get('/steps', (req, res) => {res.send("<h1>Steps data page<h1> <a href='/patient/homepage'> Go back to homepage </a>")})


//not sure if this does anything useful idk
patientRouter.get('/disconnect', (req, res) => {mongoose.disconnect(); res.send("disconnected mongodb")})


// export the router
module.exports = patientRouter
