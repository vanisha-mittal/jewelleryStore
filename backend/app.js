const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");


// dotenv
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


// =========================
// ROUTES
// =========================

const productRoute = require("./routes/product");
const reviewRoute = require("./routes/review");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const paymentRoutes = require("./routes/payment");


// API ROUTES
const authApi = require("./routes/api/auth");
const productApi = require("./routes/api/productapi");
const cartApi = require("./routes/api/cart");
const wishlistApi = require("./routes/api/wishlist");
const reviewApi = require("./routes/api/review");


const app = express();


// =========================
// DATABASE
// =========================

const dbURL =
    process.env.dbURL ||
    "mongodb://localhost:27017/velora-jewellery";

mongoose
    .connect(dbURL)
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.log("DB error:", err.message);
    });


// =========================
// SESSION
// =========================

const configSession = {

    secret:
        process.env.SESSION_SECRET ||
        "velora-secret-change-this",

    resave: false,

    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

};


// =========================
// MIDDLEWARE
// =========================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// IMPORTANT FOR REACT JSON REQUESTS
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(
    methodOverride("_method")
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// =========================
// SESSION + PASSPORT
// =========================

app.use(
    session(configSession)
);

app.use(flash());

app.use(
    passport.initialize()
);

app.use(
    passport.session()
);


// Passport Local Strategy
passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// =========================
// LOCALS
// =========================

app.use((req, res, next) => {

    res.locals.currentUser =
        req.user || null;

    res.locals.success =
        req.flash("success");

    res.locals.error =
        req.flash("error");

    next();

});


// =========================
// HOME
// =========================

app.get("/", (req, res) => {

    res.redirect("/products");

});


// =========================
// EJS / SERVER ROUTES
// =========================

app.use(productRoute);

app.use(reviewRoute);

app.use(authRoute);

app.use(cartRoute);

app.use(paymentRoutes);


// =========================
// REACT API ROUTES
// =========================

// Authentication
app.use(
    "/api/auth",
    authApi
);


// Products
app.use(
    "/api",
    productApi
);


// Cart
app.use(
    "/api",
    cartApi
);


// Wishlist
app.use(
    "/api",
    wishlistApi
);


// Reviews
app.use(
    "/api",
    reviewApi
);


// =========================
// ERROR HANDLER
// =========================

app.use(
    (err, req, res, next) => {

        console.error("SERVER ERROR:");
        console.error(err);

        if (
            req.path.startsWith("/api")
        ) {

            return res.status(500).json({

                success: false,

                message: err.message

            });

        }

        res.status(500).render(
            "error",
            {
                err: err.message
            }
        );

    }
);


// =========================
// SERVER
// =========================

const PORT =
    process.env.PORT || 8080;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `VELORA server running on port ${PORT}`
        );

    }
);