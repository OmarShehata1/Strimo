import { upsertStreamUser } from "../lib/stream.js";

const handleStreamUser = async (user, action = "created") => {
  try {
    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullName,
      image: user.profilePic || "",
    });
    console.log(`✔️  Stream user ${action} for ${user.fullName}`);
  } catch (error) {
    console.error(`❌ Error while trying to ${action} Stream user:`, error);
  }
};

export default handleStreamUser;