const { first_names, last_names } = require("./seedHelpers");
const PatientSchema = require("../models/patient");
const ClinicianSchema = require("../models/clincian");

const faker = require("faker")

const deletePatients = async () => {
  const entries = await PatientSchema.find({});
  entries.forEach(
    async (entry) => await PatientSchema.findByIdAndRemove(entry.id)
  );
};

const createPat = async (findChris) => {
  const entry = new PatientSchema({
    username: "patstuart",
    password: "password",
    firstname: "pat",
    middlename: "",
    lastname: "stuart",
    dob: "2000-03-28",
    email: "pat.stuart@email.com",
    date_joined: "2022-05-01",
    secret: "INFO30005",
    assigned_clincian: findChris._id,
  });
  try {
    await entry.save();
  } catch (error) {
    console.log(error);
  }
  return entry;
};

const generatePatient = async (clinician) => {
  let firstnameIndex = Math.floor(Math.random() * first_names.length);
  let lastnameIndex = Math.floor(Math.random() * last_names.length);
  while (
    PatientSchema.find({
      username:
        first_names[firstnameIndex].toLowerCase() +
        "" +
        last_names[lastnameIndex].toLowerCase(),
    }) === null
  ) {
    firstnameIndex = Math.floor(Math.random() * first_names.length);
    lastnameIndex = Math.floor(Math.random() * last_names.length);
  }
  const entry = new PatientSchema({
    username:
      first_names[firstnameIndex].toLowerCase() +
      "" +
      last_names[lastnameIndex].toLowerCase(),
    password: "password",
    firstname: first_names[firstnameIndex],
    middlename: "",
    lastname: last_names[lastnameIndex],
    dob: new Date(faker.date.past(20)),
    email:
      first_names[firstnameIndex].toLowerCase() +
      "." +
      last_names[lastnameIndex].toLowerCase() +
      "@email.com",
    date_joined: new Date(faker.date.recent(10)),
    secret: "INFO30005",
    assigned_clincian: clinician._id,
  });
  try {
    await entry.save();
  } catch (error) {
    console.log("something broke");
    console.log(error);
  }
  return entry
};

module.exports = {
  deletePatients,
  createPat,
  generatePatient,
};
