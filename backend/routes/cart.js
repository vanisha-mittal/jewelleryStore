const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");
const { isLoggedIn } = require("../middleware");

router.get("/user/cart", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("cart");

        const totalAmount = user.cart.reduce(
            (sum, product) => sum + product.price,
            0
        );

        const productInfo = user.cart.map((product) => product.desc).join(",");

        res.render("cart/cart", {
            user,
            totalAmount,
            productInfo
        });
    } catch (e) {
        res.status(500).render("error", { err: e.message });
    }
});

router.post(
    "/user/:productId/add",
    isLoggedIn,
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.productId);

            if (!product) {
                req.flash("error", "Product not found.");
                return res.redirect("/products");
            }

            await User.findByIdAndUpdate(
                req.user._id,
                { $addToSet: { cart: product._id } }
            );

            req.flash("success", "Product added to cart.");
            res.redirect("/user/cart");
        } catch (e) {
            res.status(500).render("error", { err: e.message });
        }
    }
);

router.delete("/cart/:id", isLoggedIn, async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { cart: req.params.id } }
        );

        req.flash("success", "Item removed from cart!");
        res.redirect("/user/cart");
    } catch (e) {
        req.flash("error", "Could not remove item from cart.");
        res.redirect("/user/cart");
    }
});

module.exports = router;
