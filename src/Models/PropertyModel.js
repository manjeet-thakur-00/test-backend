// code of user schema 
import mongoose from "mongoose";


const pageSchema = new mongoose.Schema({
    productName: { type: String, require: false },
    image: { type: String, require: false },
    title: { type: String, require: false },
    description: { type: String, require: false },
    price: { type: String, require: false },
});

const Page = mongoose.model('Page', pageSchema)
export default Page;    