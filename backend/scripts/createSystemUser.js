import mongoose from "mongoose";
import { User } from "../src/models/user.model.js";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

const MONGODB_URI = process.env.MONGODB_URI;

const createSystemUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    const email = "newsbot@newsx.com";

    let user = await User.findOne({ email });

    if (user) {
      console.log("System user already exists with ID:", user._id);
    } else {
      user = await User.create({
        fullName: "News Bot",
        username: "newsbot",
        email,
        password: "dummy-password", // Or generate a random one
        DOB: new Date("2000-01-01"),
        isVerified: true,
      });

      console.log("System user created with ID:", user._id);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating system user:", error);
    process.exit(1);
  }
};

createSystemUser();
