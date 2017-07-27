// Require node modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDb = require("./seeds");

// Implement node modules
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/firecamp", {useMongoClient: true});
seedDb();

// BEGIN ROUTES
app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  // Pull & render database contents:
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("./campgrounds/index", {campgrounds: allCampgrounds});
    }
  })
});

app.post("/campgrounds", function(req, res) {
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

app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res) {
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

app.get("/campgrounds/:id/comments/new", function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
})

app.post("/campgrounds/:id/comments", function (req, res) {
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

// Run app
app.listen(4000, function() {
  console.log("App running on localhost:4000");
});
