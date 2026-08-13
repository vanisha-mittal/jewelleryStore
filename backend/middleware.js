const Product = require("./models/Product");
const { productSchema, reviewSchema } = require("./Schema");

const validateProduct = (req, res, next) => {

    let {
        name,
        img,
        category,
        price,
        desc
    } = req.body;

    const { error } = productSchema.validate({
        name,
        img,
        category,
        price,
        desc
    });

    if (error) {
        console.log(error.details);

        return res.render("error");
    }

    next();
};
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate({
        rating: req.body.rating,
        comment: req.body.comment
    });

    if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("back");
    }

    next();
};

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Please login first!");
        return res.redirect("/login");
    }
    next();
};

const isSeller = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "seller") {
        req.flash("error", "Seller permission required.");
        return res.redirect("/products");
    }
    next();
};

const isBuyer = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "buyer") {
        req.flash("error", "Buyer permission required.");
        return res.redirect("/products");
    }
    next();
};

const isProductAuthor = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect("/products");
        }

        if (!product.author || product.author.toString() !== req.user._id.toString()) {
            req.flash("error", "You do not have permission to do that.");
            return res.redirect(`/product/${req.params.id}`);
        }

        next();
    } catch (e) {
        next(e);
    }
};

module.exports = {
    validateProduct,
    validateReview,
    isLoggedIn,
    isSeller,
    isBuyer,
    isProductAuthor
};
