const express = require("express");

const router = express.Router();

const {
    validateProduct,
    isLoggedIn,
    isSeller,
    isProductAuthor
} = require("../middleware");

const productController =
    require("../controllers/product");


// ================================
// PRODUCTS
// ================================

router.get(
    "/products",
    productController.index
);


// ================================
// NEW PRODUCT
// ================================

router.get(
    "/product/new",
    isLoggedIn,
    isSeller,
    productController.renderNewForm
);


// ================================
// SHOW PRODUCT
// ================================

router.get(
    "/product/:id",
    isLoggedIn,
    productController.showProduct
);


// ================================
// CREATE PRODUCT
// ================================

router.post(
    "/products",
    isLoggedIn,
    isSeller,
    validateProduct,
    productController.createProduct
);


// ================================
// EDIT PRODUCT
// ================================

router.get(
    "/product/:id/edit",
    isLoggedIn,
    isSeller,
    isProductAuthor,
    productController.renderEditForm
);


// ================================
// UPDATE PRODUCT
// ================================

router.patch(
    "/product/:id",
    isLoggedIn,
    isSeller,
    isProductAuthor,
    validateProduct,
    productController.updateProduct
);


// ================================
// DELETE PRODUCT
// ================================

router.delete(
    "/product/:id",
    isLoggedIn,
    isSeller,
    isProductAuthor,
    productController.deleteProduct
);


module.exports = router;