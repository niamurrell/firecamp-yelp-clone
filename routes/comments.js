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

// Edit a comment - route
router.get("/:comment_id/edit", checkCommentOwner, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("Back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  })
})

// Update a comment - route
router.put("/:comment_id", checkCommentOwner, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

// Delete a comment - route
router.delete("/:comment_id", checkCommentOwner, function(req, res) { 
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkCommentOwner(req, res, next) {
  if (req.isAuthenticated()) { // is user logged in?
    Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      if (foundComment.author.id.equals(req.user.id)) {
        next();
      } else {
        res.redirect("back");
      }
    }
  })
  } else { //if not logged in
    res.redirect("back");
  }
}

module.exports = router;
