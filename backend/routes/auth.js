const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("auth/signup");
});

router.post("/register", async (req, res, next) => {
    try {
        const { email, username, password, role } = req.body;

        if (!["buyer", "seller"].includes(role)) {
            req.flash("error", "Please select buyer or seller.");
            return res.redirect("/register");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "An account with this email already exists.");
            return res.redirect("/register");
        }

        const user = new User({
            email,
            username,
            role
        });

        const newUser = await User.register(user, password);

        req.login(newUser, (err) => {
            if (err) return next(err);

            req.flash("success", `Welcome to VELORA®, ${role} account created.`);
            res.redirect("/products");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back to VELORA®.");
        res.redirect("/products");
    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((sessionErr) => {
            if (sessionErr) return next(sessionErr);

            res.clearCookie("connect.sid");
            res.redirect("/login");
        });
    });
});

module.exports = router;
