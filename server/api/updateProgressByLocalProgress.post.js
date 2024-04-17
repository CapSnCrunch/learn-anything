import { firestoreAdmin } from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const localProgress = body?.localProgress;

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
    const userExists = userSnapshot.exists;

    let userProgress = {};
    if (userExists) {
      userProgress = userSnapshot.data();
    }

    // Update user progress given subtopic progresses
    if (!userProgress?.topics) {
      userProgress.topics = {};
    }

    for (const [topicId, subtopics] of Object.entries(localProgress)) {
      // Find Topic from Firebase
      const topicsRef = firestoreAdmin.collection("topics");
      const topicDocRef = topicsRef.doc(topicId);
      const docSnapshot = await topicDocRef.get();
      const docExists = docSnapshot.exists;
      if (!docExists) {
        console.warn(`Could not find topic ${topicId} to update progress`);
        continue;
      }

      if (!userProgress.topics?.[topicId]) {
        userProgress.topics[topicId] = {
          difficulty: 5,
          progress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
      }

      // Make each progress value the max of the saved value and the local one
      // (This way the use won't accidentally lose progress)
      const localProgressForSubtopic = subtopics.map(
        (subtopic) => subtopic?.progress
      );
      const oldProgresses = userProgress.topics[topicId].progress;
      const newProgresses = Array.from(
        {
          length: Math.max(
            localProgressForSubtopic.length,
            oldProgresses.length
          ),
        },
        (_, i) =>
          Math.max(localProgressForSubtopic[i] || 0, oldProgresses[i] || 0)
      );

      userProgress.topics[topicId].progress = newProgresses;
    }

    // Save user progress to Firebase
    await userDocRef.set(userProgress, { merge: true });

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
