const express = require("express"),
	app = express(),
	homeController = require("./controllers/homeController"),
	errorController = require("./controllers/errorController"),
	contactsController = require("./controllers/contactsController"),
	guestsController = require("./controllers/guestsController"),
	usersController = require("./controllers/usersController"),
	layouts = require("express-ejs-layouts"),
	mongoose = require("mongoose"),
	Contact = require("./models/contact"),
	router = require("./routes/index"), // requiring router 
	expressValidator = require("express-validator"),
	passport = require("passport"),
	expressSession = require("express-session"),
	cookieParser = require("cookie-parser"),
	User = require("./models/user"),
	connectFlash = require("connect-flash");

app.use(cookieParser("secretCuisine123"));
app.use(
	expressSession({
		secret: "secretCuisine123",
		cookie: {
			maxAge: 4000000,
		},
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const methodOverride = require("method-override");
app.use(
	methodOverride("_method", {
		methods: ["POST", "GET"],
	})
);

app.use(connectFlash());

app.use((req, res, next) => {
	res.locals.flashMessages = req.flash();
	res.locals.loggedIn = req.isAuthenticated();
	res.locals.currentUser = req.user;
	next();
});

mongoose.connect(
	"mongodb+srv://s0579282:hgLKwrCavRkboojX@weddingapp.al8c8xa.mongodb.net",
	{
		useNewUrlParser: true,
	}
);

const db = mongoose.connection;

db.once("open", () => {
	console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("token", process.env.TOKEN || "WedPlannerToken");
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index");
});

app.use(expressValidator());

app.listen(app.get("port"), () => {
	console.log(`Server running at http://localhost:${app.get("port")}`);
});

app.use("/", router);