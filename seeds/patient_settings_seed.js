const PatientSchema = require("../models/patient");
const patientSettingsSchema = require("../models/patient_settings");

const mongoose = require("mongoose");
const { all } = require("express/lib/application");

console.warn("Dev Environment: " + process.env.NODE_ENV);

mongoose
  .connect(
    "mongodb+srv://admin:healthy@cluster0.fz5ya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "diabetes-at-home",
    }
  )
  .then(() => console.log(`Mongo connected to port ${db.host}:${db.port}`));

const db = mongoose.connection.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

const createPatPatientSettings = async () => {
  const patient = await PatientSchema.findOne({
    username: "patstuart",
  });
  const new_data = new patientSettingsSchema({
    for_patient: patient._id,
    requires_glucose: true,
    requires_steps: false,
    requires_weight: false,
    requires_insulin: false,
  });
  await new_data.save().then(()=> {console.log("saved pats settings");});
};

const deletePatientSettings = async () => {
  const entries = await patientSettingsSchema.find({});
  entries.forEach(
    async (entry) => await patientSettingsSchema.findByIdAndRemove(entry.id)
  );
};

deletePatientSettings()
  .then(() => {
    console.log("cleared patient settings db");
  })
  .then(() => createPatPatientSettings());
// .then(() => createHealthData().then(()=> {console.log("generated data");}));
