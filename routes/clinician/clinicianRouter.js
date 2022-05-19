const passport = require("passport");
const express = require("express");
const clinicianRouter = express.Router();

const clinicianController = require("../../controller/clinicianController");
const clinicianControllerData = require("../../controller/clinicianControllerData");
const clinicianControllerNotes = require("../../controller/clinicianControllerNotes");
const clinicianControllerMessages = require("../../controller/clinicianControllerMessage");
const clinicianControllerInfo = require("../../controller/clinicianControllerInfo");

const { 
  isAuthenticatedClinician,
  isAuthenticatedPatient
       } = require("../auth");

clinicianRouter.put(
  "/:PatientID/info/settings",
  isAuthenticatedClinician,
  clinicianControllerInfo.updatePatientInfo
);

clinicianRouter.put(
  "/:PatientID/info/:Type/edit",
  isAuthenticatedClinician,
  clinicianControllerInfo.updatePatientThreshold
);

clinicianRouter.get(
  "/:PatientID/info/:Type",
  isAuthenticatedClinician,
  clinicianControllerInfo.editPatientThreshold
);

clinicianRouter.get(
  "/:PatientID/info/",
  isAuthenticatedClinician,
  clinicianControllerInfo.loadPatientInfo
);

clinicianRouter.get(
  "/:PatientID/messages/new",
  isAuthenticatedClinician,
  clinicianControllerMessages.loadPatientMessageForm
);

clinicianRouter.post(
  "/:PatientID/messages/new",
  isAuthenticatedClinician,
  clinicianControllerMessages.savePatientMessageForm
);

clinicianRouter.put(
  "/:PatientID/messages/:MessageID/edit",
  isAuthenticatedClinician,
  clinicianControllerMessages.updatePatientMessageForm
);

clinicianRouter.get(
  "/:PatientID/messages/:MessageID/edit",
  isAuthenticatedClinician,
  clinicianControllerMessages.editPatientMessageForm
);

clinicianRouter.get(
  "/:PatientID/messages/:MessageID",
  isAuthenticatedClinician,
  clinicianControllerMessages.showPatientMessage
);

clinicianRouter.get(
  "/:PatientID/messages/",
  isAuthenticatedClinician,
  clinicianControllerMessages.loadPatientMessage
);

clinicianRouter.post(
  "/:PatientID/notes/new",
  isAuthenticatedClinician,
  clinicianControllerNotes.savePatientNotesForm
);

clinicianRouter.get(
  "/:PatientID/notes/new",
  isAuthenticatedClinician,
  clinicianControllerNotes.loadPatientNotesForm
);

clinicianRouter.get(
  "/:PatientID/notes/:NoteID",
  isAuthenticatedClinician,
  clinicianControllerNotes.showPatientNote
);

clinicianRouter.get(
  "/:PatientID/notes/",
  isAuthenticatedClinician,
  clinicianControllerNotes.loadPatientNotes
);

clinicianRouter.get(
  "/:PatientID/data/:Type",
  isAuthenticatedClinician,
  clinicianControllerData.loadSpecificData
);

clinicianRouter.get(
  "/:PatientID/data",
  isAuthenticatedClinician,
  clinicianControllerData.loadDataPage
);

clinicianRouter.post(
  "/register",
  isAuthenticatedClinician,
  clinicianController.registerPatient
);

clinicianRouter.get(
  "/register",
  isAuthenticatedClinician,
  clinicianController.renderRegisterPatient
);

clinicianRouter.get(
  "/comments",
  isAuthenticatedClinician,
  clinicianController.clincianComments
);

clinicianRouter.get(
  "/dashboard",
  isAuthenticatedClinician,
  clinicianController.loadDashboard
);

clinicianRouter.get("/logout", clinicianController.clincianLogout);

clinicianRouter.post(
  "/login",
  passport.authenticate("clinician-local", {
    successRedirect: "/clinician/dashboard",
    failureRedirect: "/clinician/login",
  })
);

clinicianRouter.get("/login", (req, res) => {
  res.render("clincian/login.hbs");
});

module.exports = clinicianRouter;
