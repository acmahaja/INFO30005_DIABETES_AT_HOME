const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const PatientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username can't be blank"],
  },
  password: {
    type: String,
    required: [true, "Password can't be blank"],
  },
  secret: { type: String, required: true },
  firstname: {
    type: String,
    required: [true, "First name can't be blank"],
  },
  middlename: {
    type: String,
  },
  lastname: {
    type: String,
    required: [true, "Last name can't be blank"],
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth can't be blank"],
  },
  email: {
    type: String,
    required: [true, "email can't be blank"],
  },
  date_joined: {
    type: Date,
    required: [true, "missing joined date"],
  },
  bio: {
    type: String,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  assigned_clincian: {
    type: Schema.Types.ObjectID,
    ref: "Clincian",
    required: [true, "email can't be blank"],
  },
});


PatientSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, valid) => {
    callback(err, valid);
  });
};

const SALT_FACTOR = 10;

PatientSchema.pre("save", function save(next) {
  let user = this;
  // Go to next if password field has not been modified
  if (!user.isModified("password")) {
    return next();
  }
  // Automatically generate salt, and calculate hash
  bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
    if (err) {
      return next(err);
    }
    // Replace password with hash
    user.password = hash;
    next();
  });
});


module.exports = mongoose.model("Patient", PatientSchema);
