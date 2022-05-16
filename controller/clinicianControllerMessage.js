const Patient = require("../models/patient");
const clinicianPatientMessageSchema = require("../models/clinician_patient_messages");

const {
  get_clinician_id,
  get_patient_all_data,
  get_patient_settings,
  get_threshold,
  get_patient_data_type,
} = require("../utils/utils");

const savePatientMessageForm = async (req, res) => {
  const { message } = req.body;
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);
  const new_message = new clinicianPatientMessageSchema({
    for_clincian: get_clinician._id,
    for_patient: patient._id,
    created: new Date(),
    message: message,
  });
  await new_message.save();
  res.redirect(`/clinician/${patient._id}/messages/${new_message._id}`);
};

const updatePatientMessageForm = async (req, res) => {
  const { message } = req.body;
  console.log(message);
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);
  const update_message = await clinicianPatientMessageSchema.findByIdAndUpdate(
    req.params.MessageID,
    {
      for_clincian: get_clinician._id,
      for_patient: patient._id,
      message: message,
    }
  );
  
  res.redirect(`/clinician/${patient._id}/messages/${req.params.MessageID}`);
};

const showPatientMessage = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);

  var all_messages = await clinicianPatientMessageSchema
    .find({
      for_clincian: get_clinician._id,
      for_patient: patient._id,
    })
    .sort({ created: -1 });

  var message = await clinicianPatientMessageSchema.findById(
    req.params.MessageID
  );

  res.render("clincian/messages/patient_messages_show.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    all_messages: all_messages,
    message: message,
  });
};

const editPatientMessageForm = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);

  var message = await clinicianPatientMessageSchema.findById(
    req.params.MessageID
  );

  var all_messages = await clinicianPatientMessageSchema
    .find({
      for_clincian: get_clinician._id,
      for_patient: patient._id,
    })
    .sort({ created: 1 });

  res.render("clincian/messages/patient_messages_edit.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    all_messages: all_messages,
    message: message,
  });
};

const loadPatientMessageForm = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);

  var all_messages = await clinicianPatientMessageSchema
    .find({
      for_clincian: get_clinician._id,
      for_patient: patient._id,
    })
    .sort({ created: 1 });

  res.render("clincian/messages/patient_messages_new.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    all_messages: all_messages,
  });
};

const loadPatientMessage = async (req, res) => {
  console.log("asdsad");
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);
  const all_messages = await clinicianPatientMessageSchema
    .find({
      for_clincian: get_clinician._id,
      for_patient: patient._id,
    })
    .sort({ created: 1 });

  res.render("clincian/messages/patient_messages.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    all_messages: all_messages,
  });
};

module.exports = {
  loadPatientMessage,
  loadPatientMessageForm,
  savePatientMessageForm,
  showPatientMessage,
  editPatientMessageForm,
  updatePatientMessageForm,
};
