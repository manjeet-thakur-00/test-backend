import Jwt from "jsonwebtoken";
import UserData from "../Models/UserModel.js";
import UserRole from "../Models/adminModel.js";
import bcrypt from "bcrypt";
import {
    validateEmail,
    validatePhoneNumber,
    validatepassword,
} from '../Utils/validation.js'
import envConfig from "../config/envConfig.js";
import transporter from "../middleware/emailConfig.js";

const userRegister = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword, mobileNo } = req.body;
        if (!userName || !email || !password || !confirmPassword || !mobileNo) {
            return res.status(400).json({ message: "all field are requried" });
        }

        const findemail = await UserData.findOne({ email });
        if (findemail) {
            return res.status(401).json({ mesage: "email already exists" });
        }
        const isemailvalid = validateEmail(email);
        if (!isemailvalid) {
            return res.status(404).json({ message: "plz enter valid email" });
        }
        const isnumbervalid = validatePhoneNumber(mobileNo);
        if (!isnumbervalid) {
            return res
                .status(404)
                .json({ message: "phone number require 10 digits" });
        }
        const salt = await bcrypt.genSalt(15);
        const hashpassword = await bcrypt.hash(password, salt);

        const isvalidpassword = validatepassword(password);
        if (!isvalidpassword) {
            return res.status(404).json({
                message:
                    "password at least contain 8 chracter and one uppercase letter and one special letter ",
            });
        }

        if (password !== confirmPassword) {
            return res
                .status(201)
                .json({ message: "confirmpassword is not matched with  password " });
        }

        const userRole = await UserRole.findOne({ role: "user" });
        const newDoc = new UserData({
            userName,
            email,
            password: hashpassword,
            mobileNo,
            role: userRole._id,
        });
        const saveUser = newDoc.save();
        if (saveUser) {
            return res.status(200).json({ message: "user register succesfully" });
        } else {
            return res.status(500).json({ message: "user not register", error });
        }
    } catch (error) {
        console.error("Error in user registration", error);
        return res
            .status(500)
            .json({ message: "error in user registration", error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findemail = await UserData.findOne({ email }).populate("role");

        if (!findemail) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchpassword = await bcrypt.compare(password, findemail.password);

        if (!matchpassword) {
            return res.status(404).json({ message: "Wrong password" });
        }

        const token = Jwt.sign(
            {
                _id: findemail._id,
                userName: findemail.userName,
                email: findemail.email,
                mobileNo: findemail.phoneNumber,
                role: findemail.role,
            },
            envConfig.SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successfully", token });
    } catch (error) {
        console.error("Error in finding user:", error);
        return res.status(500).json({ message: "Error in finding user", error });
    }
};

// get all user
const getallUser = async (req, res) => {
    try {
        const finduser = await UserData.find({});
        if (!finduser) {
            return res.status(404).json({ message: "user not found" });
        } else {
            return res.status(200).json({ message: "user found", finduser });
        }
    } catch (error) {
        console.error("Error in finding user");
        return res.status(500).json({ message: "error in  finding user ", error });
    }
};

// getuser by id
const getuserByid = async (req, res) => {
    try {
        const userId = req.user?._id;
        const findbyid = await UserData.findById(userId);
        if (!findbyid) {
            return res.status(404).json({ message: "user not found" });
        } else {
            return res.status(200).json({ message: "user found by id", findbyid });
        }
    } catch (error) {
        console.error("Error in finding user");
        return res
            .status(500)
            .json({ message: "error in  finding user by id ", error });
    }
};

// update user by id
const upadteUserbyId = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { mobileNo } = req.body;
        const updatebyid = await UserData.findByIdAndUpdate(
            userId,
            { mobileNo },
            { new: true }
        );
        if (!updatebyid) {
            return res.status(400).json({ message: "user not updated" });
        } else {
            return res
                .status(200)
                .json({ message: "user updated succesfully", updatebyid });
        }
    } catch (error) {
        console.error("Error in updating user");
        return res
            .status(500)
            .json({ message: "error in  updating user by id ", error });
    }
};

// delete user by id
const deleteUserById = async (req, res) => {
    try {
        const userId = req.user?._id;
        const deleteuser = await UserData.findByIdAndDelete(userId);
        if (!deleteuser) {
            return res.status(404).json({ message: "user not delete" });
        } else {
            return res.status(200).json({ message: "user deleted succesfully" });
        }
    } catch (error) {
        console.error("Error in deleting user");
        return res
            .status(500)
            .json({ message: "error in  deleting user by id ", error });
    }
};

// forgot password
const sendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const user = await UserData.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "email not found" });
            } else {
                const genToken = Jwt.sign({ _id: user._id }, envConfig.SECRET_KEY, {
                    expiresIn: "1h",
                });
                const link = `http://localhost:3000/resetpass/?token=${genToken}`;
                await transporter.sendMail({
                    from: envConfig.EMAIL_USER,
                    to: email,
                    subject: "reset your passsword",
                    html: `click here to reset your password <a href=${link}>click here</a>`,
                });
                return res
                    .status(201)
                    .json({ messgae: " email is send plese check your email" });
            }
        }
    } catch (error) {
        console.error("Error in sending mail");
        return res.status(500).json({ message: "mail not sent", error });
    }
};

// reset password
const resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: 'No credentials sent!' });
        }

        console.log("check token", token);

        try {
            const decode = Jwt.verify(token, envConfig.SECRET_KEY);
            const user = await UserData.findById(decode._id);

            if (!newPassword) {
                return res.status(400).json({ message: "New password is required" });
            }

            if (!confirmPassword) {
                return res.status(400).json({ message: "Confirm password is required" });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "Confirm password does not match new password" });
            }

            const salt = await bcrypt.genSalt(10);
            const newHashpassword = await bcrypt.hash(newPassword, salt);
            user.password = newHashpassword;

            await user.save();
            return res.status(200).json({ message: "Password reset successfully" });
        } catch (tokenError) {
            console.error("Error decoding token", tokenError);
            return res.status(401).json({ message: "Invalid token", error: tokenError.message });
        }
    } catch (error) {
        console.error("Error resetting password", error);
        return res.status(500).json({ message: "Error in reset password", error });
    }
};

// change password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user?._id;
        const user = await UserData.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const oldpass = await bcrypt.compare(oldPassword, user.password);
        if (!oldpass) {
            return res.status(500).json({ message: "oldPassword is not matched" });
        }

        if (newPassword !== confirmPassword) {
            return res
                .status(500)
                .json({ message: "newpassword is not matched with confirmpassword " });
        }
        const salt = await bcrypt.genSalt(10);
        const newHashpassword = await bcrypt.hash(newPassword, salt);
        user.password = newHashpassword;
        const updateOne = await UserData.findByIdAndUpdate(
            userId,
            { password: newHashpassword },
            { new: true }
        );
        return res
            .status(200)
            .json({ message: "oldPassword is updated", updateOne });
    } catch (error) { }
};

export {
    userRegister,
    login,
    getallUser,
    getuserByid,
    upadteUserbyId,
    deleteUserById,
    sendEmail,
    resetPassword,
    changePassword
};
