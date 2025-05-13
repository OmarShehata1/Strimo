export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId },// Exclude current user
         _id: { $nin: currentUser.friends } }, // Exclude friends of current user
        { isOnboarding: true },
      ],
    });
    res.status(200).json(recommendedUsers);

  } catch (error) {
    console.error("Error fetching recommended users in { getRecommendedUsers }:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
    try {
        const UserId = req.user.id;
        const currentUser = await User.findById(UserId).select("friends")
            .populate("friends", 'fullName profilePic nativeLanguage learningLanguage');
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(currentUser.friends);

    } catch (error) {
        console.error("Error fetching friends in { getMyFriends }:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
