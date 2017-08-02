var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

// Show All Campgrounds - Route
router.get("/", function(req, res) {
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

// Post new campground - route
router.post("/", isLoggedIn, function(req, res) {
  // Get submitions from form and create a new db document, redirect to page
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, image: image, description: description, author: author};
  Campground.create(newCampground, function(err, addedCamp) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// Create new campground - route
router.get("/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// Show a campground - route
router.get("/:id", isLoggedIn, function(req, res) {
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

// Edit a campground - route
router.get("/:id/edit", function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", {campground: foundCampground});
    }
  })
})

// Update a campground - route
router.put("/:id", function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

// Destroy a campground - route
router.delete("/:id", function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  })
})


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
