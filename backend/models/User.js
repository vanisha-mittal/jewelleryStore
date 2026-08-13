const mongoose = require("mongoose");
const passportLocalMongoose =
    require("passport-local-mongoose");


const userSchema = new mongoose.Schema({

    email: {

        type: String,

        required: true,

        trim: true,

        lowercase: true,

        unique: true

    },


    role: {

        type: String,

        enum: [
            "buyer",
            "seller"
        ],

        required: true,

        default: "buyer"

    },


    wishList: [

        {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "Product"

        }

    ],


    cart: [

        {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "Product"

        }

    ]

},
{
    timestamps: true
});


userSchema.plugin(
    passportLocalMongoose
);


module.exports =
    mongoose.model(
        "User",
        userSchema
    );