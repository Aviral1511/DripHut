import OrderSchema from "../models/OrderSchema.js";

export const getAdminOrders = async(req, res) => {
    try {
        const orders = await OrderSchema.find().populate("user", "name email");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}

export const updateOrders = async (req, res) => {
    try {
        const order = await OrderSchema.findById(req.params.id).populate("user", "name");
        if(order) {
            order.status = req.body.status || order.status;
            order.isDelivered = 
                req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({message : "Order not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const order = await OrderSchema.findById(req.params.id);
        if(order) {
            await order.deleteOne();
            res.json({message : "Order deleted successfully"});
        } else {
            res.status(404).json({message : "Order not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}