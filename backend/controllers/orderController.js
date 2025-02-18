import CheckoutSchema from '../models/CheckoutSchema.js';
import CartSchema from '../models/CartSchema.js';
import ProductSchema from '../models/ProductSchema.js';
import OrderSchema from '../models/OrderSchema.js';

export const getMyOrders = async(req, res) => {
    try {
        //Find orders for user
        const orders = await OrderSchema.find({ userId: req.user._id }).sort({
            createdAt: -1
        }); // sorted most recent
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}

export const getOrderDetails = async(req, res) =>{
    try {
        const orderId = req.params.id;
        const order = await OrderSchema.findById(orderId).populate("user", "name email");
        if(!order){
            return res.status(404).json({message : "Order not found"});
        }
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}