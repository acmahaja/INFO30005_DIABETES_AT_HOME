const mongoose = require("mongoose");

const PatientSchema = require("../models/patient");
const ClincianSchema = require("../models/clincian");
const patientThresholdsSchema = require("../models/patient_thresholds");
const PatientSettings = require("../models/patient_settings");
const HealthDataEntry = require("../models/health_data");
const ClinicianPatientMessage = require("../models/clinician_patient_message");

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

async function get_threshold(patient_id) {
  const blood_result = await patientThresholdsSchema.findOne({
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

  return { blood_result, weight_result, insulin_result, steps_result };
}

async function get_patient_data_type(patient, type) {
  const result = await HealthDataEntry.find({
    health_type: type,
    patient_id: patient._id,
  }).sort({ created: "desc" });
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
      $gte: start_date
    },
  }).sort({ created: "desc" });

  const weight_result = await HealthDataEntry.find({
    health_type: "weight",
    patient_id: patient._id,
    created: {
      $gte: start_date
    },
  }).sort({ created: "desc" });

  const insulin_result = await HealthDataEntry.find({
    health_type: "insulin",
    patient_id: patient._id,
    created: {
      $gte: start_date
    },
  }).sort({ created: "desc" });

  const steps_result = await HealthDataEntry.find({
    health_type: "steps",
    patient_id: patient._id,
    created: {
      $gte: start_date
    },
  }).sort({ created: "desc" });

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
    patient_id: patientId,
    health_type: GLUCOSE_ENUM_TYPE,
    created: { $gte: startOfToday },
  }).lean();

  var insulinData = await HealthDataEntry.findOne({
    patient_id: patientId,
    health_type: INSULIN_ENUM_TYPE,
    created: { $gte: startOfToday },
  }).lean();

  var stepsData = await HealthDataEntry.findOne({
    patient_id: patientId,
    health_type: STEPS_ENUM_TYPE,
    created: { $gte: startOfToday },
  }).lean();

  var weightData = await HealthDataEntry.findOne({
    patient_id: patientId,
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

const calc_engagement_rate = async (patient) => {
  daysWithEntries = await HealthDataEntry.aggregate([
    {
      $match: {
        patient_id: mongoose.Types.ObjectId(patient._id),
        created: {$gte: new Date(patient.date_joined)}
      }
    },
    {
      $group : {
        "_id": {
          date: {$dateToString: { format: "%Y-%m-%d", date: "$created" }}
        }
      }
    }
  ]);
  numEntryDays = daysWithEntries.length;
  dateJoined = patient.date_joined;
  now = new Date();
  today = now
  today.setHours(33, 59, 59)
  const timeJoined = Math.abs(today - dateJoined);
  const daysJoined = Math.ceil(timeJoined / (1000 * 60 * 60 * 24)); 
  return Math.round(numEntryDays / (daysJoined) * 10000) / 100
}

const show_badge = async (patient) => {
  return await calc_engagement_rate(patient) >= 80
}

const get_top5_leaderboard = async () => {

  function compare( b, a ) {
    if ( a['engagement_rate'] < b['engagement_rate']  ){
      return -1;
    }
    if ( a['engagement_rate']  > b['engagement_rate']  ){
      return 1;
    }
    return 0;
  }

  allPatientIds = await PatientSchema.find().distinct('_id');
  allPatientEng = [];
  for (const patient_id of allPatientIds)
  {
    engEntry = {}
    p = await PatientSchema.findOne({_id: patient_id})
    engEntry['username'] = p.username;
    engEntry['engagement_rate'] = await calc_engagement_rate(p);
    allPatientEng.push(engEntry)
  }

  allPatientEng.sort(compare);
  return allPatientEng.slice(0,5);
}

const get_clinician_message = async (patient) => {
  message = await ClinicianPatientMessage.findOne({
    for_patient: patient._id
  }).lean();
  return message;
}

const update_clinician_message = async (patient, newMessage) => {
  await ClinicianPatientMessage.updateOne(
    {
      for_patient: patient._id
    },
    {
      for_patient: patient._id,
      message: newMessage
    },
    {
      upsert: true
    }
  )
}


const getHistoricalData = async (thisPatientId, nDays, metricType = "all") => {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());  
  const NUMBER_OF_DAYS = nDays  //set number of days in historical data
  PastNDays = new Date();
  PastNDays.setDate(startOfToday.getDate() - NUMBER_OF_DAYS)
  var historical_data;
  if (metricType == GLUCOSE_ENUM_TYPE){
      historical_data = await HealthDataEntry.find({
          patient_id: thisPatientId,
          health_type: GLUCOSE_ENUM_TYPE,
          created: {$gte: PastNDays}
      }).lean()
  }
  else if (metricType == INSULIN_ENUM_TYPE) {
      historical_data = await HealthDataEntry.find({
          patient_id: thisPatientId,
          health_type: INSULIN_ENUM_TYPE,
          created: {$gte: PastNDays}
      }).lean()
  }
  else if (metricType == STEPS_ENUM_TYPE) {
      historical_data = await HealthDataEntry.find({
          patient_id: thisPatientId,
          health_type: STEPS_ENUM_TYPE,
          created: {$gte: PastNDays}
      }).lean()
  }
  else if (metricType == WEIGHT_ENUM_TYPE) {
      historical_data = await HealthDataEntry.find({
          patient_id: thisPatientId,
          health_type: WEIGHT_ENUM_TYPE,
          created: {$gte: PastNDays}
      }).lean()
  }
  else {
      historical_data = await HealthDataEntry.find({
        patient_id: thisPatientId,
          created: {$gte: PastNDays}
      }).lean()
  }
  healthEntryTS = {}
  for (var i=0; i<NUMBER_OF_DAYS; i++){
      d = new Date()
      d.setDate(startOfToday.getDate() - i)
      healthEntryTS[d.toDateString()] = {index: i, date: d.toDateString(), datetime: d}
  }
  for (const e of historical_data){
      d = e.created.toDateString()
      if (d in healthEntryTS)
          healthEntryTS[d][e.health_type]  = {value: e.value, comment: e.comments}
  } 
  healthEntryArray = Object.values(healthEntryTS);
  return healthEntryArray
}


const get_current_date = () => {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

//add function to add 0 if data.blood_glucose undefined

const convert_timeseries_to_graph = (timeseries, metric_enum) => {
  newTS = [];
  for (const t of timeseries) {
    var newT = {}
    newT.index = t.index;
    newT.date = t.date;
    newT.datetime = t.datetime;
    if (t[metric_enum] == undefined){
      newT[metric_enum] = {value: 0}
    } else {
      newT[metric_enum] = t[metric_enum]
    }
    newTS.push(newT)
  } 
  return newTS
}

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
  calc_engagement_rate,
  get_top5_leaderboard,
  get_clinician_message,
  show_badge,
  update_clinician_message,
  getHistoricalData,
  get_current_date,
  convert_timeseries_to_graph
}
