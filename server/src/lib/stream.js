import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STRIMO_API_KEY;
const apiSecret = process.env.STRIMO_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userId = userId.toString();
    if (!userId) {
      throw new Error("User ID is required to generate a token");
    }
    const token = streamClient.createToken(userId);
    return token;
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};
