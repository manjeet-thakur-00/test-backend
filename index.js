import express from "express";
import './src/config/db.js'
import cors from 'cors'
const app = express();
app.use(express.json());
import adminroute from "./src/Routes/adminRoute.js";
import userRoute from "./src/Routes/userRoute.js";
import router from "./src/Routes/PropertyRoutes.js";
import checkOut from "./src/Routes/Checkoutroute.js";
import logout from "./src/Routes/Logout.js";
app.use(cors());
app.use('/api/v1', userRoute)
app.use('/api/v1', adminroute)
app.use('/api/v1', router)
app.use('/api/vi', checkOut)
app.use('/api/v1',logout)

app.get("/", (req, res) => {
    res.send("welcom to Manjeet's page");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log('server is running👍👍👍👍👍', PORT)
    const error = false;
    if (error) {
        console.log('server is not running')
    }
})