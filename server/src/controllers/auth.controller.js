import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendToken from "../utils/sendToken.js";
// import { upsertStreamUser } from "../lib/stream.js";
import handleStreamUser from "../utils/handleStreamUser.js";

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

    // Create Stream user
    await handleStreamUser(newUser, "created");

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
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error in Logout Controller : ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function onboard(req, res) {
  
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
          message: "All field are required",
          missingFields: [
            !fullName && "fullName",
            !bio && "bio",
            !nativeLanguage && "nativeLanguage",
            !learningLanguage && "learningLanguage",
            !location && "location",
          ].filter(Boolean),
        });
    }

    // Check if user exists
    const user = await User.findByIdAndUpdate(userId,{
        ...req.body,
        isOnboarded: true,
      },
      { new: true } // Return the updated user
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

   // update stream user Info
    await handleStreamUser(user, "updated");

    res.status(200).json({ message: "Onboarding successful", user });
  } catch (error) {
    console.error("Error in Onboard Controller : ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

