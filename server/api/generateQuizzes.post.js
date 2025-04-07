import axios from "axios"
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

    if (!decodedClaims) {
      console.warn("Could not find userId");
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
    if (
      topic?.subtopics &&
      topic?.subtopics.every((subtopic) => subtopic?.quizzes?.length > 0)
    ) {
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

    // Generate quizzes within each subtopic
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const quizPromises = [];
    for (const subtopic of topic?.subtopics) {
      const quizPlanPrompt = `You are a helpful teacher trying to create a course plan for your students learning ${topic.name}. The course
        consists of several units. Write a lesson plan for 7 sub-units in the form of quizzes within the unit ${subtopic.name} which covers 
        '${subtopic.description}'. For example, the unit 'HTML' in the 'Web Development' course might include quizzes on 'basic elements', 
        'input elements', etc. Your response should be a JSON object with an attribute 'quizzes' that is a list of JSON objects containing 
        a 'description' (no more than 10 words describing what the sub-unit will cover) and a 'quizId' (a short, unique, lowercase kebab-case
        identifier for this quiz). Generate exactly 7 distinct quizzes for ${subtopic.name}.  Order the quizzes in the order that would make 
        the most sense for students to learn them in. IMPORTANT: Do not put the response in a code block, just send the stringified JSON as 
        plain text. DO NOT PUT THE ANSWERS OR THE DIFFICULTY IN THE ACTUAL QUESTION STRING.`;

      const quizPromise = model.generateContent(quizPlanPrompt);
      quizPromises.push(quizPromise);
    }

    const quizzes = await Promise.all(quizPromises);
    topic.subtopics.forEach((subtopic, index) => {
      const quizReponse = quizzes[index].response;
      let quizText = quizReponse.text();
      const quizJsonResponse = JSON.parse(removeCodeBlock(quizText));
      subtopic.quizzes = quizJsonResponse?.quizzes;
    });

    // Set Default Progress
    const quizIds = []
    topic.subtopics.forEach((subtopic) => {
      subtopic.progress = 0;
      quizIds.push(subtopic?.quizzes[0].quizId)
    });

    try {
      const baseURL = process.env.VERCEL_ENV === "production" ? process.env.SERVER_URL : process.env.LOCAL_URL
      axios.post(`${baseURL}/api/generateQuestions`, {
        topicId: topicId,
        quizIds: quizIds,
        difficulty: 5,
        count: 2,
      });
    } catch (error) {
      console.warn(`Failed to call generateQuestions for ${quizIds}`, error)
    }

    topicDocRef.update({
      subtopics: topic.subtopics,
    });

    return {
      statusCode: 200,
      data: topic,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      statusCode: 500,
      data: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
});
