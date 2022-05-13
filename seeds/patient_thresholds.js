const PatientSchema = require("../models/patient");
const patientThresholdsSchema = require("../models/patient_thresholds");

const mongoose = require("mongoose");
console.warn("Dev Environment: " + process.env.NODE_ENV);

mongoose
  .connect(
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URL
      : "mongodb://localhost:27017/diabetes-at-home",
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

const deleteThresholds = async () => {
  const entries = await patientThresholdsSchema.find({});
  entries.forEach(
    async (entry) => await patientThresholdsSchema.findByIdAndRemove(entry.id)
  );
  console.log("cleared patient thresholds db");
};

const createPatThresholds = async () => {
  const findPat = await PatientSchema.findOne({ username: "patstuart" });
  const entry_blood_glucose = await patientThresholdsSchema({
    for_patient: findPat._id,
    health_type: "blood_glucose",
    max_value: 200,
    min_value: 130,
  });
  const entry_steps = await patientThresholdsSchema({
    for_patient: findPat._id,
    health_type: "steps",
    max_value: 50000,
    min_value: 2000,
  });
  const entry_weight = await patientThresholdsSchema({
    for_patient: findPat._id,
    health_type: "weight",
    max_value: 85,
    min_value: 60,
  });
  const entry_insulin = await patientThresholdsSchema({
    for_patient: findPat._id,
    health_type: "insulin",
    max_value: 3,
    min_value: 1,
  });
  try {
    await entry_blood_glucose.save().then(() => console.log("saved threshold \n"));
    await entry_steps.save().then(() => console.log("saved threshold \n"));
    await entry_weight.save().then(() => console.log("saved threshold \n"));
    await entry_insulin.save().then(() => console.log("saved threshold \n"));
  } catch (error) {
    console.log("Something Broke");
    console.log(error);
  }
};


deleteThresholds().then(() => {
  createPatThresholds();
});


module.exports = {
  deleteThresholds,
  createPatThresholds,
};