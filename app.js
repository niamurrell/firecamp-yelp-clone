// Require node modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDb = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");


// Implement node modules
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/firecamp", {useMongoClient: true});
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
  secret: "secret phrase for security",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

seedDb();

// BEGIN ROUTES
app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  console.log(req.user);
  // Pull & render database contents:
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("./campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
    }
  })
});

app.post("/campgrounds", isLoggedIn, function(req, res) {
  // Get submitions from form and create a new db document, redirect to page
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  Campground.create(newCampground, function(err, addedCamp) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", isLoggedIn, function(req, res) {
  // Find the campground with the given id in database
  Campground.findById(req.params.id).populate("comments").exec(function(err, resultCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(resultCampground);
      // Render SHOW template for that campground
      res.render("campgrounds/show", {campground: resultCampground});
    }
  })
})

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
})

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, addedComment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(addedComment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  })
})

app.get("/register", function(req, res) {
  res.render("register");
})

app.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("/register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/campgrounds");
    });
  })
})

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res) {});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}



// Run app
app.listen(4000, function() {
  console.log("App running on localhost:4000");
});
