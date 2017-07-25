// Require node modules
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// Implement node modules
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/firecamp", {useMongoClient: true});

// Campground Schema & Model Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Temporary Campground Creation
// Campground.create({
//   name: "Lagrange Point",
//   image: "https://www.trend-chaser.com/wp-content/uploads/sites/7/2016/11/featured-image-6.jpg",
//   description: "Broad valley nestled in the peaceful gulch of the mountain range."
// }, function(err, campground) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log("Newly created campground:");
//     console.log(campground);
//   }
// });

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
      res.render("index", {campgrounds: allCampgrounds});
    }
  })
  // This is how to render fixed data:
  // res.render("campgrounds", {campgrounds: campgrounds});
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
  res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
  // Find the campground with the given id in database
  Campground.findById(req.params.id, function(err, resultCampground) {
    if (err) {
      console.log(err);
    } else {
      // Render SHOW template for that campground
      res.render("show", {campground: resultCampground});
    }
  })

})

// Run app
app.listen(4000, function() {
  console.log("App running on localhost:4000");
});
