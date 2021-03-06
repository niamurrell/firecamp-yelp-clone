// Require node modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

// Require models
var User = require("./models/user");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDb = require("./seeds");

// Require Routes
var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");

// Implement node modules
var nodeEnv = process.env.NODE_ENV || "development";
if (nodeEnv === "development") {
  require('dotenv').config()
}
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
  secret: 'process.env.SESSION_SECRET',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;
  next();
})

// seedDb();

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Run app
var port = process.env.PORT;
app.listen(port, function() {
  console.log("App running on port " + port);
});
