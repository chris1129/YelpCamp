var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");

//index route
router.get("/",function(req,res){
    
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds, page: 'campgrounds'});
        }
    });
    //res.render("campgrounds",{campgrounds:campgrounds});
    
});


//handle create post logic
router.post("/",middleware.isLoggedIn,function(req,res){
   //get data from form and add to campgrounds array 
   // redirect to campgorund page
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var discrpt=req.body.description;
    var author={
        id:req.user._id,
        name:req.user.username
    }
    var newCampgrounds={name:name,price:price,image:image,description:discrpt,author:author};
    
    
    Campground.create(newCampgrounds,function(err,newlycreate){
        if(err){
            console.log(err);
        }else{
            console.log(newlycreate);
            res.redirect("/campgrounds");
        }
    });
    //campgrounds.push(newCampgrounds);
    
});

//create post
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});


//show post
router.get("/:id",function(req,res){
    //find camoground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCP){
       if(err){
           console.log("Error in find by id");
           console.log(err);
       } else{
           console.log(foundCP);
           res.render("campgrounds/show",{campground:foundCP});
       }
    });
    
    //show
    
    //res.send("THIS IS SHOW PAGE");
});
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership ,function(req,res){

        Campground.findById(req.params.id,function(err,foundCP){ 
            res.render("campgrounds/edit",{campground:foundCP });
        });
    
    
    
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campgrounds,function(err,updatedcampground){
       
       if(err){
           res.redirect("/campgrounds");
           console.log("putttttttttttt");
       }else{
           res.redirect("/campgrounds/"+updatedcampground._id);
       }
   }) ;
    
});

//DELETE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }   else{
            res.redirect("/campgrounds");
        } 
   });
});



module.exports=router;