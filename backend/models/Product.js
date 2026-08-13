const mongoose = require("mongoose");

const Review = require("./Review");
const User = require("./User");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },

    img: {
        type: String,
        trim: true,
        required: true
    },

    category: {
        type: String,
        enum: [
            "NECKLACES",
            "RINGS",
            "EARRINGS",
            "BRACELETS"
        ],
        required: true
    },

    price: {
        type: Number,
        min: 0,
        required: true
    },

    desc: {
        type: String,
        trim: true,
        required: true
    },

    avgRating: {
        type: Number,
        default: 0
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});


productSchema.pre("save", async function (next) {

    if (this.isModified("reviews") && this.reviews.length > 0) {

        await this.populate("reviews");

        const total = this.reviews.reduce(
            (sum, r) => sum + r.rating,
            0
        );

        this.avgRating = total / this.reviews.length;

    } else if (this.reviews.length === 0) {

        this.avgRating = 0;

    }

    next();
});


productSchema.post("findOneAndDelete", async function (product) {

    if (product && product.reviews.length > 0) {

        await Review.deleteMany({
            _id: {
                $in: product.reviews
            }
        });

    }

});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;