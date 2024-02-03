import express from 'express'
import { verifyToken } from '../Controllers/LogoutControler.js';
import cors from 'cors'
const logout = express();
logout.use(cors())
logout.post('/logout', verifyToken, (req, res) => {


    res.json({ message: 'Logout successful' });
});

export default logout
