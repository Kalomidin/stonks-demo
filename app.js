const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      helmet         = require("helmet"),
      flash          = require("connect-flash"),
      session        = require("express-session"),
      moment         = require("moment"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      User           = require("./models/user");

// requiring routes     
const indexRoute      = require("./routes/index"),
      productRoute    = require("./routes/products"),
      commentRoute    = require("./routes/comments"),
      userRoute       = require("./routes/user"),
      passwordRoute   = require("./routes/password");

// connect to the DB
let url = process.env.DATABASEURL; // fallback in case global var not working
mongoose.connect(url,{
	// useNewUrlParser: true,
	// useCreateIndex: true
}).then(() => {
	console.log("Connected to DB");
}).catch(err=>{
	console.log("ERROR",err.message);
});

app.set("view engine", "ejs");
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = moment; // create local variable available for the application

//passport configuration
app.use(session({
  secret: "Mirali Ahmadli",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass currentUser to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is an authenticated user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// use routes
app.use("/", indexRoute);
app.use("/products", productRoute);
app.use("/products/:id/comments", commentRoute);
app.use("/users", userRoute);
app.use("/", passwordRoute);

app.listen(process.env.PORT || 3000, process.env.IP, () => console.log("The Stonks Server Has Started!"));
