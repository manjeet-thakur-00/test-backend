import UserRole from "../Models/adminModel.js";
import UserData from "../Models/UserModel.js";
import {
    validateEmail,
    validatePhoneNumber,
    validatepassword,
} from "../Utils/validation.js";
import bcrypt from "bcrypt";
// create role
const createRole = async (req, res) => {
    try {
        const { role } = req.body;
        console.log(role);
        const exisitingrole = await UserRole.findOne({ role });
        if (exisitingrole) {
            return res.status(500).json({ message: "role already exists" });
        }
        const newRole = new UserRole({ role });
        const saveRole = await newRole.save();
        if (saveRole) {
            return res.status(200).json({ message: "role created succesfully" });
        } else {
            return res.status(500).json({ message: "role not created" });
        }
    } catch (error) {
        console.error("Error in creating role", error);
        return res.status(500).json({ message: "error in create role", error });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword, mobileNo } = req.body;
        if (!userName || !email || !password || !confirmPassword || !mobileNo) {
            return res.status(401).json({ message: "all fields are required" });
        }

        const findEmail = await UserData.findOne({ email });
        if (findEmail) {
            return res.status(500).json({ message: "email already exists" });
        }

        const isEmailValid = validateEmail(email);
        if (!isEmailValid) {
            return res.status(500).json({ message: "please enter a valid email" });
        }

        const isPasswordValid = validatepassword(password);
        if (!isPasswordValid) {
            return res.status(500).json({
                message:
                    "please enter a password with a minimum of 8 characters, one uppercase letter, and one special character",
            });
        }

        const isPhoneNumberValid = validatePhoneNumber(mobileNo);
        if (!isPhoneNumberValid) {
            return res
                .status(500)
                .json({
                    message: "enter a valid phone number with a minimum of 10 characters",
                });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ message: "confirmPassword not matched" });
        }

        const salt = await bcrypt.genSalt(15);
        const hashPassword = await bcrypt.hash(password, salt);

        const userRole = await UserRole.findOne({ role: "admin" });
        const newUser = new UserData({
            userName,
            email,
            password: hashPassword,
            mobileNo,
            role: userRole,
        });

        const saveUser = await newUser.save();

        if (!saveUser) {
            return res.status(401).json({ message: "admin not created" });
        } else {
            return res.status(200).json({ message: "admin created successfully" });
        }
    } catch (error) {
        console.error("Error in creating admin", error);
        return res.status(500).json({ message: "error in creating admin", error });
    }
};

export { createRole, createAdmin };
