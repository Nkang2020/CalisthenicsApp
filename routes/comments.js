var express = require("express");
var router  = express.Router({mergeParams: true});
var Calisthenics = require("../models/calisthenics");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments routes
router.get("/calisthenics/:id/comments/new",middleware.isLoggedIn, function(req, res){
    // find move by id
    Calisthenics.findById(req.params.id, function(err, move){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {move: move});
        }
    });
});

router.post("/calisthenics/:id/comments",middleware.isLoggedIn, function(req, res){
   //lookup move using ID
   Calisthenics.findById(req.params.id, function(err, move){
       if(err){
           console.log(err);
           res.redirect("/calisthenics");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
              req.flash("error", "Something went wrong");
              console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               move.comments.push(comment);
               move.save();
               console.log(req.body.comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/calisthenics/' + move._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/calisthenics/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {move_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/calisthenics/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/calisthenics/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/calisthenics/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/calisthenics/" + req.params.id);
       }
    });
});

module.exports = router;

