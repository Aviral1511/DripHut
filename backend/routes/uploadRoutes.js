import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
cloudinary.v2;
import streamifier from 'streamifier';
import { configDotenv } from 'dotenv';

//Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

//Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ message: "No image uploaded" });
        }

        //Function to handle the stream upload
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });

                //Use streamliner to convery file buuffer to stream
                const streamliner = streamifier.createReadStream(fileBuffer).pipe(stream);

                //Respond with uploaded image url
                res.json({imageUrl : result.secure_url});
            })
        }
    } catch (error) {
       console.log(error); 
       res.status(500).json({message : "Internal Server error"});
    }
});

export default router;