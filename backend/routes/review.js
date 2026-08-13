const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Review = require("../models/Review");
const { validateReview, isLoggedIn } = require("../middleware");

router.post(
    "/product/:id/review",
    isLoggedIn,
    validateReview,
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                req.flash("error", "Product not found.");
                return res.redirect("/products");
            }

            const review = new Review({
                rating: req.body.rating,
                comment: req.body.comment,
                author: req.user._id
            });

            await review.save();

            product.reviews.push(review._id);
            await product.save();

            req.flash("success", "Review added successfully!");
            res.redirect(`/product/${req.params.id}`);
        } catch (e) {
            res.status(500).render("error", { err: e.message });
        }
    }
);

module.exports = router;
