const express = require("express");
const router = express.Router();

const Product = require("../../models/Product");
const { isLoggedIn, isSeller } = require("../../middleware");

router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("author", "username role")
            .populate("reviews");

        res.json({
            success: true,
            products
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

// =====================================
// MY PRODUCTS - SELLER
// GET /api/products/mine
// =====================================

router.get(
    "/products/mine",
    isLoggedIn,
    isSeller,
    async (req, res) => {

        try {

            const products = await Product
                .find({
                    author: req.user._id
                })
                .populate("author", "username role")
                .populate("reviews")
                .sort({
                    createdAt: -1
                });

            res.json({
                success: true,
                products
            });

        } catch (e) {

            console.error(
                "MY PRODUCTS ERROR:",
                e
            );

            res.status(500).json({
                success: false,
                message: e.message
            });

        }

    }
);

router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("author", "username role")
            .populate("reviews");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

router.post(
    "/products",
    isLoggedIn,
    isSeller,
    async (req, res) => {

        try {

            console.log(
                "CREATE PRODUCT BODY:",
                req.body
            );

            const {
                name,
                img,
                category,
                price,
                desc
            } = req.body;

            const product =
                await Product.create({

                    name,
                    img,
                    category,
                    price,
                    desc,

                    author: req.user._id

                });

            res.status(201).json({
                success: true,
                product
            });

        } catch (error) {

            console.log(
                "CREATE PRODUCT ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }
);


router.patch("/products/:id", isLoggedIn, isSeller, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        if (product.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own products."
            });
        }

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                img: req.body.img,
                price: req.body.price,
                desc: req.body.desc
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            product: updated
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

router.delete("/products/:id", isLoggedIn, isSeller, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        if (product.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own products."
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Product deleted successfully."
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

module.exports = router;
