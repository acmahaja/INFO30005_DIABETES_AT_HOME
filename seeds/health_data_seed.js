const PatientSchema = require("../models/patient");
const healthDataSchema = require("../models/health_data");
const { generate_random_date } = require("../utils/utils");

const mongoose = require("mongoose");
const { all } = require("express/lib/application");

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

const createHealthData = async () => {
  const all_patients = await PatientSchema.find({});
  all_patients.forEach(async (patient) => {
    for (let i = 0; i < 100; i++) {
      if (Math.round(Math.random())) continue;
      const new_data = new healthDataSchema({
        patient_id: patient._id,
        health_type: "blood_glucose",
        value: Math.floor(Math.random() * 50 + 120),
        created: Date.now() - (1000*60*60*24*i),
        comments: "random",
      });

      try {
        await new_data.save()
      } catch (error) {
        console.log("Something Broke");
        console.log(error);
      }
    }
  });
};

const deleteHealth = async () => {
  const entries = await healthDataSchema.find({});
  entries.forEach(
    async (entry) => await healthDataSchema.findByIdAndRemove(entry.id)
  );
};

const createPatHealthData = async () => {
  const findPat = await PatientSchema.findOne({ username: "patstuart" });
  const entry = new healthDataSchema({
    patient_id: findPat._id,
    health_type: "blood_glucose",
    value: 199,
    created: Date.now(),
    comments: "This is a comment",
  });
  try {
    await entry.save().then(() => console.log("saved threshold \n"));
  } catch (error) {
    console.log("Something Broke");
    console.log(error);
  }
};

deleteHealth()
  .then(() => {
    console.log("cleared patient db");
  })
  .then(() => createPatHealthData())
  .then(() => {
    console.log("Added Patt data");
  })
  .then(() =>
    createHealthData().then(() => {
      console.log("generated data");
    })
  )
//   .then(() => process.exit(1));
