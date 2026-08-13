const express = require("express");
const router = express.Router();

const Product = require("../../models/Product");
const Review = require("../../models/Review");
const {
    isLoggedIn
} = require("../../middleware");


// ==========================================
// ADD REVIEW
// POST /api/products/:productId/reviews
// ==========================================

router.post(
    "/products/:productId/reviews",
    isLoggedIn,
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const {
                rating,
                comment
            } = req.body;


            // Validate input

            if (
                rating === undefined ||
                !comment ||
                !comment.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Rating and comment are required."

                });

            }


            if (
                Number(rating) < 1 ||
                Number(rating) > 5
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Rating must be between 1 and 5."

                });

            }


            // Find product

            const product =
                await Product.findById(productId);


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found."

                });

            }


            // Create review

            const review = await Review.create({
    rating,
    comment: comment.trim()
});

product.reviews.push(review._id);

await product.save();

            // Recalculate average rating

            const populatedProduct =
                await product.populate("reviews");


            const total =
                populatedProduct.reviews.reduce(
                    (sum, review) =>
                        sum + review.rating,
                    0
                );


            product.avgRating =
                total /
                populatedProduct.reviews.length;


            await product.save();


            // Return updated product

            const updatedProduct =
                await Product.findById(productId)
                    .populate("reviews")
                    .populate(
                        "author",
                        "username role"
                    );


            return res.status(201).json({

                success: true,

                message:
                    "Review added successfully.",

                review,

                product: updatedProduct

            });

        } catch (error) {

            console.error(
                "ADD REVIEW ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


module.exports = router;