const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Clincian = require("./models/clincian");

// Hardcode user for now

// Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
  done(undefined, user._id);
});
passport.deserializeUser((userId, done) => {
  Clincian.findById(userId, { password: 0 }, (err, user) => {
    if (err) {
      return done(err, undefined);
    }
    return done(undefined, user);
  });
});
// When a request comes in, deserialize/expand the serialized information
// back to what it was (expand from id to full user)

passport.deserializeUser((userId, done) => {
  // Run database query here to retrieve user information
  // For now, just return the hardcoded user
  if (userId === USER.id) {
    done(undefined, USER);
  } else {
    done(new Error("Bad Clincian"), undefined);
  }
});

// Define local authentication strategy for Passport
passport.use(
  new LocalStrategy((username, password, done) => {
     Clincian.findOne({ username }, {}, {}, (err, user) => {
      if (err) {
        return done(undefined, false, {
          message: "Unknown error has occurred",
        });
      }
      if (!user) {
        return done(undefined, false, {
          message: "Incorrect username or password",
        });
      }
      // Check password
      user.verifyPassword(password, (err, valid) => {
        if (err) {
          return done(undefined, false, {
            message: "Unknown error has occurred",
          });
        }
        if (!valid) {
          return done(undefined, false, {
            message: "Incorrect username or password",
          });
        }
        // If user exists and password matches the hash in the database
        return done(undefined, user);
      });
    });
  })
);

module.exports = passport;
