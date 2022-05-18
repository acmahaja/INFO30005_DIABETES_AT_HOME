const healthDataSchema = require("../models/health_data");

const createHealthData = async (patient) => {
  for (let i = 0; i < 50; i++) {
    const new_data_blood_glucose = new healthDataSchema({
      patient_id: patient._id,
      health_type: "blood_glucose",
      value: Math.floor(Math.random() * 50 + 120),
      created: Date.now() - 1000 * 60 * 60 * 24 * i,
      comments: "random",
    });

    const new_data_steps = new healthDataSchema({
      patient_id: patient._id,
      health_type: "steps",
      value: Math.floor(Math.random() * 8000 + 1000),
      created: Date.now() - 1000 * 60 * 60 * 24 * i,
      comments: "random",
    });

    const new_data_weight = new healthDataSchema({
      patient_id: patient._id,
      health_type: "weight",
      value: Math.floor(Math.random() * 40 + 50),
      created: Date.now() - 1000 * 60 * 60 * 24 * i,
      comments: "random",
    });

    const new_data_insulin = new healthDataSchema({
      patient_id: patient._id,
      health_type: "insulin",
      value: Math.floor(Math.random() * 4),
      created: Date.now() - 1000 * 60 * 60 * 24 * i,
      comments: "random",
    });

    try {
      if (i === 0 || Math.round(Math.random() + 0.45))
        await new_data_blood_glucose.save();
      if (i === 0 || Math.round(Math.random() + 0.45))
        await new_data_steps.save();
      if (i === 0 || Math.round(Math.random() + 0.45))
        await new_data_weight.save();
      if (i === 0 || Math.round(Math.random() + 0.45))
        await new_data_insulin.save();
    } catch (error) {
      console.log("Something Broke");
      console.log(error);
    }
  }
};

const deleteHealth = async () => {
  const entries = await healthDataSchema.find({});
  entries.forEach(
    async (entry) => await healthDataSchema.findByIdAndRemove(entry.id)
  );
};

module.exports = {
  createHealthData,
  deleteHealth,
};
