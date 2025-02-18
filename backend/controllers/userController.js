import User from '../models/UserSchema.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        user = new User({ name: name, email: email, password: password });
        await user.save();
        
        //Create JWT PAYLOAD
        const payload = { user: { id: user._id, role: user.role } };
        //sign in and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "48h" }, (err, token) => {
            if (err) {
                throw err;
            }
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token, message: "User Created Successfully"
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid email' });
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({ message: 'Wrong password' });
        }
        //Create JWT PAYLOAD
        const payload = { user: { id: user._id, role: user.role } };

        //sign in and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "48h" }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token, message: "User Logged in Successfully"
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const logout = async (req, res) => {

}

export const getUserProfile = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}