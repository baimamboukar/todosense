import { config } from "dotenv";
import mongoose from "mongoose";
config();
const connectToMongo = () => {
  mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
      console.log("Connected to Mongo Successfully");
    })
    .catch(console.error());
};

export default connectToMongo;
