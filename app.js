var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    Campground=require("./models/campground.js"),
    seedDB=require("./seeds.js"),
    Comment=require("./models/comment"),
    passport=require("passport"),
    Localstrategy=require("passport-local"),
    User=require("./models/user"),
    flash=require("connect-flash"),
    methodOverride=require("method-override");
    
var commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes=require("./routes/index");
    
    

mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost/yelp_camp_v6");


//seedDB();//Seed the database
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//Passport Config
app.use(require("express-session")({
    secret:"I am handsome",
    resave:false,
    saveUninitialized:false
}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    
    console.log("Yelpcamp server has started");
    
});

