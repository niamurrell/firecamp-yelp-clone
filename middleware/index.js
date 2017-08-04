var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwner = function(req, res, next) {
	  if (req.isAuthenticated()) { // is user logged in?
    Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
			req.flash("error", "Campground not found.");
      res.redirect("back");
    } else {
      if (foundCampground.author.id.equals(req.user.id)) {
        // First is an object, second is a string --> MUST USE .equals()
        next();
      } else {
				req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
      }
    }
  })
  } else { //if not logged in
		req.flash("error", "You must be logged in to do that.");
		res.redirect("back");
  }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
  if (req.isAuthenticated()) { // is user logged in?
    Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
			req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      if (foundComment.author.id.equals(req.user.id)) {
        next();
      } else {
				req.flash("error", "That's not your comment to edit.");
        res.redirect("back");
      }
    }
  })
	} else { //if not logged in
		req.flash("error", "You must be logged in to do that.");
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
	}
	req.flash("error", "You must be logged in to do that.");
  res.redirect("/login");
}


module.exports = middlewareObj;