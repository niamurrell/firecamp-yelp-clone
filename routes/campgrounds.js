var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware")

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
router.post("/", middleware.isLoggedIn, function(req, res) {
  // Get submissions from form and create a new db document, redirect to page
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, price: price, image: image, description: description, author: author};
  Campground.create(newCampground, function(err, addedCamp) {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Campground added!");
      res.redirect("/campgrounds");
    }
  });
});

// Create new campground - route
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// Read a campground - route
router.get("/:id", function(req, res) {
  // Find the campground with the given id in database
  Campground.findById(req.params.id).populate("comments").exec(function(err, resultCampground) {
    if (err) {
      req.flash("error", "No such campground.");
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      console.log(resultCampground);
      // Render SHOW template for that campground
      res.render("campgrounds/show", {campground: resultCampground});
    }
  })
})

// Edit a campground - route
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", {campground: foundCampground});
  })
});

// Update a campground - route
router.put("/:id", middleware.checkCampgroundOwner, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground updated!");
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

// Destroy a campground - route
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground deleted!");
      res.redirect("/campgrounds");
    }
  })
})

module.exports = router;
