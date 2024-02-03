import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, require: false },
    email: { type: String, require: false },
    password: { type: String, require: false },
    confirmPassword: { type: String, require: false },
    mobileNo: { type: String, require: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "UserRole", require: false }
})
const UserData = mongoose.model('UserData', userSchema)
export default UserData