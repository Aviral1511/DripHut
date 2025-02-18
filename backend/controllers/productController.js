import express from 'express';
import ProductSchema from '../models/ProductSchema.js';

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, discountPrice, countInStock, category, brand, size, color, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;
        const product = new ProductSchema({
            name,
            price,
            description,
            discountPrice,
            category,
            brand,
            size,
            color,
            countInStock,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            collections,
            material,
            gender,
            images,
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json({ message: 'Product created successfully', createdProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, price, description, discountPrice, countInStock, category, brand, size, color, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;

        const product = await ProductSchema.findById(req.params.id);
        if (product) {
            //update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.size = size || product.size;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.color = color || product.color;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;
            // product.user = req.user._id;

            const updatedProduct = await product.save();
            res.status(200).json({ message: 'Product updated successfully', updatedProduct });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await ProductSchema.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
}

export const getProducts = async (req, res) => {
    try {
        const { size, color, collections, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit } = req.query;

        let query = {};

        //filter logic
        if (collections && collections.toLocaleLowerCase() !== 'all') {
            query.collections = collections;
        }
        if (category && category.toLocaleLowerCase() !== 'all') {
            query.category = category;
        }
        if (material) {
            query.material = { $in: material.split(",") };
        }
        if (brand) {
            query.brand = { $in: brand.split(",") };
        }
        if (size) {
            query.size = { $in: size.split(",") };
        }
        if (color) {
            query.color = { $in: color.split(",") };
        }
        if (gender) {
            query.gender = gender;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        //sort logic
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case 'priceAsc':
                    sort = { price: 1 };
                    break;
                case 'priceDesc':
                    sort = { price: -1 };
                    break;
                case 'popularity':
                    sort = { rating: -1 };
                    break;
                default : 
                    break;
            }
        }

        //fetch products and apply sorting and limit
        let products = await ProductSchema.find(query).sort(sort).limit(Number(limit) || 0);
        res.status(201).json({ message : " Sorted", products });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

export const getSingleProduct = async(req, res) => {
    try {
        const product = await ProductSchema.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error'});        
    }
}

export const similarProducts = async(req, res) => { 
    try {
        const {id} = req.params;

        const product = await ProductSchema.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const similarProducts = await ProductSchema.find({
            _id : {$ne : id}, // exclude current product ID
            category : product.category,
            gender : product.gender,
        }).limit(4);
        console.log(similarProducts);
        res.status(201).json(similarProducts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error'});        
    }
}

export const bestSeller = async(req, res) => {
    try {
        const bestSeller = await ProductSchema.findOne().sort({ rating : -1 });
        if(bestSeller) res.status(201).json({ bestSeller });
        else {
            res.status(404).json({ message: 'No best seller found' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error'});        
    }
}

export const newArrivals = async(req, res) => {
    try {
        const newArrivals = await ProductSchema.find().sort({ createdAt : -1 }).limit(8);
        // console.log(newArrivals);
        res.status(201).json({ newArrivals });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error'});        
    }
}