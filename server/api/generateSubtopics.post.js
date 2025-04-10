import { GoogleGenerativeAI } from "@google/generative-ai";
import { firestoreAdmin } from "~/server/utils/firebase";
import { removeCodeBlock } from "~/server/utils/strings";

export default defineEventHandler(async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = await readBody(event);
  const topicId = body?.topicId;

  let progress = null;
  try {
    // Parse Session Cookie for User
    const cookies = parseCookies(event);
    const sessionCookie = cookies?.__session;
    let decodedClaims;
    if (sessionCookie) {
      decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    }

    // Find User's Progress
    const userId = decodedClaims?.user_id;
    const userRef = firestoreAdmin.collection("users");
    const userDocRef = userRef.doc(userId);
    const userSnapshot = await userDocRef.get();
    const userExists = userSnapshot.exists;

    if (userExists) {
      const userProgress = userSnapshot.data();
      progress = userProgress?.topics[topicId]?.progress;
    }
  } catch (error) {
    console.warn("Could not find user");
  }

  try {
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
    if (topic?.subtopics) {
      if (progress) {
        // Set Saved Progress for User
        topic.subtopics.forEach((subtopic, subtopicIndex) => {
          subtopic.progress = progress?.[subtopicIndex] || 0;
        });
      } else {
        // Set Default Progress
        topic.subtopics.forEach((subtopic) => {
          subtopic.progress = 0;
        });
      }

      return {
        statusCode: 200,
        data: {
          message: "Pre-generated subtopics located",
          subtopics: topic.subtopics,
        },
      };
    }

    // Generate Subtopics with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const subtopicPlanPrompt = `You are a helpful teacher trying to create a course plan for your students learning ${topic.name}. 
      Generate a list of units that will be covered in the course. For example, a course on machine learning might have
      the subtopics 'linear algebra review', 'linear regression', 'neural networks', and 'computer vision'.
      Your response should be a JSON object with an attribute 'subtopics' that is a list of JSON
      objects containing a 'name' (one or two words) and a 'description' (no more than 20 words describing the topic).
      Generate exactly 10 distinct subtopics for ${topic.name}. Order the subtopics in the order that would make the most sense for
      students to them in. IMPORTANT: Do not put the response in a code block, just send the stringified JSON as plain text.`;

    const subtopicResult = await model.generateContent(subtopicPlanPrompt);
    const subtopicResponse = subtopicResult.response;
    let subtopicText = subtopicResponse.text();

    // Strip code block if present
    const subtopicJsonResponse = JSON.parse(removeCodeBlock(subtopicText));

    // Save Subtopics to Firebase on Topic
    topicDocRef.update({
      subtopics: subtopicJsonResponse.subtopics,
    });

    // Set Default Progress
    subtopicJsonResponse.subtopics.forEach((subtopic) => {
      subtopic.progress = 0;
    });

    return {
      statusCode: 200,
      data: subtopicJsonResponse,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      statusCode: 500,
      data: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});
