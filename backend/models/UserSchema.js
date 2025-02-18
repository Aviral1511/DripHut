import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match : [/.+\@.+\..+/, "Please enter a valid email address"],
        // match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Password must be at least 6 characters"],
    },
    role : {
        type : String,
        enum: ["customer", "admin"],
        default : "customer",
    },
},{timestamps : true});

//Password Hash middleware
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

//Match User entered password to Hashed password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword, this.password);
};

// export default mongoose.models.User || mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);
