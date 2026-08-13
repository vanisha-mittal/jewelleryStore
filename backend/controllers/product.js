const Product = require("../models/Product");


// ================================
// GET ALL PRODUCTS
// ================================

module.exports.index = async (req, res) => {

    try {

        const products = await Product
            .find({})
            .populate("author", "username role");

        res.render(
            "products/index",
            {
                products
            }
        );

    } catch (e) {

        console.error("PRODUCT INDEX ERROR:", e);

        res.status(500).render(
            "error",
            {
                err: e.message
            }
        );

    }

};


// ================================
// RENDER NEW PRODUCT FORM
// ================================

module.exports.renderNewForm = (req, res) => {

    res.render("products/new");

};


// ================================
// SHOW SINGLE PRODUCT
// ================================

module.exports.showProduct = async (req, res) => {

    try {

        const foundProduct = await Product
            .findById(req.params.id)
            .populate("reviews")
            .populate("author", "username");


        if (!foundProduct) {

            req.flash(
                "error",
                "Product not found."
            );

            return res.redirect(
                "/products"
            );

        }


        res.render(
            "products/show",
            {
                foundProduct
            }
        );

    } catch (e) {

        console.error(
            "SHOW PRODUCT ERROR:",
            e
        );

        res.status(500).render(
            "error",
            {
                err: e.message
            }
        );

    }

};


// ================================
// CREATE PRODUCT
// ================================

module.exports.createProduct = async (req, res) => {

    try {

        const {
            name,
            img,
            category,
            price,
            desc
        } = req.body;


        const newProduct =
            await Product.create({

                name,

                img,

                category,

                price,

                desc,

                author:
                    req.user
                        ? req.user._id
                        : null

            });


        req.flash(
            "success",
            "Product added successfully!"
        );


        return res.redirect(
            `/product/${newProduct._id}`
        );

    } catch (e) {

        console.error(
            "CREATE PRODUCT ERROR:",
            e
        );

        return res.status(500).render(
            "error",
            {
                err: e.message
            }
        );

    }

};


// ================================
// RENDER EDIT FORM
// ================================

module.exports.renderEditForm = async (
    req,
    res
) => {

    try {

        const foundProduct =
            await Product.findById(
                req.params.id
            );


        if (!foundProduct) {

            req.flash(
                "error",
                "Product not found."
            );

            return res.redirect(
                "/products"
            );

        }


        res.render(
            "products/edit",
            {
                foundProduct
            }
        );

    } catch (e) {

        console.error(
            "EDIT FORM ERROR:",
            e
        );

        res.status(500).render(
            "error",
            {
                err: e.message
            }
        );

    }

};


// ================================
// UPDATE PRODUCT
// ================================

module.exports.updateProduct = async (
    req,
    res
) => {

    try {

        const {
            name,
            img,
            category,
            price,
            desc
        } = req.body;


        await Product.findByIdAndUpdate(

            req.params.id,

            {
                name,
                img,
                category,
                price,
                desc
            },

            {
                runValidators: true
            }

        );


        req.flash(
            "success",
            "Product edited successfully!"
        );


        return res.redirect(
            `/product/${req.params.id}`
        );

    } catch (e) {

        console.error(
            "UPDATE PRODUCT ERROR:",
            e
        );

        return res.status(500).render(
            "error",
            {
                err: e.message
            }
        );

    }

};


// ================================
// DELETE PRODUCT
// ================================

module.exports.deleteProduct = async (
    req,
    res
) => {

    try {

        await Product.findByIdAndDelete(
            req.params.id
        );


        req.flash(
            "success",
            "Product deleted successfully!"
        );


        return res.redirect(
            "/products"
        );

    } catch (e) {

        console.error(
            "DELETE PRODUCT ERROR:",
            e
        );

        res.status(500).render(
            "error",
            {
                err: e.message
            }
        );

    }

};