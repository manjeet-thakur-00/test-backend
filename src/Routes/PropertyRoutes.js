// code of routes
import express from 'express'
const router = express();
import { createProperty, getProduct } from '../Controllers/Propertycontroler.js';
import multer from 'multer';
// confrigration of multer 
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const name = Date.now() + '_' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage: storage });
router.post('/createproperty', upload.single("image"), createProperty);
router.get('/getproduct', getProduct)

export default router
