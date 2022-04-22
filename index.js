const express = require("express");
const app = express();

const path = require("path")

const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

var cookieParser = require('cookie-parser');
const session = require("express-session")

const mongoose = require("mongoose");

const {auth} = require("./utils/authorization")

require('dotenv').config()

console.warn("Dev Environment: " + process.env.NODE_ENV);

mongoose.connect(
	process.env.NODE_ENV==='production' ? process.env.MONGO_URL : 'mongodb://localhost:27017/diabetes-at-home', 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: 'demo'
	}
).then(()=> console.log(`Mongo connected to port ${db.host}:${db.port}`))

const db = mongoose.connection.on('error', err => {
	console.error(err)
	process.exit(1)
})

app.engine('hbs', exphbs.engine({
	defaultlayout: 'main',
	extname: '.hbs'
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser());
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: process.env.SESSION_SECRET
}));

app.use(bodyParser.urlencoded({extended:true}));


app.post('/logout', async (req, res)=> {
	req.session.destroy()
	res.redirect("/")
})


app.post('/login', async (req, res)=> {
	if(req.session.loggedIn === true){
		res.redirect("/")
	}
	const {username, password} = req.body
	const has_user = await auth.basic_authorization(username, password);
	if(has_user){
		req.session.loggedIn = true;
		req.session.username = username;
		res.redirect("/")

	} else {
		req.session.destroy()
		res.redirect("/diabetes")
	}
})


app.get('/clincian', (req,res)=>{
	res.send("Clinician Page");
})

app.get('/patient', (req,res)=> {
	res.send("Patient Page");
})

app.get('/diabetes', (req,res)=>{
	res.send("About Diabetes");
})


app.get('/', (req,res)=>{
	res.send("Welcome to Diabetes at Home");
})

app.listen(process.env.PORT || 3000, ()=>{
	console.log("Listening on port 3000");
})

