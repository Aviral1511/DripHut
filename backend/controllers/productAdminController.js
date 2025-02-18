import ProductSchema from "../models/ProductSchema.js";

export const getAdminProducts = async(req, res) => {
    try {
        const products = await ProductSchema.find({});
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}