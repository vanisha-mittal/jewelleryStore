const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/User");


// =========================
// REGISTER
// POST /api/auth/register
// =========================

router.post("/register", async (req, res) => {

    try {

        const {
            username,
            email,
            password,
            role
        } = req.body;


        // Username missing
        if (!username) {

            return res.status(400).json({
                success: false,
                message: "Please enter a username"
            });

        }


        // Email missing
        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Please enter your email"
            });

        }


        // Password missing
        if (!password) {

            return res.status(400).json({
                success: false,
                message: "Please enter a password"
            });

        }


        // Password length
        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });

        }


        // Role
        if (!role) {

            return res.status(400).json({
                success: false,
                message:
                    "Please select Buyer or Seller"
            });

        }


        // Validate role
        if (!["buyer", "seller"].includes(role)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please select a valid account type"
            });

        }


        // Check username
        const existingUsername =
            await User.findOne({
                username: username
            });


        if (existingUsername) {

            return res.status(409).json({
                success: false,
                message:
                    "Username already exists"
            });

        }


        // Check email
        const existingEmail =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingEmail) {

            return res.status(409).json({
                success: false,
                message:
                    "Email already registered"
            });

        }


        // Create user
        const user = new User({

            username: username,

            email:
                email.toLowerCase(),

            role: role

        });


        const newUser =
            await User.register(
                user,
                password
            );


        // Automatically login
        req.login(
            newUser,
            (err) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "Account created, but automatic login failed"
                    });

                }


                return res.status(201).json({

                    success: true,

                    message:
                        "Account created successfully",

                    user: {

                        _id:
                            newUser._id,

                        username:
                            newUser.username,

                        email:
                            newUser.email,

                        role:
                            newUser.role

                    }

                });

            }
        );

    } catch (error) {

        console.log(
            "REGISTER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to create account right now"

        });

    }

});


// =========================
// LOGIN
// POST /api/auth/login
// =========================
router.post("/login", async (req, res, next) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        passport.authenticate(
            "local",
            (err, user, info) => {

                if (err) {
                    return next(err);
                }

                // Wrong username OR wrong password
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid username or password"
                    });
                }

                req.login(user, (err) => {

                    if (err) {
                        return next(err);
                    }

                    return res.json({
                        success: true,
                        message: "Login successful",

                        user: {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            role: user.role
                        }
                    });

                });

            }
        )(req, res, next);

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to login right now"
        });

    }
});


// =========================
// CURRENT USER
// GET /api/auth/me
// =========================

router.get(
    "/me",
    (req, res) => {

        if (
            !req.isAuthenticated()
        ) {

            return res.status(401).json({

                loggedIn: false,

                user: null

            });

        }


        return res.json({

            loggedIn: true,

            user: {

                _id:
                    req.user._id,

                username:
                    req.user.username,

                email:
                    req.user.email,

                role:
                    req.user.role

            }

        });

    }
);


// =========================
// LOGOUT
// POST /api/auth/logout
// =========================

router.post(
    "/logout",
    (req, res, next) => {

        req.logout(
            (err) => {

                if (err) {

                    return next(err);

                }


                req.session.destroy(
                    (err) => {

                        if (err) {

                            return next(err);

                        }


                        res.clearCookie(
                            "connect.sid"
                        );


                        return res.json({

                            success: true,

                            message:
                                "Logged out successfully"

                        });

                    }
                );

            }
        );

    }
);


module.exports = router;