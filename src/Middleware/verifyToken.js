import Jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    try {
        Jwt.verify(token, envConfig.SECRET_KEY, (error, user) => {
            if (error) {
                console.log(error);
                return res.status(401).json({ message: "Invalid token", error });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Invalid token", error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export { verifyToken };
