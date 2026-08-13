const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");

require("dotenv").config();

const dbURL =
    process.env.dbURL ||
    "mongodb://localhost:27017/velora-jewellery";


const products = [

    {
        name: "Diamond Tennis Necklace",

        img: "/products/diamond_tennis_necklace_1786549930643.png",

        category: "NECKLACES",

        price: 5490,

        desc:
            "A timeless diamond tennis necklace crafted to bring refined brilliance to every occasion."
    },


    {
        name: "Diamond Drop Earrings",

        img: "/products/diamond_drop_earrings_1786550119275.png",

        category: "EARRINGS",

        price: 3290,

        desc:
            "Elegant diamond drop earrings designed with a refined silhouette and luminous finish."
    },


    {
        name: "Emerald Halo Ring",

        img: "/products/emerald_halo_ring_1786550065039.png",

        category: "RINGS",

        price: 4290,

        desc:
            "A statement emerald ring surrounded by brilliant stones for a timeless luxury look."
    },


    {
        name: "Sculptural Gold Ring",

        img: "/products/sculptural_gold_ring_1786550137123.png",

        category: "RINGS",

        price: 2490,

        desc:
            "A contemporary sculptural gold ring designed for understated everyday elegance."
    }

];


async function seedDB() {

    try {

        // Connect to MongoDB
        await mongoose.connect(dbURL);

        console.log("Database connected");


        // Find an existing seller
        const seller = await User.findOne({
            role: "seller"
        });


        if (!seller) {

            console.log(
                "No seller account found."
            );

            console.log(
                "Please create a seller account first."
            );

            await mongoose.connection.close();

            return;

        }


        console.log(
            `Using seller: ${seller.username}`
        );


        // Remove only these seeded products
        await Product.deleteMany({
            name: {
                $in: products.map(
                    product => product.name
                )
            }
        });


        // Add seller as author
        const productsWithAuthor =
            products.map(product => ({

                ...product,

                author: seller._id

            }));


        // Insert products
        const insertedProducts =
            await Product.insertMany(
                productsWithAuthor
            );


        console.log(
            `${insertedProducts.length} products added successfully.`
        );


        insertedProducts.forEach(product => {

            console.log(
                `✓ ${product.name}`
            );

        });


        await mongoose.connection.close();

        console.log(
            "Database connection closed."
        );

    } catch (error) {

        console.error(
            "SEED ERROR:",
            error
        );

        await mongoose.connection.close();

    }

}
