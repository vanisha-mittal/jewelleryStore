const Joi = require("joi");

const productSchema = Joi.object({

    name: Joi.string()
        .trim()
        .required(),

    img: Joi.string()
        .trim()
        .required(),

    category: Joi.string()
        .valid(
            "NECKLACES",
            "RINGS",
            "EARRINGS",
            "BRACELETS"
        )
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    desc: Joi.string()
        .trim()
        .required(),

});


const reviewSchema = Joi.object({

    rating: Joi.number()
        .min(0)
        .max(5)
        .required(),

    comment: Joi.string()
        .trim()
        .required(),

});


module.exports = {
    productSchema,
    reviewSchema
};