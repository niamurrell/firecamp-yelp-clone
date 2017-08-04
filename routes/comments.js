var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware")

// Create New Comment Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
})

// Post New Comment Route
router.post("/", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      req.flash("error", "Something went wrong.");
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, addedComment) {
        if (err) {
          req.flash("error", "Something went wrong.");
          console.log(err);
        } else {
          addedComment.author.id = req.user._id;
          addedComment.author.username = req.user.username;
          addedComment.save();
          campground.comments.push(addedComment);
          campground.save();
          req.flash("success", "Success! Comment added.");
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  })
})

// Edit a comment - route
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("Back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  })
})

// Update a comment - route
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      req.flash("success", "Comment updated!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

// Delete a comment - route
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res) { 
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

module.exports = router;
