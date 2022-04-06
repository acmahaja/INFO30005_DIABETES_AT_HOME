const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

app.engine(
  "hbs",
  exphbs.engine({
    defaultlayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/clincian", (req, res) => {
  res.send("Clinician Page");
});

app.get("/patient", (req, res) => {
  res.send("Patient Page");
});

app.get("/", (req, res) => {
  res.send("Welcome to Diabetes at Home");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
