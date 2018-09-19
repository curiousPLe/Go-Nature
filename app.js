var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// USE/SET
mongoose.connect("mongodb://localhost/goNature");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static("node_modules/bootstrap/dist/js")); // redirect bootstrap JS
app.use('/js', express.static("node_modules/jquery/dist")); // redirect JS jQuery
app.use('/css', express.static("node_modules/bootstrap/dist/css")); // redirect CSS bootstrap

//SET UP SCHEMA
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   location: String,
});
//SET UP MODEL
var Campground = mongoose.model("Campground",campgroundSchema);

// SET ROUTES
app.get("/", function(req,res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if (err){
            console.log(err);
        }else{
            res.render("index",{campgrounds:allCampgrounds});      
        }
    })
})

app.post("/campgrounds", function(req, res){
    var name = req.body.campName;
    var image = req.body.campURL;
    var location = req.body.campLocation;
    var post = {name,image,location};
    Campground.create(post,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new",function(req, res) {
    res.render("new")
})

app.get("/campgrounds/:id",function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err){
            console.log(err);
        } else {
            res.render("show",{campground:foundCamp});
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has been connected");
});
