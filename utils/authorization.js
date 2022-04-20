const mongoose = require("mongoose");
const PatientSchema = require("../models/patient")

mongoose.connect(
	process.env.NODE_ENV==='production' ? process.env.MONGO_URL : 'mongodb://localhost:27017/diabetes-at-home', 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: 'diabetes-at-home'
	}
)
const db = mongoose.connection.on('error', err => {
	console.error(err)
	process.exit(1)
})

db.once('open', async () => {
 	console.log(`Mongo connected to port ${db.host}:${db.port}`)
})

async function basic_authorization(username, password){
    const result = await PatientSchema.findOne({username: username})
    return result === null ? false : result.username === username && result.password === password
}

async function add_patient(username, password) {
    const new_patient = new PatientSchema(
        {
            username, 
            password
        }
    )

    await new_patient.save().then(()=> console.log("data saved"));z
}

module.exports.auth = {basic_authorization}