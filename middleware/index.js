var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middlewareObj={};
middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){//is user logged in?
       
        Campground.findById(req.params.id,function(err,foundCP){
            //console.log("req______________________");
            //console.log(req);
            
           if(err){
               
               res.redirect("back");
           } else{
               if(foundCP.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error","You don't have permission to do that");
                   res.redirect("back");
               }
               
           }
        });
    }else{
        req.flash("error","You need to login");
        res.redirect("back");
    }
}
    
    
    
middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){//is user logged in?
        Comment.findById(req.params.comment_id,function(err,foundCMT){
           if(err){
               res.redirect("back");
           } else{
               if(foundCMT.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error","You don't have permission to do that.")
                   res.redirect("back");
               }
               
           }
        });
    }else{
        req.flash("error","You need to login");
        res.redirect("back");
    }
}

//middleware
middlewareObj.isLoggedIn=function(req,res,next){//template for middleware
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error","Please login!");
  res.redirect("/login");
    
};


module.exports=middlewareObj;