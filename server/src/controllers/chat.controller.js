import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    
    // Assuming you have a function to generate a token
    const token = generateStreamToken(req.user.id);
    if (!token) {
      return res.status(500).json({ message: "Failed to generate token" });
    }
    
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
 