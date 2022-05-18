const Patient = require("../models/patient");
const ClinicianPatientNote = require("../models/clinician_patient_notes");

const {
  get_clinician_id,
  get_patient_all_data,
  get_patient_settings,
  get_threshold,
  get_patient_data_type,
} = require("../utils/utils");


const savePatientNotesForm = async (req, res) => {
  const { note } = req.body;
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);

  const new_note = new ClinicianPatientNote({
    for_clincian: get_clinician._id,
    for_patient: req.params.PatientID,
    created: new Date(),
    note: note,
  });
  await new_note.save();
  res.redirect(`/clinician/${req.params.PatientID}/notes/${new_note._id}`);
};

const showPatientNote = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);

  var all_notes = await ClinicianPatientNote.find({
    for_clincian: get_clinician._id,
    for_patient: patient._id,
  }).sort({ created: -1 });

  var note = await ClinicianPatientNote.findById(req.params.NoteID);


  res.render("clincian/notes/patient_notes_show.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    all_notes: all_notes,
    note: note,
  });
}; 

const loadPatientNotesForm = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);

  var all_notes = await ClinicianPatientNote.find({
    for_clincian: get_clinician._id,
    for_patient: patient._id,
  }).sort({ created: -1 });


  res.render("clincian/notes/patient_notes_new.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    all_notes: all_notes,
  });
};

const loadPatientNotes = async (req, res) => {
  const patient = await Patient.findById(req.params.PatientID);
  const get_clinician = await get_clinician_id(req.session.username);
  console.log(patient);
  const all_notes = await ClinicianPatientNote.find({
    for_clincian: get_clinician._id,
    for_patient: req.params.PatientID,
  })
  .sort({ created: -1 });

  res.render("clincian/notes/patient_notes.hbs", {
    clinician: get_clinician.toJSON(),
    patient: patient,
    all_notes: all_notes,
  });
};

module.exports = {
  loadPatientNotes,
  loadPatientNotesForm,
  savePatientNotesForm,
  showPatientNote,
};
