const PatientSchema = require("../models/patient");
const ClincianSchema = require("../models/clincian");
const patientThresholdsSchema = require("../models/patient_thresholds");
const HealthDataEntry = require("../models/health_data");

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

async function get_patient_data(patient, start_date) {
    const glucose_result = await HealthDataEntry.find({
      health_type: "blood_glucose",
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

    const steps_result = await HealthDataEntry.find({
        health_type: "steps",
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


    return {
      glucose: glucose_result[0],
      steps: steps_result[0],
      insulin: insulin_result[0],
      weight: weight_result[0]
    };
}

module.exports = {
  get_patient_list,
  get_clinician_id,
  generate_random_date,
  get_threshold,
  get_patient_data,
};
