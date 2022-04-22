const express = require("express")

const clincianRouter = express.Router();

const clinicianController = require('../../controller/clinicianController')


clincianRouter.post('/login', clinicianController.clincianLogin)


module.exports = clincianRouter;