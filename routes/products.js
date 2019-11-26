const express    = require("express"),
      router     = express.Router(),
      Product = require("../models/product"),
      middleware = require("../middleware"), // automatically looks for index.js
      geocoder   = require("google-geocoder"),
      multer     = require('multer'),
      cloudinary = require('cloudinary'),
	  navigator  = require('navigator');

// var geo = geocoder({
//   key: 'APIKEY'
// });
// =========== Image Upload Configuration =============
//multer config
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter});

// cloudinary config
cloudinary.config({ 
  cloud_name: 'mirali', 
  api_key: 861977739927416, 
  api_secret: process.env.UPLOAD
});

// ============= ROUTES ==============
// Define escapeRegex function to avoid regex DDoS attack
const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// INDEX -show all products
router.get("/", (req, res) => {
  let noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Product.find({name: regex}, function(err, allProducts) {
      if (err) { console.log(err); }
      else {
        if (allProducts.length < 1) {
          noMatch = "No products found, please try again.";
        }
        res.render("products/index", { products: allProducts, page: "products", noMatch: noMatch });  
      }
    });
  } else {
    // Get all products from DB
    Product.find({}, function(err, allProducts) {
      if (err) { console.log(err); }
      else {
        res.render("products/index", { products: allProducts, page: "products", noMatch: noMatch });  
      }
    }); 
  }
});

// CREATE - add new products to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
  // cloudinary
  cloudinary.uploader.upload(req.file.path, (result) => {
     // get data from the form
    let { name, image, price, description, author } = { 
      name: req.body.name,
      image: {
        // add cloudinary public_id for the image to the product object under image property
        id: result.public_id,
        // add cloudinary url for the image to the product object under image property
        url: result.secure_url
      },
      price: req.body.price,
      description: req.body.description,
      // get data from the currenly login user
      author: {
        id: req.user._id,
        username: req.user.username
      }
    };
  	// console.log(req.body);
    // geocoder for Google Maps
		// geo.find(req.body.location, (err, data) => {
		// if (err) throw err;
		
		// // if(data.length > 0){
		// let lat = data[0].location.lat;
		// let	lng = data[0].location.lng;
		// let	location = data[0].formatted_address;
		// }
		// else{
		// 	let lat = 36.372;
		// 	let	lng = 127.363;
		// 	let	location = "KAIST";
		// }
	  // console.log(req.body);
	  let location = req.body.location;
      let newProduct = { name, image, price, description, author, location};
    
      // create a new product and save to DB
      Product.create(newProduct, (err, newlyCreated) => {
        if (err) { console.log(err); }
        else {
          // redirect back to product page
          res.redirect("/products");
        }
      });
    // });
  });
});

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => res.render("products/new"));

// SHOW - shows more info about one product
router.get("/:id", (req, res) => {
  //find the product with provided id in DB
  Product.findById(req.params.id).populate("comments").exec((err, foundProduct) => {
    if (err || !foundProduct) {
      req.flash("error", "Product not found");
      res.redirect("back");
    } else {
      //render show template with that product
      res.render("products/show", { product: foundProduct });
    }
  });
});

// edit product route
// store original image id and url
let imageId, imageUrl;
router.get("/:id/edit", middleware.checkProductOwenership, (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    imageId = foundProduct.image.id;
    imageUrl = foundProduct.image.url;
    if (err) { res.redirect("/products") }
    else { res.render("products/edit", { product: foundProduct }); } 
  });
});

// update product route
router.put("/:id", middleware.checkProductOwenership, upload.single('image'), (req, res) => {
  // if no new image to upload
  if (!req.file) {
    let { name, image, price, description, author } = { 
      name: req.body.product.name,
      image: {
        // add cloudinary public_id for the image to the product object under image property
        id: imageId,
        // add cloudinary url for the image to the product object under image property
        url: imageUrl
      },
      price: req.body.product.price,
      description: req.body.product.description,
      // get data from the currenly login user
      author: {
        id: req.user._id,
        username: req.user.username
      }
    };
    // geo.find(req.body.product.location, (err, data) => {
    //   if (err) throw err;
    //   let lat = data[0].location.lat,
    //       lng = data[0].location.lng,
    //       location = data[0].formatted_address;
	  let location = req.body.location;
	  // console.log(req.body);
      let newData = { name, image, price, description, author, location};
      
      //find and update the correct product
      Product.findByIdAndUpdate(req.params.id, {$set: newData}, (err, updatedProduct) => {
        if (err) {
          req.flash("error", err.message);
          res.redirect("/products");
        } else {
          //redirect somewhere(show page)
          req.flash("success","Product Updated!");
          res.redirect("/products/" + req.params.id);
        }
      // });
    });
  } else {
    // cloudinary
    cloudinary.uploader.upload(req.file.path, (result) => {
      let { name, image, price, description, author } = { 
        name: req.body.product.name,
        image: {
          // add cloudinary public_id for the image to the product object under image property
          id: result.public_id,
          // add cloudinary url for the image to the product object under image property
          url: result.secure_url
        },
        price: req.body.product.price,
        description: req.body.product.description,
        // get data from the currenly login user
        author: {
          id: req.user._id,
          username: req.user.username
        }
      };
      
      // remove original/old product image on cloudinary
      cloudinary.uploader.destroy(imageId, (result) => { console.log(result) });
      
      // geo.find(req.body.product.location, (err, data) => {
      //   if (err) throw err;
      //   let lat = data[0].location.lat,
      //       lng = data[0].location.lng,
      //       location = data[0].formatted_address;
		let location = req.body.location;
        let newData = { name, image, price, description, author, location};
        
        //find and update the correct product
        Product.findByIdAndUpdate(req.params.id, {$set: newData}, (err, updatedProduct) => {
          if (err) {
            req.flash("error", err.message);
            res.redirect("/products");
          } else {
            //redirect somewhere(show page)
            req.flash("success","Product Updated!");
            res.redirect("/products/" + req.params.id);
          }
        });
      // });
    });
  }
});

// destroy product route
router.delete("/:id", middleware.checkProductOwenership, (req, res) => {
  Product.findByIdAndRemove(req.params.id, err => {
    if (err) { res.redirect("/products"); }
    else {
      req.flash("success", "Product removed!");
      res.redirect("/products"); }
  });
});

module.exports = router;
