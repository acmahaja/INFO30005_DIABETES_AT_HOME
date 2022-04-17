const express = require("express");
const app = express();

const path = require("path")

const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const session = require("express-session")

const mongoose = require("mongoose");
require('dotenv').config()

console.warn("Dev Environment: " + process.env.NODE_ENV);

mongoose.connect(
	process.env.NODE_ENV==='production' ? process.env.MONGO_URL : 'mongodb://localhost:27017/diabetes-at-home', 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: 'demo'
	}
)

const db = mongoose.connection.on('error', err => {
	console.error(err)
	process.exit(1)
})

db.once('open', async () => {
 	console.log(`Mongo connected to port ${db.host}:${db.port}`)
})


app.engine('hbs', exphbs.engine({
	defaultlayout: 'main',
	extname: '.hbs'
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: false }))
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: process.env.SESSION_SECRET
}));

app.use(bodyParser.urlencoded({extended:true}));

app.get('/clincian', (req,res)=>{
	res.send("Clinician Page");
})

app.get('/patient', (req,res)=> {
	res.send("Patient Page");
})

app.get('/', (req,res)=>{
	res.send("Welcome to Diabetes at Home");
})

app.listen(process.env.PORT ||3000, ()=>{
	console.log("Listening on port 3000");
})

