const express    = require("express"),
      router     = express.Router(),
      User       = require("../models/user"),
      Product = require("../models/product"),
      middleware = require("../middleware");
      
// User profile
router.get("/:id", middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err || !foundUser) {
      req.flash("error", "Something went wrong...");
      res.redirect("/products");
    } else {
      Product.find().where("author.id").equals(foundUser._id).exec((err, products) => {
        if (err) {
          req.flash("error", "Something went wrong...");
          res.redirect("/products");
        } else { res.render("users/show", { user: foundUser, products }); }
      });
    }
  });
});

// User shopping list
router.get("/:id/shopping", middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err || !foundUser) {
      req.flash("error", "Something went wrong...");
      res.redirect("/products");
    } else {
      res.render("users/shopping", { user: foundUser, products: foundUser.shoppingList});
    }
  });
});

// update shopping list
router.post("/:id/shopping/:id2", middleware.isLoggedIn, (req, res) => {
  console.log(req.body);
  User.findByIdAndUpdate(req.params.id, (err, foundUser) => {
    if (err) {
      req.flash("error", "Something went wrong...");
      return res.redirect("/products" + req.params.id2);
    }
	 Product.findByIdAndUpdate(req.params.id2, (err, foundProduct) => {
		 foundUser.shoppingList.push(foundProduct);
		  foundUser.save();
		  res.redirect("/products/");
	 });
	 // res.render("/users/"+User._id+"/shopping", {products: User.shoppingList});
  });
});

// show edit form
router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err || !foundUser) { return res.redirect("back"); }
    if (foundUser._id.equals(req.user._id)) {
      res.render("users/edit", { user: foundUser }); 
    } else {
      req.flash("error", "You don't have permission to do that");
      res.redirect("back");
    } 
  });
});

// update profile
router.put("/:id", middleware.isLoggedIn, (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate email
        req.flash("error", "That email has already been registered.");
        return res.redirect("/users" + req.params.id);
      } 
      // Some other error
      req.flash("error", "Something went wrong...");
      return res.redirect("/users" + req.params.id);
    }
    if (updatedUser._id.equals(req.user._id)) {
      res.redirect("/users/" + req.params.id);
    } else {
      req.flash("error", "You don't have permission to do that");
      res.redirect("/products");
    }
  });
});

module.exports = router;