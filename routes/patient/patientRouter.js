const express = require("express")

const patientRouter = express.Router();

const patientController = require('../../controller/patientController')
const {isLoggedIn} = require('../../controller/patientController')


patientRouter.post("/login", patientController.patientLogin);

patientRouter.get('/login', (req,res)=> {
    res.render('patient/login.hbs')
})

module.exports = patientRouter;