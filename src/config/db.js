import mongoose from "mongoose";
import envConfig from "./envConfig.js";

mongoose
  .connect(envConfig.DB_URL)
  .then(() => {
    console.log("Database is connected👍👍👍");
  })
  .catch(() => {
    console.log("Database is not connected👎👎");
  });
