import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STRIMO_API_KEY;
const apiSecret = process.env.STRIMO_API_SECRET;

if (!apiKey || !apiSecret) {
 console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    if (!userData || !userData.id) {
        console.error("User data is missing or invalid");
        return;
      }
    
      // Check if the user already exists
      const existingUser = await streamClient.queryUsers({ id: userData.id });
    
      if (existingUser.users.length > 0) {
        console.log("User already exists in Stream");
        return existingUser.users[0];
      }
      // If the user doesn't exist, create a new one

    try {
        await streamClient.upsertUsers([userData]);
        return userData;
      } catch (error) {
        console.error("Error upserting Stream user:", error);
      }
}

//TODO: do it later
export const generateStreamToken = async (userId) => {

};