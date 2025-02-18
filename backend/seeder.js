import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductSchema from "./models/ProductSchema.js";
import User from "./models/UserSchema.js";
import CartSchema from "./models/CartSchema.js";
import {products} from "./data/products.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    try {
        //Clear exisiting data
        await User.deleteMany();
        await ProductSchema.deleteMany();
        await CartSchema.deleteMany();

        //Craete new user
        const createdUser = await User.create({
            name : "Admin User",
            email : "admin@example.com",
            password : "123456",
            role : "admin",
        });

        //Assigning default userId to products
        const userId = createdUser._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user : userId };
        });

        //Insert Products in database
        await ProductSchema.insertMany(sampleProducts);

        console.log("Product data seeded successfully");
        process.exit();
    } catch (error) {
        console.error("Error seeding data: ", error);
        process.exit(1);
    }
}
seedData();