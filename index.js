const express = require("express");
const app = express();

const path = require("path")

const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

var cookieParser = require('cookie-parser');
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
app.use(express.static('public'))

const clincianRouter = require("./routes/clinician/clincianRouter")


app.use('/clinician', clincianRouter)

app.get('/diabetes', (req,res)=>{
	res.render("diabetes.hbs");
})


app.get('/', (req,res)=>{
	res.render("about.hbs");
})

app.listen(process.env.PORT || 3000, ()=>{
	console.log("Listening on port 3000");
})

