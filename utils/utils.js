const PatientSchema = require("../models/patient");
const ClincianSchema = require("../models/clincian");
const patientThresholdsSchema = require("../models/patient_thresholds");
const PatientSettings = require("../models/patient_settings");
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

async function get_patient_list(clincian) {
  if (clincian == null) {
    result = await PatientSchema.find({}).select(
      "username firstname middlename lastname dob email date_joined bio image"
    );
  } else {
    result = await PatientSchema.find({
      assigned_clincian: clincian._id,
    }).select(
      "username firstname middlename lastname dob email date_joined bio image"
    );
  }
  return result;
}

async function get_clinician_id(username) {
  const result = await ClincianSchema.findOne({ username: username }).select(
    "username firstname middlename lastname dob email date_joined bio image"
  );
  return result;
}

function generate_random_date(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function get_threshold(patient_id) {
  const blood_glucose_result = await patientThresholdsSchema.findOne({
    for_patient: patient_id,
    health_type: "blood_glucose",
  });
  const weight_result = await patientThresholdsSchema.findOne({
    for_patient: patient_id,
    health_type: "weight",
  });
  const insulin_result = await patientThresholdsSchema.findOne({
    for_patient: patient_id,
    health_type: "insulin",
  });
  const steps_result = await patientThresholdsSchema.findOne({
    for_patient: patient_id,
    health_type: "steps",
  });

  return { blood_glucose_result, weight_result, insulin_result, steps_result };
}

async function get_patient_data_type(patient, type) {
  const result = await HealthDataEntry.find({
    health_type: type,
    patient_id: patient._id,
  }).sort({ created: "-1" });
  return result;
}

async function get_patient_settings(patient) {
  const patient_settings = await PatientSettings.findOne({
    for_patient: patient._id,
  });
  return patient_settings;
}

async function get_patient_data(patient, start_date) {
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
  }).sort({ created: "-1" });

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
  }).sort({ created: "-1" });

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
  }).sort({ created: "-1" });

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
  }).sort({ created: "-1" });

  return {
    glucose: glucose_result[0],
    steps: steps_result[0],
    insulin: insulin_result[0],
    weight: weight_result[0],
  };
}

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

const gen_date_array = async (start_date, end_date) => {
  var array = [];
  for (let i = start_date; i <= end_date; i.setDate(i.getDate() + 1)) {
    array.push(i.toString());
  }
  return array;
};

const get_patient_all_data = async (patient) => {
  // create date array
  const patient_settings = await PatientSettings.findOne({
    for_patient: patient._id,
  });

  const date_array = await gen_date_array(
    new Date(patient.date_joined),
    Date.now()
  );

  const result = await Promise.all(
    date_array.map(async (date) => {
      let glucose = null;
      let steps = null;
      let insulin = null;
      let weight = null;
      const startDate = new Date(date);
      var nextDate = new Date(startDate);

      nextDate.setDate(startDate.getDate() + 1);

      if (patient_settings.requires_glucose) {
        glucose = await HealthDataEntry.findOne({
          patient_id: patient._id,
          health_type: "blood_glucose",
          created: { $gte: startDate, $lt: nextDate },
        });
      }

      if (patient_settings.requires_steps) {
        steps = await HealthDataEntry.findOne({
          patient_id: patient._id,
          health_type: "steps",
          created: { $gte: startDate, $lt: nextDate },
        });
      }

      if (patient_settings.requires_insulin) {
        insulin = await HealthDataEntry.findOne({
          patient_id: patient._id,
          health_type: "insulin",
          created: { $gte: startDate, $lt: nextDate },
        });
      }

      if (patient_settings.requires_weight) {
        weight = await HealthDataEntry.findOne({
          patient_id: patient._id,
          health_type: "weight",
          created: { $gte: startDate, $lt: nextDate },
        });
      }

      return {
        date: date,
        glucose_data: glucose,
        steps_data: steps,
        weight_data: weight,
        insulin_data: insulin,
      };
    })
  );
  return result.reverse();
};

module.exports = {
  get_patient_list,
  get_clinician_id,
  generate_random_date,
  get_threshold,
  get_patient_data,
  getDailyHealthData,
  get_patient_data_type,
  get_patient_settings,
  get_patient_all_data,
};
