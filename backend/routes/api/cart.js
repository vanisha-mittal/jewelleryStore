const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Product = require("../../models/Product");
const { isLoggedIn } = require("../../middleware");

router.get("/cart", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("cart");

        const totalAmount = user.cart.reduce(
            (sum, product) => sum + product.price,
            0
        );

        res.json({
            success: true,
            cart: user.cart,
            totalAmount
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

router.post("/cart/:productId", isLoggedIn, async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { cart: product._id } },
            { new: true }
        ).populate("cart");

        res.json({
            success: true,
            cart: user.cart
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

router.delete("/cart/:productId", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { cart: req.params.productId } },
            { new: true }
        ).populate("cart");

        res.json({
            success: true,
            cart: user.cart
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

module.exports = router;
