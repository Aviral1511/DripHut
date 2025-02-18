import User from "../models/UserSchema.js";

export const getAllAdmins = async(req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}

export const addAdmin = async(req, res) => {
    try {
        const {name, email, password, role} = req.body;
        let user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message : "Email already exists"});
        }
        user = new User({name, email, password, role : role || "customer"});
        await user.save();
        res.status(201).json({message : "User Created Successfully " , user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}

export const updateUser = async(req, res) => {
    try {
        const {user} = await User.findById(req.params.id);
        if(user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }
        const updateUser = await user.save();
        res.status(201).json({message : "User updated Successfully", user :updateUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}

export const deleteUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            await user.deleteOne();
            res.status(200).json({message : "User deleted Successfully"});
        } else {
            res.status(404).json({message : "User not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}