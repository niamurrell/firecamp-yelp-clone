var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

// Create New Comment Route
router.get("/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
})

// Post New Comment Route
router.post("/", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, addedComment) {
        if (err) {
          console.log(err);
        } else {
          addedComment.author.id = req.user._id;
          addedComment.author.username = req.user.username;
          addedComment.save();
          campground.comments.push(addedComment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
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
