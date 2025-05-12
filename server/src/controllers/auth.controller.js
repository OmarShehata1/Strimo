import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendToken from "../utils/sendToken.js";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const profilePic = `https://avatar.iran.liara.run/public/${idx}.png`; // create a random profile picture Avatar

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic,
    });

    try {
    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "",
    });
    console.log(`✔️  Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.error(" Error Create Stream user: ", error);
    }


    // Generate JWT token and send it
    sendToken(newUser, res);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error in SignUp Controller : ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}


export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All field are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    sendToken(user, res);

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error in Login Controller : ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export function logout(req, res) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success:true ,message: "Logout successful" });
  } catch (error) {
    console.error("Error in Logout Controller : ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}



export default {
  signup,
  login,
  logout,
  
};
