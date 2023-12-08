import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

export async function runDb() {
  try {
    await mongoose.connect(mongoURI!);
    console.log("it is ok");
  } catch (e) {
    console.log("no connection");
    await mongoose.disconnect();
  }
}
