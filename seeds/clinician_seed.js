const { first_names, last_names } = require("./seedHelpers");
const ClincianSchema = require("../models/clincian");
const faker = require("faker");

const deleteClinician = async () => {
  ClincianSchema.collection.drop()
};

const createChris = async () => {
  const entry = new ClincianSchema({
    username: "chrispatt",
    password: "password",
    firstname: "chris",
    middlename: "",
    lastname: "patt",
    dob: "1993-09-28",
    email: "chris.patt@email.com",
    date_joined: "2022-01-22",
    secret: "INFO30005",
  });
  try {
    await entry.save();
  } catch (error) {
    console.log("Something Broke");
    console.log(error);
  }
  return entry;
};

const generateClinician = async () => {
  let firstnameIndex = Math.floor(Math.random() * first_names.length);
  let lastnameIndex = Math.floor(Math.random() * last_names.length);
  while (
    ClincianSchema.findOne({
      username:
        first_names[firstnameIndex].toLowerCase() +
        "" +
        last_names[lastnameIndex].toLowerCase(),
    }) === null
  ) {
    firstnameIndex = Math.floor(Math.random() * first_names.length);
    lastnameIndex = Math.floor(Math.random() * last_names.length);
  }

  const entry = new ClincianSchema({
    username:
      first_names[firstnameIndex].toLowerCase() +
      "" +
      last_names[lastnameIndex].toLowerCase(),
    password: "password",
    firstname: first_names[firstnameIndex],
    middlename: "",
    lastname: last_names[lastnameIndex],
    dob: new Date(faker.date.past(15)),
    email:
      first_names[firstnameIndex].toLowerCase() +
      "." +
      last_names[lastnameIndex].toLowerCase() +
      "@email.com",
    date_joined: "2021-04-11",
    secret: "INFO30005",
  });

  try {
    await entry.save()
  } catch (error) {
    console.log("something broke");
    console.log(error);
  }
  
  return entry;
};

module.exports = {
  generateClinician,
  createChris,
  deleteClinician,
};
