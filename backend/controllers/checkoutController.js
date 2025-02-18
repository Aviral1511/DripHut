import CheckoutSchema from '../models/CheckoutSchema.js';
import CartSchema from '../models/CartSchema.js';
import ProductSchema from '../models/ProductSchema.js';
import OrderSchema from '../models/OrderSchema.js';

export const create = async(req, res) => {
    try {
        const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;
        if(!checkoutItems || checkoutItems.length === 0){
            return res.status(400).json({message: "Checkout items are required."});
        }
        const newCheckout = await CheckoutSchema.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            totalPrice: totalPrice,
            paymentStatus : "Pending",
            isPaid: false,
        });
        res.status(201).json({message : "Success", newCheckout});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}

export const updatePaid = async(req, res) => {
    try {
        const {paymentStatus, paymentDetails } = req.body;
        const checkoutId = req.params.id;
        const checkout = await CheckoutSchema.findById(checkoutId);
        if(!checkout){
            return res.status(404).json({message: "Checkout not found."});
        }
        if(paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json({message : "Checkout updated successfully.", checkout});
        } else {
            res.status(400).json({message : "Invalid Payment Status"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}

export const finalize = async(req, res) => {
    try {
        const checkout = await CheckoutSchema.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message: "Checkout not found."});
        }
        if(checkout.isPaid && !checkout.isFinalized) {
            // Create final order based on the checkout details
            const finalOrder = await OrderSchema.create({
                user : checkout.user,
                orderItems : checkout.checkoutItems,
                shippingAddress : checkout.shippingAddress,
                paymentMethod : checkout.paymentMethod,
                totalPrice : checkout.totalPrice,
                isPaid : true,
                paidAt : checkout.paidAt,
                isDelivered : false,
                paymentStatus : "paid",
                paymentDetails : checkout.paymentDetails,
            });

            //Mark the checkout
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
            //Delete the cart associated with user
            await CartSchema.findOneAndDelete({user : checkout.user});
            res.status(200).json({message : "Checkout finalized successfully.", finalOrder});
        } else if (checkout.isFinalized) {
            res.stauts(400).json({message : "Checkout already finalized"});
        } else {
            res.status(400).json({message : "Checkout not paid"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}