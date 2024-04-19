import { firestoreAdmin } from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const topicId = body?.topicId;
  const quizIds = body?.quizIds;
  const difficulty = body?.difficulty;

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

    // Find Topic from Firebase
    const topicsRef = firestoreAdmin.collection("topics");
    const topicDocRef = topicsRef.doc(topicId);
    const docSnapshot = await topicDocRef.get();
    const docExists = docSnapshot.exists;
    if (!docExists) {
      return {
        statusCode: 400,
        data: JSON.stringify({
          error: "Could not find topic",
        }),
      };
    }

    let topic = docSnapshot.data();

    // Update user progress given completed quizIds
    if (!userProgress?.topics) {
      userProgress.topics = {};
    }

    if (!userProgress.topics?.[topicId]) {
      userProgress.topics[topicId] = {
        difficulty: difficulty || 5,
        progress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
    }

    for (const quizId of quizIds) {
      const subtopicIndex = topic?.subtopics?.findIndex((subtopic) =>
        subtopic.quizzes.some((quiz) => quiz.quizId === quizId)
      );
      if (subtopicIndex == -1) {
        continue;
      }

      const quizIndex = topic?.subtopics[subtopicIndex]?.quizzes.findIndex(
        (quiz) => quiz.quizId === quizId
      );
      if (quizIndex == -1) {
        continue;
      }

      const currentProgress =
        userProgress.topics[topicId].progress[subtopicIndex];
      const newProgress = Math.max(currentProgress || 0, quizIndex + 1);
      userProgress.topics[topicId].progress[subtopicIndex] = newProgress;
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
