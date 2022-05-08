const express = require("express");

const clinicianRouter = express.Router();

const clinicianController = require("../../controller/clinicianController");
const { isLoggedIn } = require("../../controller/clinicianController");


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
