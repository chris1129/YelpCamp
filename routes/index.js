var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

//root route
router.get("/",function(req,res){
    res.render("landing");
    
});

//show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle register logic
router.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        
       if(err){
           
           console.log(err);
           req.flash("error",err.message);//If user name exist, show error
           res.redirect("/register");
       } 
       passport.authenticate("local")(req,res,function(){
           req.flash("success","Hi "+user.username+" welcome");
           res.redirect("/campgrounds");
       })
        
    });
});

//LOGIN


router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});
//handle login logic
//app.post("/login",middelware,callback)
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    
});

//LOGOUT
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});



module.exports=router;
