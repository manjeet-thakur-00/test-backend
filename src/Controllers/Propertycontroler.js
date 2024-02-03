import Page from '../Models/PropertyModel.js'
import envConfig from '../config/envConfig.js';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: envConfig.CLOUD_NAME,
    api_key: envConfig.API_KEY,
    api_secret: envConfig.API_SECRET


});
// createProperty
const createProperty = async (req, res) => {
    try {
        const { productName, title, description, price } = req.body;
        const { path: tempPath, filename } = req.file;
        if (!productName || !filename || !title || !description || !price) {
            return res.status(404).json({ message: 'all fields are requried' });
        }
        else {
            const { secure_url } = await cloudinary.uploader.upload(tempPath);
            const doc = new Page({
                image: secure_url,
                productName,
                title,
                description,
                price
            })
            const pageSave = await doc.save();

            return res.status(200).json({

                image: secure_url,
                productName,
                title,
                description,
                price
            })
        }


    } catch (error) {
        console.error("Error in create page", error)
        return res.status(500).json({ message: 'Error in create page', error })
    }
}



const getProduct = async (req, res) => {
    try {

        const findProduct = await Page.find()
        if (!findProduct) {
            return res.status(404).json({ message: 'product not found' });
        }
        else {
            return res.status(200).json({ message: 'product found ', findProduct });
        }
    } catch (error) {
        console.error("Error in get product", error)
        return res.status(500).json({ message: 'Error in get product', error })
    }
}

export { createProperty, getProduct }