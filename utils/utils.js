const PatientSchema = require("../models/patient");
const ClincianSchema = require("../models/clincian");
const patientThresholdsSchema = require("../models/patient_thresholds");
const HealthDataEntry = require("../models/health_data");

const GLUCOSE_ENUM_TYPE = "blood_glucose";
const WEIGHT_ENUM_TYPE = "weight";
const INSULIN_ENUM_TYPE = "insulin";
const STEPS_ENUM_TYPE = "steps";
const entryTypes = {
  glucose: GLUCOSE_ENUM_TYPE,
  insulin: INSULIN_ENUM_TYPE,
  steps: STEPS_ENUM_TYPE,
  weight: WEIGHT_ENUM_TYPE,
};

// get list of patients for a clinician
async function get_patient_list(clincian) {
  if (clincian == null) {
    result = await PatientSchema.find({}).select(
      "username firstname middlename lastname dob email date_joined bio image"
    );
  } else {
    result = await PatientSchema.find({
      assigned_clincian: String(clincian._id),
    }).select(
      "username firstname middlename lastname dob email date_joined bio image"
    );
  }
  return result;
}

// get clincian data
async function get_clinician_id(username) {
  const result = await ClincianSchema.findOne({ username: username }).select(
    "username firstname middlename lastname dob email date_joined bio image"
  );
  return result;
}

// generate random date for see
function generate_random_date(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// get patient information
async function get_threshold(username) {
  const blood_result = await patientThresholdsSchema.findOne({
    for_patient: username,
    health_type: 'blood_glucose'
  });
  const weight_result = await patientThresholdsSchema.findOne({
    for_patient: username,
    health_type: "weight",
  });
  const insulin_result = await patientThresholdsSchema.findOne({
    for_patient: username,
    health_type: "insulin",
  });
  const steps_result = await patientThresholdsSchema.findOne({
    for_patient: username,
    health_type: "steps",
  });

  return { blood_result, weight_result, insulin_result, steps_result };
}

// get patient data from the start of a date
async function get_patient_data(patient, start_date) {
  // get patient glucose data
  const glucose_result = await HealthDataEntry.find({
    health_type: "blood_glucose",
    patient_id: patient._id,
    created: {
      $gte:
        start_date.getFullYear() +
        "-" +
        start_date.getMonth() +
        "-" +
        start_date.getDate(),
    },
  }).sort({ created: "desc" });

  // get patient weight data
  const weight_result = await HealthDataEntry.find({
    health_type: "weight",
    patient_id: patient,
    created: {
      $gte:
        start_date.getFullYear() +
        "-" +
        start_date.getMonth() +
        "-" +
        start_date.getDate(),
    },
  }).sort({ created: "desc" });

  // get patient insulin data
  const insulin_result = await HealthDataEntry.find({
    health_type: "insulin",
    patient_id: patient,
    created: {
      $gte:
        start_date.getFullYear() +
        "-" +
        start_date.getMonth() +
        "-" +
        start_date.getDate(),
    },
  }).sort({ created: "desc" });

  // get patient steps data

  const steps_result = await HealthDataEntry.find({
    health_type: "steps",
    patient_id: patient._id,
    created: {
      $gte:
        start_date.getFullYear() +
        "-" +
        start_date.getMonth() +
        "-" +
        start_date.getDate(),
    },
  }).sort({ created: "desc" });

  return {
    glucose: glucose_result[0],
    steps: steps_result[0],
    insulin: insulin_result[0],
    weight: weight_result[0],
  };
}


// get patient health data
const getDailyHealthData = async (patientId) => {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var glucoseData = await HealthDataEntry.findOne({
    for_patient: patientId,
    health_type: GLUCOSE_ENUM_TYPE,
    created: { $gte: startOfToday },
  }).lean();

  var insulinData = await HealthDataEntry.findOne({
    for_patient: patientId,
    health_type: INSULIN_ENUM_TYPE,
    created: { $gte: startOfToday },
  }).lean();

  var stepsData = await HealthDataEntry.findOne({
    for_patient: patientId,
    health_type: STEPS_ENUM_TYPE,
    created: { $gte: startOfToday },
  }).lean();

  var weightData = await HealthDataEntry.findOne({
    for_patient: patientId,
    health_type: WEIGHT_ENUM_TYPE,
    created: { $gte: startOfToday },
  }).lean();

  entries = {
    glucose: glucoseData,
    insulin: insulinData,
    steps: stepsData,
    weight: weightData,
  };
  
  return entries;
};


module.exports = {
  get_patient_list,
  get_clinician_id,
  generate_random_date,
  get_threshold,
  get_patient_data,
  getDailyHealthData,
};
