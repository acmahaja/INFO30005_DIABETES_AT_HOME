const express = require("express")

const clinicianRouter = express.Router();

const clinicianController = require('../../controller/clinicianController')
const {isLoggedIn} = require('../../controller/clinicianController')


clinicianRouter.get('/dashboard'/*, isLoggedIn*/, clinicianController.loadDashboard)

clinicianRouter.post('/logout', clinicianController.clincianLogout)

clinicianRouter.post('/login', clinicianController.clincianLogin)

clinicianRouter.get('/login', (req,res)=> {
    res.render('clincian/login.hbs')
})

module.exports = clinicianRouter;