import { firestoreAdmin } from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const topicId = body?.topicId;

  try {
    // Parse Session Cookie for User
    const cookies = parseCookies(event);
    const sessionCookie = cookies?.__session;
    let decodedClaims;
    if (sessionCookie) {
      decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    }

    if (!decodedClaims) {
      return {
        statusCode: 400,
        data: JSON.stringify({
          error: "Could not find userId",
        }),
      };
    }

    // Find User's Progress
    const userId = decodedClaims?.user_id;
    const userRef = firestoreAdmin.collection("users");
    const userDocRef = userRef.doc(userId);
    const userSnapshot = await userDocRef.get();
    const userProgress = userSnapshot.data();

    // Delete topic from user's progress
    if (userProgress && userProgress.topics) {
      delete userProgress.topics[topicId];
      await userDocRef.update({ topics: userProgress.topics });
    }

    return {
      statusCode: 200,
      data: userProgress,
    };
  } catch (error) {
    console.error("Failed to update user's progress:", error);
    return {
      statusCode: 500,
      data: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});
