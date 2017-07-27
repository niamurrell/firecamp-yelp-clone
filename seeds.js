var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {name: "Lagrange Point",
  image: "https://www.trend-chaser.com/wp-content/uploads/sites/7/2016/11/featured-image-6.jpg",
  description: "Broad valley nestled in the peaceful gulch of the mountain range."},
  {name: "Peekline Ridge",
  image: "http://www.mountainphotography.com/images/large/201310_blueLakesWinterCamp.jpg",
  description: "Rocky edifices provide spectacular beauty under the mountain peak ridge."},
  {name: "Bolton Hill",
  image: "http://cdn.grindtv.com/uploads/2015/02/shutterstock_242371765.jpg",
  description: "Pristine slice of nature to become one with."},
  {name: "Summit Point",
  image: "http://cbsnews3.cbsistatic.com/hub/i/r/2017/02/02/2b766abd-de4a-4a2e-9a9b-877e3729cccb/thumbnail/620x350/ca132eeb2e04d9d15d3b8029e7dc76da/istock-513059696.jpg",
  description: "Forrested valley trails alongside a peaceful gleaming stream."},
  {name: "Hurdle's Lane",
  image: "http://www.switchbacktravel.com/sites/default/files/images/articles/Camping%20Chair%20header.jpg",
  description: "Tree-lined bridlepath leading to scenic coastal cliffs."},
  {name: "Braria Needles",
  image: "https://media.mnn.com/assets/images/2016/05/tree-camping-bavaria.jpg.838x0_q80.jpg",
  description: "Densely covered hillside pines so inviting you'll want to sleep there."},

]

function seedDb() {
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("Removed campgrounds!");
    data.forEach(function(seed) {
      Campground.create(seed, function (err, campground) {
        if (err) {
          console.log(err);
        } else {
          console.log("added a campground");
          Comment.create({
            text: "Never slept so well in my life!"
            author: "Noone Ever"
          }, function(err, comment) {
            if (err) {
              console.log(err);
            } else {
              campground.comments.push(comment);
              campground.save();
              console.log("Created new comment.");
            }
          })
        }
      })
    })
  });
}

module.exports = seedDb;
