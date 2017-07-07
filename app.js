var express = require("express"),
    app = express()
    bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/campgrounds", function(req, res) {
  var campgrounds = [
    {name: "Bolton Hill", image: "http://cdn.grindtv.com/uploads/2015/02/shutterstock_242371765.jpg"},
    {name: "Lagrange Point", image: "https://www.trend-chaser.com/wp-content/uploads/sites/7/2016/11/featured-image-6.jpg"},
    {name: "Summit Point", image: "http://cbsnews3.cbsistatic.com/hub/i/r/2017/02/02/2b766abd-de4a-4a2e-9a9b-877e3729cccb/thumbnail/620x350/ca132eeb2e04d9d15d3b8029e7dc76da/istock-513059696.jpg"},
    {name: "Hurdle's Lane", image: "http://www.switchbacktravel.com/sites/default/files/images/articles/Camping%20Chair%20header.jpg"}
  ];

  res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
  res.send("Post route working");
});


app.listen(3000, function() {
  console.log("App running on localhost:3000");
});
