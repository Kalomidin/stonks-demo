# [stonks app demo](https://stonks-demo.herokuapp.com/)
* Backend of our system is built by using __Node JS, Express JS framework, Mongo DB__
* Frontend of our system is built by using __HTML, CSS, jQuery, Bootstrap__

We tried to modularize our code as much as possible to make changes easily and handle and debug faster.  
The middleware/index.js file checks the references related to ownerships and whether user is logged in or not.  
Models folder is our Database structure and it is consisted of user, comments and products.  
Routes folder handles the functionality of our website.  
Public folder handles with the style of the demo and files in the View folder are the .ejs files which are the code templates.  

## Stack of our Stonks app
* Node JS
* Mongo DB
* Express JS

### Packages used in the app
* "async": "^2.6.0",
* "body-parser": "^1.18.2",
* "cloudinary": "^1.9.1",
* "connect-flash": "^0.1.1",
* "ejs": "^2.5.7",
* "express": "^4.16.2",
* "express-session": "^1.15.6",
* "geocoder": "^0.2.3",
* "google-geocoder": "^0.2.1",
* "helmet": "^3.9.0",
* "method-override": "^2.3.10",
* "moment": "^2.19.2",
* "mongoose": "^5.7.5",
* "multer": "^1.3.0",
* "navigator": "^1.0.1",
* "nodemailer": "^4.4.0",
* "passport": "^0.4.0",
* "passport-local": "^1.0.0",
* "passport-local-mongoose": "^4.4.0"

### Cloud Services  and IDE used in the app
* __Goorm IDE__ [link](https://ide.goorm.io/)
* __Cloudinary Upload API__ ([link](https://cloudinary.com/))
* __Google Cloud Platform__ ([link](https://cloud.google.com/)) (__*NOTE!:__ Google Cloud APIs are not available right now due to some security issues)
  * __Google Maps Geocoder API__ 
  * __Google Maps JavaScript API__
* __MongoDB Atlas__ ([link](https://www.mongodb.com/cloud/atlas)) on __AWS__ ([link](https://aws.amazon.com/))
