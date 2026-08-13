const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const { isLoggedIn } = require("../../middleware");

router.post("/product/:productId/like", isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.productId;
        const alreadyLiked = req.user.wishList.some(
            id => id.toString() === productId
        );

        const update = alreadyLiked
            ? { $pull: { wishList: productId } }
            : { $addToSet: { wishList: productId } };

        const user = await User.findByIdAndUpdate(
            req.user._id,
            update,
            { new: true }
        ).populate("wishList");

        res.json({
            success: true,
            liked: !alreadyLiked,
            wishList: user.wishList
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

router.get("/wishlist", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishList");

        res.json({
            success: true,
            wishList: user.wishList
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

module.exports = router;
