<<<<<<< HEAD
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
		dbName: 'diabetes-at-home'
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

const clinicianRouter = require("./routes/clinician/clinicianRouter")


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
=======
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const DB = process.env.DB.replace(
  '<USERNAME>:<PASSWORD>',
  `${username}:${password}`
);

// Connect to Database
mongoose
  .connect(DB)
  .then(() => console.log('MongoDB Connected 🔸 '))
  .catch(() => console.log('Database connection failed 🟥 '));
>>>>>>> bf1cf103eb3af2376a1346b5809d6a4ca2d1dbfc

// Create server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
