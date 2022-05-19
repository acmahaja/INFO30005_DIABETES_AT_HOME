const {
  generateClinician,
  createChris,
  deleteClinician,
} = require("./seeds/clinician_seed");

const {
  deletePatients,
  createPat,
  generatePatient,
} = require("./seeds/patient_seed");

const {
  deletePatientSettings,
  createPatPatientSettings,
  generatePatientSettings,
} = require("./seeds/patient_settings_seed");

const {
  deleteThresholds,
  createPatThresholds,
  createPatientThresholds,
} = require("./seeds/patient_thresholds");

const { createHealthData, deleteHealth } = require("./seeds/health_data_seed");

const mongoose = require("mongoose");
mongoose
  .connect(
    // process.env.MONGO_URL,
    'mongodb+srv://admin:healthy@cluster0.fz5ya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    //  "mongodb://localhost:27017/diabetes-at-home",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "diabetes-at-home",
    }
  )
  .then(() => {
    // clear database on restart
    // purely for demo purposes
    console.log(`Mongo connected to port ${db.host}:${db.port}`);
  });

  
const db = mongoose.connection.on("error", (err) => {
  console.error(err);
  process.exit(1);
});


const populateDB = async () => {
  // populate Chris and Pat
  createChris().then((chris) => {
    createPat(chris).then(async (pat) => {
      await createPatPatientSettings(pat);
      await createPatThresholds(pat);
      await createHealthData(pat);
    });

    // give Chris more patients
    for (let i = 0; i < 3; i++) {
      generatePatient(chris).then(async (patient) => {
        await generatePatientSettings(patient);
        await createPatientThresholds(patient);
        await createHealthData(patient);
      });
    }
  });

  for (let i = 0; i < 4; i++) {
    generateClinician().then((clincian) => {
      for (let i = 0; i < 4; i++) {
        generatePatient(clincian).then(async (patient) => {
          await generatePatientSettings(patient);
          await createPatientThresholds(patient);
          await createHealthData(patient);
        });
      }
    });
  }
};

// module.exports = { populateDB };

const collections = mongoose.connection.collections;

Promise.all(
  Object.values(collections).map(async (collection) => {
    await collection.deleteMany({}); // an empty mongodb selector object ({}) must be passed as the filter argument
  })
).then(() => populateDB());
