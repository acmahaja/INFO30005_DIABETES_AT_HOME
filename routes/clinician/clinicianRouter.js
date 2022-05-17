const express = require("express");

const clinicianRouter = express.Router();

const clinicianController = require("../../controller/clinicianController");
const clinicianControllerData = require("../../controller/clinicianControllerData");
const clinicianControllerNotes = require("../../controller/clinicianControllerNotes");
const clinicianControllerMessages = require("../../controller/clinicianControllerMessage");
const clinicianControllerInfo = require("../../controller/clinicianControllerInfo");

const { isLoggedIn } = require("../../controller/clinicianController");


clinicianRouter.put(
  "/:PatientID/info/settings",
  isLoggedIn,
  clinicianControllerInfo.updatePatientInfo
);

clinicianRouter.get(
  "/:PatientID/info/",
  isLoggedIn,
  clinicianControllerInfo.loadPatientInfo
);


clinicianRouter.get(
  "/:PatientID/messages/new",
  isLoggedIn,
  clinicianControllerMessages.loadPatientMessageForm
);

clinicianRouter.post(
  "/:PatientID/messages/new",
  isLoggedIn,
  clinicianControllerMessages.savePatientMessageForm
);

clinicianRouter.put(
  "/:PatientID/messages/:MessageID/edit",
  isLoggedIn,
  clinicianControllerMessages.updatePatientMessageForm
);

clinicianRouter.get(
  "/:PatientID/messages/:MessageID/edit",
  isLoggedIn,
  clinicianControllerMessages.editPatientMessageForm
);


clinicianRouter.get(
  "/:PatientID/messages/:MessageID",
  isLoggedIn,
  clinicianControllerMessages.showPatientMessage
);

clinicianRouter.get(
  "/:PatientID/messages/",
  isLoggedIn,
  clinicianControllerMessages.loadPatientMessage
);


clinicianRouter.post(
  "/:PatientID/notes/new",
  isLoggedIn,
  clinicianControllerNotes.savePatientNotesForm
);

clinicianRouter.get(
  "/:PatientID/notes/new",
  isLoggedIn,
  clinicianControllerNotes.loadPatientNotesForm
);

clinicianRouter.get(
  "/:PatientID/notes/:NoteID",
  isLoggedIn,
  clinicianControllerNotes.showPatientNote
);

clinicianRouter.get(
  "/:PatientID/notes/",
  isLoggedIn,
  clinicianControllerNotes.loadPatientNotes
);

clinicianRouter.get(
  "/:PatientID/glucose/",
  isLoggedIn,
  clinicianControllerData.loadGlucosePage
);

clinicianRouter.get(
  "/:PatientID/glucose/",
  isLoggedIn,
  clinicianControllerData.loadGlucosePage
);

clinicianRouter.get(
  "/:PatientID/glucose",
  isLoggedIn,
  clinicianControllerData.loadGlucosePage
);

clinicianRouter.get(
  "/:PatientID/info",
  isLoggedIn,
  clinicianController.renderPatientInfo
);


clinicianRouter.get(
  "/:PatientID/info",
  isLoggedIn,
  clinicianController.renderPatientInfo
);

clinicianRouter.post(
  "/register",
  isLoggedIn,
  clinicianController.registerPatient
);

clinicianRouter.get(
  "/register",
  isLoggedIn,
  clinicianController.renderRegisterPatient
);

clinicianRouter.get(
  "/comments",
  isLoggedIn,
  clinicianController.clincianComments
);

clinicianRouter.get(
  "/dashboard",
  isLoggedIn,
  clinicianController.loadDashboard
);

clinicianRouter.get("/logout", clinicianController.clincianLogout);

clinicianRouter.post("/login", clinicianController.clincianLogin);

clinicianRouter.get("/login", (req, res) => {
  res.render("clincian/login.hbs");
});

module.exports = clinicianRouter;
