const express = require("express");
const app = express();

const path = require("path");

const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

var cookieParser = require("cookie-parser");
const flash = require("express-flash");
const session = require("express-session");

const mongoose = require("mongoose");

var morgan = require("morgan");
// app.use(morgan('tiny'))

require("dotenv").config();

const bodyParser = require("body-parser");

mongoose
  .connect(
    process.env.MONGO_URL,
    // :
    //  "mongodb://localhost:27017/diabetes-at-home",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "diabetes-at-home",
    }
  )
  .then(() => {
    // clear database on restart
    // purely for demo purposes
    console.log(`Mongo connected to port ${db.host}:${db.port}`);
  });

const db = mongoose.connection.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

app.engine(
  "hbs",
  exphbs.engine({
    defaultlayout: "main",
    extname: ".hbs",
    layoutsDir: "views/layouts/",
    helpers: require("./utils/handlebars-helpers"),
    partialsDir: [
      //  path to your partials
      path.join(__dirname, "views/partials"),
    ],
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(flash());
app.use(
  session({
    // The secret used to sign session cookies (ADD ENV VAR)
    secret: process.env.SESSION_SECRET || "keyboard cat",
    name: "demo", // The cookie name (CHANGE THIS)
    saveUninitialized: false,
    resave: false,
    cookie: {
      sameSite: "strict",
      httpOnly: true,
      secure: app.get("env") === "production",
    },
  })
);

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // Trust first proxy
}

const passport = require("./passport");
app.use(passport.authenticate("session"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.static("public"));

const clinicianRouter = require("./routes/clinician/clinicianRouter");
const patientRouter = require("./routes/patient/patientRouter");

const { populateDB } = require("./seeds/populateDB");

const collections = mongoose.connection.collections;

Promise.all(
  Object.values(collections).map(async (collection) => {
    await collection.deleteMany({}); // an empty mongodb selector object ({}) must be passed as the filter argument
  })
).then(() => populateDB());


app.use("/patient", patientRouter);
app.use("/clinician", clinicianRouter);

app.get("/diabetes", (req, res) => {
  res.render("diabetes.hbs");
});

app.get("/", (req, res) => {
  res.render("about.hbs");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});
