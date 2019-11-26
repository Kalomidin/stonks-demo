const express    = require("express"),
      router     = express.Router({ mergeParams: true }),
      Product = require("../models/product"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");

// comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
  //lookup product using id
  Product.findById(req.params.id, (err, product) => {
    if (err) { 
      console.log(err);
      res.redirect("/products");
    }
    else {
      //create new comment
		// console.log(req.body.comment);
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong.");
          console.log(err);
        } else {
			// console.log(comment);
          //add username and id to comments
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
		  comment.rating = parseInt(req.body.rating);
          //save comment
          comment.save();
          //connect new comment to product
          product.comments.push(comment);
		  product.rating += comment.rating;
          product.save();
          //redirect to product show page
          req.flash("success", "Successfully added comment");
          res.redirect("/products/" + product._id);
        }
      });
    }
  });
});

// commnet Update
router.put("/:comment_id", middleware.checkCommentOwenership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) { res.redirect("back"); }
  });
  Comment.findByIdAndUpdate(req.params.comment_id,  req.body.rating, (err, updatedRating) => {
    if (err) { res.redirect("back"); }
    else { res.redirect("/products/" + req.params.id); }
  });
});

// comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwenership, (req, res) => {
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) { res.redirect("back"); }
    else {
      req.flash("success", "Comment deleted");
      res.redirect("/products/" + req.params.id);
    }
  });
});

module.exports = router;
