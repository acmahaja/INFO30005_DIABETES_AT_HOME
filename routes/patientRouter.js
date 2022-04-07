const express = require('express')

// create our Router object
const patientRouter = express.Router()

// require patient controller
const patientController = require('../controllers/patientController')

patientRouter.get('/homepage', patientController.getPatientMetricSettings)

/*
// add a route to handle the GET request for all demo data
userRouter.get('/', userController.getAllPeopleData)

// add a route to handle the GET request for one data instance
userRouter.get('/:id', userController.getDataById)

// add a new JSON object to the database
userRouter.post('/', userController.insertData)
*/

// export the router
module.exports = patientRouter
