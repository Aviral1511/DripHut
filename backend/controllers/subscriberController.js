import SubscriberSchema from "../models/SubscriberSchema.js";

export const handleSubscriber = async(req, res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message: "Email is required"});
        }
        let subscriber = await SubscriberSchema.findOne({email});
        if(subscriber){
            return res.status(400).json({message: "email already subscribed"});
        }

        // Create new Subscriber
        subscriber = new SubscriberSchema({email});
        await subscriber.save();
        return res.status(201).json({message: "Subscriber created successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server error"});
    }
}