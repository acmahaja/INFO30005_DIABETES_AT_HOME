const express = require("express");
const app = express();

const path = require("path")

const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");


var cookieParser = require('cookie-parser');
const session = require("express-session")

const mongoose = require("mongoose");

var morgan = require("morgan");
app.use(morgan('tiny'))

require('dotenv').config()

const bodyParser = require("body-parser")


console.warn("Dev Environment: " + process.env.NODE_ENV);

mongoose.connect(
	process.env.NODE_ENV==='production' ? process.env.MONGO_URL : 'mongodb://localhost:27017/diabetes-at-home', 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: 'diabetes-at-home'
	}
).then(()=> console.log(`Mongo connected to port ${db.host}:${db.port}`))

const db = mongoose.connection.on('error', err => {
	console.error(err)
	process.exit(1)
})

app.engine(
  "hbs",
  exphbs.engine({
    defaultlayout: "main",
    extname: ".hbs",
    helpers: require('./utils/handlebars-helpers'),

    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser());
app.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use(bodyParser.urlencoded({extended:true}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));


app.use(express.static('public'))

const clinicianRouter = require("./routes/clinician/clinicianRouter")
const patientRouter = require("./routes/patient/patientRouter");


app.use("/patient", patientRouter);
app.use('/clinician', clinicianRouter)

app.get('/diabetes', (req,res)=>{
	res.render("diabetes.hbs");
})


app.get('/', (req,res)=>{
	res.render("about.hbs");
})

app.listen(process.env.PORT || 3000, ()=>{
	console.log("Listening on port 3000");
})
