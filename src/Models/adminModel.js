import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    role: {
        type: String,
        required: false,
        enum: ["admin", "user"],
        default: "user",
    }
});

const UserRole = mongoose.model('UserRole', adminSchema);
export default UserRole;
