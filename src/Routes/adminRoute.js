import express from "express";
import { createRole, createAdmin } from "../Controllers/adminController.js";
const adminroute = express();

adminroute.post("/create-role", createRole);
adminroute.post("/create-admin", createAdmin);

export default adminroute;
