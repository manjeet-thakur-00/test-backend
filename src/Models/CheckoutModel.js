import mongoose from "mongoose";
import checkOut from "../Routes/Checkoutroute";

const checkoutSchema = new mongoose.model({
    userName: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', require: false },
    email: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', require: false },
    mobileNo: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', require: false },
    address: { type: String, require: false }
})


const Checkout = new mongoose.model('Checkout', checkoutSchema)
export default checkOut