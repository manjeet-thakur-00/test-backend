
import Jwt from 'jsonwebtoken'
import envConfig from '../config/envConfig.js';



const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    Jwt.verify(token, envConfig.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

export { verifyToken }

