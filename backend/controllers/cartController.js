import express from 'express';
import CartSchema from '../models/CartSchema.js';
import ProductSchema from '../models/ProductSchema.js';

const getCart = async (userId, guestId) => {
    if (userId) {
        return await CartSchema.findOne({ userId });
    } else if (guestId) {
        return await CartSchema.findOne({ guestId });
    }
    return null;
}

export const addProduct = async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await ProductSchema.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        //Determine is user is logged in or guest
        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId && product.size === size && product.color === color);
            if (productIndex > -1) {
                //If product already exists, update the quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                //If product does not exist, add it to the cart
                cart.products.push({
                    productId: productId,
                    quantity: quantity,
                    size: size,
                    color: color,
                    name: product.name,
                    price: product.price,
                    image: product.images[0].url,
                });
            }
            
            //Recalculate the total Price
            cart.totalPrice = cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
            await cart.save();
            return res.status(200).json({ message: 'Product added to cart successfully', cart });
        } else {
            //If cart does not exist, create a new one
            const newCart = await CartSchema.create({
                userId: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId: productId,
                        quantity: quantity,
                        size: size,
                        color: color,
                        name: product.name,
                        price: product.price,
                        image: product.images[0].url,
                    },
                ],
                totalPrice: product.price * quantity,
            });
            // console.log(newCart);
            return res.status(200).json({ message: 'Product added to cart successfully', cart : newCart});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

export const updateProduct = async(req, res) => {
    try {
        const { productId, quantity, size, color, guestId, userId } = req.body;
        // console.log(guestId, userId);
        let cart = await getCart(userId, guestId);
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }
        // console.log(cart);
        const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId && product.size === size && product.color === color);
        if(productIndex !== -1) {
            if(quantity > 0){
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1); // remove product if quantity 0
            }
            
            cart.totalPrice = cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
            await cart.save();
            return res.status(200).json({ message: 'Product updated successfully', cart });
        } else {
            return res.status(404).json({message : "Product not found in cart"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error'});        
    }
};

export const deleteProduct = async(req, res) => {
    try {
        const { productId, size, color, guestId, userId } = req.body;
        let cart = await getCart(userId, guestId);
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId && product.size === size && product.color === color);
        if(productIndex > -1) {
            cart.products.splice(productIndex, 1); // remove product from cart
            cart.totalPrice = cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
            await cart.save();
            return res.status(200).json({ message: 'Product deleted successfully', cart });
        } else {
            return res.status(404).json({message : "Product not found in cart"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error'});        
    }
};

export const getUserCart = async(req, res) => {
    try {
        const {userId, guestId} = req.query;
        const cart = await getCart(userId, guestId);
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' });
        } else {
            res.status(201).json({ message: 'Cart found', cart });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error'});        
    }
}

export const mergeGuestCart = async(req, res) => {
    try {
        const {guestId} = req.body;
        const guestCart = await CartSchema.findOne({guestId});
        const userCart = await CartSchema.findOne({userId: req.user._id});

        if(guestCart) {
            if(guestCart.products.length === 0){
                return res.status(400).json({message : "Guest cart is empty"});
            }
            if(userCart) {
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((item) => item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && item.color === guestItem.color);

                    if(productIndex > -1){
                        //If items exist in user cart, update quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });
                
                userCart.totalPrice = userCart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                await userCart.save();

                //Remove guest cart after merging
                try {
                    await CartSchema.findOneAndDelete({guestId});
                } catch (error) {
                    console.log("Error deleting guest cart", error);
                }
                res.status(200).json({ message: "Cart merged Successfully", userCart });
            } else {
                //If user cart does not exist, assign guest cart to it
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json({ message: "Cart merged Successfully", guestCart });
            }
        } else {
            //guest acrt already merged
            if(userCart){
                return res.status(200).json({userCart});
            }
            res.status(404).json({message : "Guest Cart not found"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error'});        
    }
}